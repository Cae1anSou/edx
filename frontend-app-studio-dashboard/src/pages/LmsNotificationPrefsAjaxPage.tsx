import { Link, useLocation } from 'react-router-dom';

function actionFromPath(pathname: string): string {
  if (pathname.includes('/enable')) return 'Enable';
  if (pathname.includes('/disable')) return 'Disable';
  if (pathname.includes('/status')) return 'Status';
  return 'Preference';
}

export function LmsNotificationPrefsAjaxPage() {
  const location = useLocation();
  const action = actionFromPath(location.pathname);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-notification-prefs-ajax">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Notifications</span><span>Preferences</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/notification-preferences">Notification Preferences</Link><Link to="/notifications">Notifications</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>{action}</h2><p>Compatibility page for <code>/notification_prefs/{action.toLowerCase()}/</code>.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
