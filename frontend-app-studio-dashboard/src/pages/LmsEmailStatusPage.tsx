import { Link, useLocation } from 'react-router-dom';

function titleFor(pathname: string): string {
  if (pathname.includes('secondary_email_change_successful')) return 'Secondary Email Changed';
  if (pathname.includes('secondary_email_change_failed')) return 'Secondary Email Change Failed';
  if (pathname.includes('email_change_successful')) return 'Email Changed';
  if (pathname.includes('email_change_failed')) return 'Email Change Failed';
  if (pathname.includes('invalid_email_key')) return 'Invalid Email Key';
  if (pathname.includes('email_exists')) return 'Email Already Exists';
  if (pathname.includes('extauth_failure')) return 'External Auth Failure';
  return 'Email Status';
}

export function LmsEmailStatusPage() {
  const location = useLocation();
  const title = titleFor(location.pathname);
  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-email-status">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS</span><span>{title}</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/signin">Sign In</Link><Link to="/dashboard">My Courses</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Status Message</h2><p>Compatibility page for legacy email/account flow templates.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
