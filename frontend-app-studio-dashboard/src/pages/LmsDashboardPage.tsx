import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchBookmarks,
  fetchLegacyDashboard,
  fetchLearnerHome,
  fetchNotificationCount,
  fetchEntitlements
} from '../api/studio';

type CourseCard = {
  id: string;
  title: string;
  link: string;
  org: string;
  run: string;
};

type ActivationMessage = {
  text: string;
  tags: string;
};

function toCourseCards(raw: unknown): CourseCard[] {
  const objectData = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const fromCourses = Array.isArray(objectData.courses)
    ? objectData.courses
    : Array.isArray((objectData.results as Record<string, unknown> | undefined)?.courses)
      ? ((objectData.results as Record<string, unknown>).courses as unknown[])
      : [];

  if (fromCourses.length === 0) {
    return [];
  }

  return fromCourses.map((item, idx) => {
    const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    return {
      id: String(row.id ?? row.course_id ?? idx),
      title: String(row.display_name ?? row.title ?? `Course ${idx + 1}`),
      link: String(row.course_url ?? row.url ?? '/courses/'),
      org: String(row.org ?? row.organization ?? 'Open edX'),
      run: String(row.run ?? row.course_run ?? 'Current')
    };
  });
}

function toNotifications(raw: unknown): string[] {
  const objectData = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const bannerKeys = ['banner_account_activation_message', 'enrollment_message', 'enterprise_message'];
  return bannerKeys
    .map((key) => objectData[key])
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

function toActivationMessages(raw: unknown): ActivationMessage[] {
  const objectData = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const rows = objectData.account_activation_messages;
  if (!Array.isArray(rows)) {
    return [];
  }
  const messages: ActivationMessage[] = [];
  for (const row of rows) {
    if (typeof row === 'string' && row.trim().length > 0) {
      messages.push({ text: row, tags: '' });
      continue;
    }
    if (!row || typeof row !== 'object') {
      continue;
    }
    const item = row as Record<string, unknown>;
    const text = typeof item.message === 'string'
      ? item.message
      : typeof item.text === 'string'
        ? item.text
        : typeof item.value === 'string'
          ? item.value
          : '';
    if (text.trim().length === 0) {
      continue;
    }
    messages.push({
      text,
      tags: typeof item.tags === 'string' ? item.tags : ''
    });
  }
  return messages;
}

function toDashboardMeta(raw: unknown): { displayDashboardCourses: boolean; emptyMessage?: string; activateMessage?: string; showLoadAll: boolean } {
  const objectData = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    displayDashboardCourses: objectData.display_dashboard_courses !== false,
    emptyMessage: typeof objectData.empty_dashboard_message === 'string' ? objectData.empty_dashboard_message : undefined,
    activateMessage: typeof objectData.activate_account_message === 'string' ? objectData.activate_account_message : undefined,
    showLoadAll: Boolean(objectData.show_load_all_courses_link)
  };
}

