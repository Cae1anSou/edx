import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

function parseCourse(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  const marker = '/courses/';
  if (!clean.startsWith(marker)) {
    return '';
  }
  const tail = clean.slice(marker.length).split('/');
  const stop = tail.findIndex((seg) => ['about', 'progress', 'courseware', 'dates', 'teams', 'discussion', 'instructor'].includes(seg));
  const keyParts = stop >= 0 ? tail.slice(0, stop) : tail;
  return decodeURIComponent(keyParts.join('/'));
}

export function LmsCourseDiscussionPage() {
  const location = useLocation();
  const courseKey = useMemo(() => parseCourse(location.pathname), [location.pathname]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-course-discussion">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">LMS Course</span>
            <span>Discussion</span>
          </h1>
          <p>Legacy LMS discussion board page shell.</p>
        </div>
      </section>
      <section className="legacy-v1-subnav">
        <Link to="/dashboard">My Courses</Link>
        <Link to="/courses">Course Catalog</Link>
      </section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <div className="legacy-v1-main">
          <section className="create-form">
            <h2>Discussion Topics</h2>
            <p className="legacy-v1-muted">Course Key: {courseKey || '(not detected)'}</p>
            <p>Mapped from legacy LMS route: <code>/courses/&lt;course&gt;/discussion/</code>.</p>
          </section>
        </div>
        <aside className="legacy-v1-sidebar">
          <h2>Path</h2>
          <p className="legacy-v1-muted">{location.pathname}</p>
        </aside>
      </section>
    </main>
  );
}
