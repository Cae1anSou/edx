import { Link, useLocation } from 'react-router-dom';

function titleFor(pathname: string): string {
  if (pathname.includes('run_python')) return 'Run Python Debug';
  if (pathname.includes('show_parameters')) return 'Show Parameters';
  return 'Debug Tools';
}

export function LmsDebugPage() {
  const location = useLocation();
  const title = titleFor(location.pathname);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-debug">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS</span><span>{title}</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/system-status">System Status</Link><Link to="/course/">Studio Home</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Debug Endpoint</h2><p>Compatibility page for debug utilities in legacy LMS.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