export function LmsDashboardPage() {
  const location = useLocation();
  const dashboardSubpath = location.pathname.replace(/^\/dashboard\/?/, '');
  const [searchInput, setSearchInput] = useState('');

  const dashboardQuery = useQuery({ queryKey: ['lms-dashboard'], queryFn: fetchLegacyDashboard });
  const learnerHomeQuery = useQuery({ queryKey: ['lms-learner-home'], queryFn: fetchLearnerHome });
  const bookmarksQuery = useQuery({ queryKey: ['lms-bookmarks'], queryFn: fetchBookmarks });
  const notificationCountQuery = useQuery({ queryKey: ['lms-notification-count'], queryFn: fetchNotificationCount });
  const entitlementsQuery = useQuery({ queryKey: ['lms-entitlements'], queryFn: fetchEntitlements });

  const courseCards = useMemo(() => {
    const parsed = toCourseCards(dashboardQuery.data);
    if (parsed.length > 0) {
      return parsed;
    }
    return [
      {
        id: 'demo-1',
        title: 'Introduction to Computer Science',
        link: '/courses/course-v1:edX+DemoX+2026_T1/about',
        org: 'edX',
        run: '2026_T1'
      },
      {
        id: 'demo-2',
        title: 'Learning Analytics Foundations',
        link: '/courses/course-v1:edX+Analytics+2026/about',
        org: 'edX',
        run: '2026'
      }
    ];
  }, [dashboardQuery.data]);

  const filteredCourses = useMemo(() => {
    const keyword = searchInput.trim().toLowerCase();
    if (!keyword) {
      return courseCards;
    }
    return courseCards.filter((course) => `${course.title} ${course.org} ${course.run}`.toLowerCase().includes(keyword));
  }, [courseCards, searchInput]);

  const dashboardBanners = useMemo(() => toNotifications(dashboardQuery.data), [dashboardQuery.data]);
  const activationMessages = useMemo(() => toActivationMessages(dashboardQuery.data), [dashboardQuery.data]);
  const dashboardMeta = useMemo(() => toDashboardMeta(dashboardQuery.data), [dashboardQuery.data]);

  const bookmarks = Array.isArray((bookmarksQuery.data as { results?: unknown[] } | undefined)?.results)
    ? (((bookmarksQuery.data as { results?: unknown[] }).results ?? []).length)
    : 0;

  return (
    <main id="main" aria-label="Content" tabIndex={-1} className="container legacy-v1-shell legacy-v1-lms-dashboard">
      <section className="legacy-v1-dashboard-notifications dashboard-notifications" tabIndex={-1}>
        {dashboardBanners.map((message, idx) => (
          <div key={`${idx}-${message.slice(0, 20)}`} className="legacy-v1-dashboard-banner">{message}</div>
        ))}
        {activationMessages.length > 0 ? (
          <div className="activation-message-container">
            {activationMessages.map((item, idx) => (
              <div
                key={`${idx}-${item.text.slice(0, 20)}`}
                className={`account-activation ${item.tags}`.trim()}
                role="alert"
                aria-label="Account Activation Message"
                tabIndex={-1}
              >
                <div className="message-copy">{item.text}</div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section id="dashboard-main" className="legacy-v1-lms-main dashboard">
        <div className="legacy-v1-lms-main-container main-container">
          <div id="my-courses" className="legacy-v1-my-courses my-courses">
            <header className="legacy-v1-lms-courses-header">
              <h1>My Courses</h1>
              <nav className="legacy-v1-mast-actions" aria-label="Dashboard actions">
                <Link to="/courses" className="legacy-v1-link-btn">Course Catalog</Link>
                <Link to="/course/" className="legacy-v1-link-btn">Studio</Link>
              </nav>
            </header>

            {dashboardQuery.isLoading ? <p className="legacy-v1-muted">Loading dashboard...</p> : null}
            {dashboardQuery.error ? <p className="error-text">Failed to load dashboard.</p> : null}

            {filteredCourses.length > 0 ? (
              <ul className="legacy-v1-listing listing-courses">
                {filteredCourses.map((course) => (
                  <li key={course.id}>
                    <article className="legacy-v1-course-card">
                      <div>
                        <h3><a href={course.link}>{course.title}</a></h3>
                        <p className="legacy-v1-meta">{course.org} · {course.run}</p>
                      </div>
                      <div className="legacy-v1-card-actions">
                        <a href={course.link}>View Course</a>
                        <a href={`/courses/${encodeURIComponent(course.id)}/progress`}>Progress</a>
                        <a href={`/courses/${encodeURIComponent(course.id)}/discussion`}>Discussion</a>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="legacy-v1-empty-dashboard empty-dashboard-message">
                {dashboardMeta.displayDashboardCourses ? (
                  <>
                    <p>You are not enrolled in any courses yet.</p>
                    {dashboardMeta.emptyMessage ? <p className="legacy-v1-muted">{dashboardMeta.emptyMessage}</p> : null}
                    <a className="legacy-v1-btn legacy-v1-btn-primary" href="/courses">Explore courses</a>
                  </>
                ) : (
                  <>
                    <p>Activate your account!</p>
                    {dashboardMeta.activateMessage ? <p className="legacy-v1-muted">{dashboardMeta.activateMessage}</p> : null}
                  </>
                )}
              </div>
            )}

            {dashboardMeta.showLoadAll ? (
              <p className="legacy-v1-muted">
                Results successfully populated, <a href="/dashboard?course_limit=None">Click to load all enrolled courses</a>
              </p>
            ) : null}
          </div>
        </div>

        <aside className="legacy-v1-lms-side-container" role="complementary" aria-label="messages">
          <div className="legacy-v1-dashboard-search" role="search" aria-label="Dashboard">
            <form
              className="legacy-v1-dashboard-search-form"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label htmlFor="dashboard-search-input">Search Your Courses</label>
              <div className="legacy-v1-dashboard-search-field-wrap">
                <input
                  id="dashboard-search-input"
                  type="text"
                  className="legacy-v1-dashboard-search-field"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
                <button type="submit" className="legacy-v1-dashboard-search-btn">Search</button>
                <button type="button" className="legacy-v1-dashboard-cancel-btn" onClick={() => setSearchInput('')}>Clear</button>
              </div>
            </form>
          </div>

          <div className="legacy-v1-sidebar legacy-v1-lms-sidebar">
            <h2>Activity</h2>
            {learnerHomeQuery.isLoading ? <p className="legacy-v1-muted">Loading learner highlights...</p> : null}
            {learnerHomeQuery.error ? <p className="error-text">Failed to load learner home.</p> : null}
            <p>Bookmarks: {bookmarks}</p>
            <p>Notifications API: {notificationCountQuery.isError ? 'error' : 'ok'}</p>
            <p>Entitlements API: {entitlementsQuery.isError ? 'error' : 'ok'}</p>
            {dashboardSubpath ? <p className="legacy-v1-muted">Path context: {decodeURIComponent(dashboardSubpath)}</p> : null}
            <p className="legacy-v1-muted">Current route: {location.pathname}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
