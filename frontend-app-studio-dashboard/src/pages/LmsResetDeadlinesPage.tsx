import { Link, useLocation } from 'react-router-dom';

export function LmsResetDeadlinesPage() {
  const location = useLocation();
  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-reset-deadlines">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS</span><span>Reset Deadlines</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/learner-services">Learner Services</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Deadline Reset</h2><p>Compatibility page for legacy reset-deadlines route.</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
