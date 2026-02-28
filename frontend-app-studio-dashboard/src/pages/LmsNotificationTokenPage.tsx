import { Link, useLocation, useParams } from 'react-router-dom';

export function LmsNotificationTokenPage() {
  const location = useLocation();
  const params = useParams<{ token?: string }>();
  const action = location.pathname.includes('/unsubscribe/') ? 'Unsubscribe' : 'Resubscribe';

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-notification-token">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Notifications</span><span>{action}</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/notifications">Notifications</Link><Link to="/dashboard">My Courses</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Token Preference Update</h2><p className="legacy-v1-muted">Token: {params.token ?? '(missing)'}</p><p>Compatibility page for <code>/notification_prefs/unsubscribe/:token</code> and <code>/notification_prefs/resubscribe/:token</code>.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
