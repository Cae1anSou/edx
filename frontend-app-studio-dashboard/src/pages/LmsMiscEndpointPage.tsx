import { Link, useLocation } from 'react-router-dom';

function label(pathname: string): string {
  if (pathname.startsWith('/heartbeat')) return 'Heartbeat';
  if (pathname.startsWith('/i18n')) return 'i18n';
  if (pathname.startsWith('/openassessment/fileupload')) return 'OpenAssessment File Upload';
  if (pathname.startsWith('/__debug__')) return 'Debug Toolbar';
  if (pathname.startsWith('/_o')) return 'OAuth Root';
  if (pathname.startsWith('/lti_provider')) return 'LTI Provider';
  if (pathname.startsWith('/favicon.ico')) return 'Favicon';
  if (pathname.startsWith('/update_lang')) return 'Update Language';
  return 'Misc Endpoint';
}

export function LmsMiscEndpointPage() {
  const location = useLocation();
  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-misc-endpoint">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Endpoint</span><span>{label(location.pathname)}</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/system-status">System Status</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Compatibility Route</h2><p>This endpoint is represented as a React shell page in the migration app.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
