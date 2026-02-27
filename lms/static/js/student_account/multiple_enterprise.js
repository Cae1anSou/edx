(function(define) {
    'use strict';

    define(['jquery', 'js/student_account/utils', 'jquery.cookie'], function($, Utils) {
        var MultipleEnterpriseInterface = {

            urls: {
                learners: '/enterprise/api/v1/enterprise-learner/',
                multipleEnterpriseUrl: '/enterprise/select/active/?success_url=',
                enterpriseActivationUrl: '/enterprise/select/active'
            },

            buildHeaders: function(username) {
                var headers = {
                    'X-CSRFToken': $.cookie('csrftoken')
                };
                if (username) {
                    headers['X-User-Id'] = username;
                    // Spring enterprise learner API requires this permission header.
                    headers['X-Permissions'] = 'enterprise:learner:read';
                }
                return headers;
            },

            normalizeLearnerResponse: function(response) {
                var payload = (response && response.data) ? response.data : response,
                    items = [],
                    count = 0;

                if (!payload) {
                    return {count: 0, results: []};
                }

                if ($.isArray(payload.results)) {
                    return payload;
                }

                if ($.isArray(payload.items)) {
                    items = payload.items;
                    count = payload.total || items.length;
                    return {
                        count: count,
                        results: items.map(this.normalizeLearnerItem, this)
                    };
                }

                if ($.isArray(payload)) {
                    return {
                        count: payload.length,
                        results: payload.map(this.normalizeLearnerItem, this)
                    };
                }

                return {
                    count: 1,
                    results: [this.normalizeLearnerItem(payload)]
                };
            },

            normalizeLearnerItem: function(item) {
                if (item && item.enterprise_customer && item.enterprise_customer.uuid) {
                    return item;
                }
                if (item && item.enterpriseId) {
                    return $.extend({}, item, {
                        enterprise_customer: {
                            uuid: item.enterpriseId
                        }
                    });
                }
                return item;
            },

            /**
             * Fetch the learner data, then redirect the user to a enterprise selection page if multiple
             * enterprises were found.
             * @param  {string} nextUrl The URL to redirect to after multiple enterprise selection or incase
             * the selection page is bypassed e.g. when dealing with direct enrolment urls.
             */
            check: function(nextUrl, edxUserInfoCookieName) {
                var view = this;
                var selectionPageUrl = this.urls.multipleEnterpriseUrl + encodeURIComponent(nextUrl);
                var username = Utils.userFromEdxUserCookie(edxUserInfoCookieName).username;
                this.currentUsername = username;
                var next = nextUrl || '/';
                var enterpriseInUrl = this.getEnterpriseFromUrl(nextUrl);
                var userInEnterprise = false;
                var userWithMultipleEnterprises = false;
                $.ajax({
                    url: this.urls.learners + '?username=' + username,
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    headers: this.buildHeaders(username),
                    context: this
                }).fail(function() {
                    view.redirect(next);
                }).done(function(response) {
                    response = view.normalizeLearnerResponse(response);
                    userWithMultipleEnterprises = (response.count > 1);
                    if (userWithMultipleEnterprises) {
                        if (enterpriseInUrl) {
                            userInEnterprise = view.checkEnterpriseExists(response, enterpriseInUrl);
                            if (userInEnterprise) {
                                view.activate(enterpriseInUrl).fail(function() {
                                    view.redirect(selectionPageUrl);
                                }).done(function() {
                                    view.redirect(next);
                                });
                            } else {
                                view.redirect(selectionPageUrl);
                            }
                        } else {
                            view.redirect(selectionPageUrl);
                        }
                    } else {
                        view.redirect(next);
                    }
                });
            },

            redirect: function(url) {
                window.location.href = url;
            },

            activate: function(enterprise) {
                return $.ajax({
                    url: this.urls.enterpriseActivationUrl,
                    method: 'POST',
                    headers: this.buildHeaders(this.currentUsername),
                    data: {enterprise: enterprise}
                });
            },

            getEnterpriseFromUrl: function(url) {
                var regex;
                // eslint-disable-next-line prefer-regex-literals
                regex = RegExp('/enterprise/.*/course/.*/enroll');
                if (typeof url !== 'string' || !regex.test(url)) {
                    // eslint-disable-next-line no-void
                    return void 0;
                }
                return url.split('/')[2];
            },

            checkEnterpriseExists: function(response, enterprise) {
                return response.results.some(function(item) {
                    return item.enterprise_customer.uuid === enterprise;
                });
            }
        };

        return MultipleEnterpriseInterface;
    });
}).call(this, define || RequireJS.define);
