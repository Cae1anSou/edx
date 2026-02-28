import { Link, useLocation, useParams } from 'react-router-dom';

export function LmsProgramsAboutPage() {
  const location = useLocation();
  const params = useParams<{ programId?: string }>();

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-programs-about">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Program</span><span>About</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/courses">Course Catalog</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Program Overview</h2><p className="legacy-v1-muted">Program: {params.programId ?? '(missing)'}</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
