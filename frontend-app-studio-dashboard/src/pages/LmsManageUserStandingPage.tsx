import { Link, useLocation } from 'react-router-dom';

export function LmsManageUserStandingPage() {
  const location = useLocation();
  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-manage-user-standing">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS</span><span>Manage User Standing</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/instructor-tools">Instructor Tools</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>User Standing</h2><p>Compatibility page for legacy user standing management route.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
