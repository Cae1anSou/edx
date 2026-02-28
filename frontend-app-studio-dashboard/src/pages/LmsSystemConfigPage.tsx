import { Link, useLocation } from 'react-router-dom';

function titleFor(pathname: string): string {
  if (pathname.includes('config/programs')) return 'Programs Config';
  if (pathname.includes('config/catalog')) return 'Catalog Config';
  if (pathname.includes('instructor_task_status')) return 'Instructor Task Status';
  if (pathname.includes('xdomain_proxy')) return 'XDomain Proxy';
  if (pathname.includes('coverage_context')) return 'Coverage Context';
  return 'System Config';
}

export function LmsSystemConfigPage() {
  const location = useLocation();
  const title = titleFor(location.pathname);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-system-config">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">LMS System</span>
            <span>{title}</span>
          </h1>
          <p>Legacy LMS system/config endpoint page shell.</p>
        </div>
      </section>
      <section className="legacy-v1-subnav">
        <Link to="/system-status">System Status</Link>
        <Link to="/dashboard">My Courses</Link>
      </section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <div className="legacy-v1-main">
          <section className="create-form">
            <h2>Endpoint View</h2>
            <p>Compatibility page for legacy config/status routes.</p>
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
