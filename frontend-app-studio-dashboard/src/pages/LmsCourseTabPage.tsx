import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

function parseCourse(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  const marker = '/courses/';
  if (!clean.startsWith(marker)) return '';
  const tail = clean.slice(marker.length).split('/');
  const stop = tail.findIndex((seg) => ['about', 'progress', 'courseware', 'dates', 'teams', 'discussion', 'instructor', 'bookmarks', 'tab', 'lti_tab'].includes(seg));
  const keyParts = stop >= 0 ? tail.slice(0, stop) : tail;
  return decodeURIComponent(keyParts.join('/'));
}

function parseTabHint(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const tabIndex = parts.findIndex((p) => p === 'tab' || p === 'lti_tab');
  if (tabIndex >= 0 && parts[tabIndex + 1]) return decodeURIComponent(parts[tabIndex + 1]);
  return parts[parts.length - 1] ? decodeURIComponent(parts[parts.length - 1]) : '';
}

export function LmsCourseTabPage() {
  const location = useLocation();
  const courseKey = useMemo(() => parseCourse(location.pathname), [location.pathname]);
  const tabHint = useMemo(() => parseTabHint(location.pathname), [location.pathname]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-course-tab">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Course</span><span>Tab</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/courses">Course Catalog</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Tab Content</h2><p className="legacy-v1-muted">Course Key: {courseKey || '(not detected)'}</p><p className="legacy-v1-muted">Tab: {tabHint || '(not detected)'}</p><p>Mapped from legacy LMS routes: <code>/courses/&lt;course&gt;/tab/&lt;tab_type&gt;/</code>, <code>/courses/&lt;course&gt;/lti_tab/&lt;provider_uuid&gt;/</code> and slug tabs.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
