import { Link, useLocation } from 'react-router-dom';

function title(pathname: string): string {
  if (pathname.includes('password_reset_complete')) return 'Password Reset Complete';
  if (pathname.includes('password_reset_confirm')) return 'Confirm New Password';
  if (pathname.includes('password_reset_done')) return 'Password Reset Email Sent';
  return 'Password Reset';
}

export function LmsPasswordResetPage() {
  const location = useLocation();
  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-password-reset">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Auth</span><span>{title(location.pathname)}</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/signin">Sign In</Link><Link to="/help-center">Help Center</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Account Recovery</h2><p>Compatibility page for legacy registration password reset templates.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
