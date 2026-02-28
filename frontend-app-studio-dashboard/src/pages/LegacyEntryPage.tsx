import { Link, useLocation } from 'react-router-dom';

type EntryContent = {
  title: string;
  subtitle: string;
  primaryActionLabel: string;
  primaryActionLink: string;
  secondaryActionLabel?: string;
  secondaryActionLink?: string;
};

function resolveContent(pathname: string): EntryContent {
  if (pathname.startsWith('/signup')) {
    return { title: 'Create Account', subtitle: 'Legacy Studio account creation entry point.', primaryActionLabel: 'Continue to Registration', primaryActionLink: '/dashboard', secondaryActionLabel: 'Back to Studio Home', secondaryActionLink: '/course/' };
  }
  if (pathname.startsWith('/signin_redirect_to_lms')) {
    return { title: 'Redirect to LMS Sign In', subtitle: 'Legacy bridge route that forwards Studio users to LMS authentication.', primaryActionLabel: 'Open LMS Dashboard', primaryActionLink: '/dashboard', secondaryActionLabel: 'Return to Studio', secondaryActionLink: '/course/' };
  }
  if (pathname.startsWith('/request_course_creator')) {
    return { title: 'Request Course Creator Access', subtitle: 'Legacy workflow to request authoring permissions in Studio.', primaryActionLabel: 'Open Studio Home', primaryActionLink: '/course/', secondaryActionLabel: 'View Help Center', secondaryActionLink: '/help-center' };
  }
  if (pathname.startsWith('/howitworks')) {
    return { title: 'How Studio Works', subtitle: 'Legacy orientation page for course teams and publishing workflow.', primaryActionLabel: 'Go to Studio Home', primaryActionLink: '/course/', secondaryActionLabel: 'Open Learner Dashboard', secondaryActionLink: '/dashboard' };
  }
  return { title: 'Sign In', subtitle: 'Legacy Studio authentication entry point.', primaryActionLabel: 'Continue to Sign In', primaryActionLink: '/dashboard', secondaryActionLabel: 'Back to Studio Home', secondaryActionLink: '/course/' };
}

export function LegacyEntryPage() {
  const location = useLocation();
  const content = resolveContent(location.pathname);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-legacy-entry">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Entry</span><span>{content.title}</span></h1>
          <p className="legacy-v1-muted">{content.subtitle}</p>
        </div>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Next Step</h2>
            <p>This route exists in the legacy system and is now represented as a dedicated compatibility page.</p>
            <div className="actions">
              <Link className="button-link" to={content.primaryActionLink}>{content.primaryActionLabel}</Link>
              {content.secondaryActionLabel && content.secondaryActionLink ? <Link className="button-link secondary-btn" to={content.secondaryActionLink}>{content.secondaryActionLabel}</Link> : null}
            </div>
          </section>

          <section className="create-form">
            <h2>Legacy Route</h2>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Related</h3>
            <p><Link to="/course/">Studio Home</Link></p>
            <p><Link to="/dashboard">LMS Dashboard</Link></p>
            <p><Link to="/help-center">Help Center</Link></p>
          </div>
        </aside>
      </section>
    </main>
  );
}
