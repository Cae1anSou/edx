import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

function parseCourse(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  const marker = '/courses/';
  if (!clean.startsWith(marker)) return '';
  const tail = clean.slice(marker.length).split('/');
  const stop = tail.findIndex((seg) => ['cohorts', 'discussion', 'instructor', 'about', 'progress', 'courseware', 'dates'].includes(seg));
  const keyParts = stop >= 0 ? tail.slice(0, stop) : tail;
  return decodeURIComponent(keyParts.join('/'));
}

export function LmsCohortsPage() {
  const location = useLocation();
  const courseKey = useMemo(() => parseCourse(location.pathname), [location.pathname]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-cohorts">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Course</span><span>Cohorts Management</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/instructor-tools">Instructor Tools</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Cohorts & Discussions</h2><p className="legacy-v1-muted">Course Key: {courseKey || '(not detected)'}</p><p>Compatibility page for legacy routes like <code>/courses/&lt;course&gt;/cohorts/*</code> and discussion settings.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
