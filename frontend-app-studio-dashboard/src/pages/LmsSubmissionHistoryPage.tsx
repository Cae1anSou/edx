import { Link, useLocation, useParams } from 'react-router-dom';

export function LmsSubmissionHistoryPage() {
  const location = useLocation();
  const params = useParams<{ learnerIdentifier?: string; locationPath?: string }>();

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-submission-history">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Course</span><span>Submission History</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/courses">Course Catalog</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Learner Attempts</h2><p className="legacy-v1-muted">Learner: {params.learnerIdentifier ?? '(missing)'}</p><p className="legacy-v1-muted">Location: {params.locationPath ?? '(missing)'}</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
