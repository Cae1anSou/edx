import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

export function LmsCourseXblockRoutePage() {
  const location = useLocation();
  const params = useParams<{ coursePath?: string; usageKey?: string; handlerName?: string; viewName?: string }>();
  const mode = useMemo(() => {
    if (location.pathname.includes('/handler_noauth/')) return 'handler_noauth';
    if (location.pathname.includes('/handler/')) return 'handler';
    if (location.pathname.includes('/view/')) return 'view';
    return 'xblock';
  }, [location.pathname]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-course-xblock">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">LMS Course</span>
            <span>XBlock Route</span>
          </h1>
          <p>Legacy LMS course xblock route shell.</p>
        </div>
      </section>
      <section className="legacy-v1-subnav">
        <Link to="/dashboard">My Courses</Link>
        <Link to="/courses">Course Catalog</Link>
      </section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <div className="legacy-v1-main">
          <section className="create-form">
            <h2>XBlock {mode}</h2>
            <p className="legacy-v1-muted">Course: {params.coursePath ?? '(missing)'}</p>
            <p className="legacy-v1-muted">Usage: {params.usageKey ?? '(missing)'}</p>
            <p className="legacy-v1-muted">Handler: {params.handlerName ?? '(n/a)'}</p>
            <p className="legacy-v1-muted">View: {params.viewName ?? '(n/a)'}</p>
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
