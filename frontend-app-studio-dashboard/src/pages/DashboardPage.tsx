import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { fetchStudioDashboard } from '../api/studio';
import { CreateCourseForm, CreateLibraryForm } from '../components/CreateForms';
import { Notifications } from '../components/Notifications';
import { StudioCourseItem, StudioLibraryItem } from '../types';

type Tab = 'courses' | 'archived' | 'libraries';
const HASH_TO_TAB: Record<string, Tab> = {
  '#courses-tab': 'courses',
  '#archived-courses-tab': 'archived',
  '#libraries-tab': 'libraries'
};

const TAB_TO_HASH: Record<Tab, string> = {
  courses: '#courses-tab',
  archived: '#archived-courses-tab',
  libraries: '#libraries-tab'
};

export function DashboardPage() {
  const location = useLocation();
  const [tab, setTab] = useState<Tab>(() => HASH_TO_TAB[window.location.hash] ?? 'courses');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLibraryForm, setShowLibraryForm] = useState(false);

  const dashboardQuery = useQuery({
    queryKey: ['studio-dashboard'],
    queryFn: fetchStudioDashboard
  });

  const legacyCourseKey = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    if (!pathname.startsWith('/course/')) {
      return '';
    }
    const rest = pathname.slice('/course/'.length).split('/').filter(Boolean);
    if (rest.length === 0) {
      return '';
    }
    if (rest[0].includes(':')) {
      return decodeURIComponent(rest[0]);
    }
    if (rest.length >= 3) {
      return decodeURIComponent(rest.slice(0, 3).join('/'));
    }
    return decodeURIComponent(rest[0]);
  }, [location.pathname]);

  useEffect(() => {
    const hash = TAB_TO_HASH[tab];
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }, [tab]);

  useEffect(() => {
    const onHashChange = () => {
      const nextTab = HASH_TO_TAB[window.location.hash];
      if (nextTab) {
        setTab(nextTab);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (dashboardQuery.isLoading) {
    return <main className="container legacy-v1-shell legacy-v1-generic">Loading dashboard...</main>;
  }

  if (dashboardQuery.error || !dashboardQuery.data) {
    return <main className="container legacy-v1-shell legacy-v1-generic">Could not load dashboard.</main>;
  }

  const permissions = dashboardQuery.data.permissions;
  let courseItems: StudioCourseItem[] | undefined;
  let libraryItems: StudioLibraryItem[] | undefined;

  if (tab === 'courses') {
    courseItems = dashboardQuery.data.courses;
  } else if (tab === 'archived') {
    courseItems = dashboardQuery.data.archivedCourses;
  } else {
    libraryItems = dashboardQuery.data.libraries;
  }

  const currentItemsCount = tab === 'libraries' ? (libraryItems?.length ?? 0) : (courseItems?.length ?? 0);

  return (
    <main className="container legacy-v1-shell legacy-v1-studio legacy-v1-studio-home">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Studio</span>
            <span>Home</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/dashboard" className="legacy-v1-link-btn">Learner Dashboard</Link>
          <button
            type="button"
            className="legacy-v1-btn legacy-v1-btn-primary"
            disabled={!permissions.canCreateCourse}
            onClick={() => {
              setShowCourseForm((current) => !current);
              setShowLibraryForm(false);
            }}
          >
            New Course
          </button>
          <button
            type="button"
            className="legacy-v1-btn legacy-v1-btn-primary"
            disabled={!permissions.canCreateLibrary}
            onClick={() => {
              setShowLibraryForm((current) => !current);
              setShowCourseForm(false);
            }}
          >
            New Library
          </button>
        </nav>
      </section>

      {legacyCourseKey ? (
        <section className="legacy-v1-alert">
          Opening legacy course context: <code>{legacyCourseKey}</code>
        </section>
      ) : null}

      <Notifications notifications={dashboardQuery.data.notifications} />

      <section className="legacy-v1-tabs" aria-label="Course index tabs">
        <button className={tab === 'courses' ? 'active' : ''} onClick={() => setTab('courses')}>Courses</button>
        <button className={tab === 'archived' ? 'active' : ''} onClick={() => setTab('archived')}>Archived Courses</button>
        <button className={tab === 'libraries' ? 'active' : ''} onClick={() => setTab('libraries')}>Libraries</button>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <CreateCourseForm enabled={showCourseForm} onCancel={() => setShowCourseForm(false)} />
          <CreateLibraryForm enabled={showLibraryForm} onCancel={() => setShowLibraryForm(false)} />

          <section className="legacy-v1-grid">
            {(courseItems ?? []).map((course) => (
              <article className="legacy-v1-course-card" key={course.id}>
                <div>
                  <h3><a href={course.url}>{course.displayName}</a></h3>
                  <p className="legacy-v1-meta">{course.org} · {course.number} · {course.run}</p>
                </div>
                <div className="legacy-v1-card-actions">
                  <a href={course.url}>Open</a>
                  {course.lmsLink ? <a href={course.lmsLink}>View in LMS</a> : null}
                  {permissions.allowReruns && course.rerunLink ? <a href={course.rerunLink}>Rerun</a> : null}
                </div>
              </article>
            ))}

            {(libraryItems ?? []).map((library) => (
              <article className="legacy-v1-course-card" key={library.id}>
                <div>
                  <h3><a href={library.url}>{library.displayName}</a></h3>
                  <p className="legacy-v1-meta">{library.org} · {library.number}</p>
                </div>
                <div className="legacy-v1-card-actions">
                  <a href={library.url}>Open Library</a>
                </div>
              </article>
            ))}

            {currentItemsCount === 0 ? (
              <article className="legacy-v1-empty">No data returned for this tab.</article>
            ) : null}
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Summary</h3>
            <p><strong>Current tab:</strong> {tab}</p>
            <p><strong>Items:</strong> {currentItemsCount}</p>
            <p><strong>Can create course:</strong> {permissions.canCreateCourse ? 'yes' : 'no'}</p>
            <p><strong>Can create library:</strong> {permissions.canCreateLibrary ? 'yes' : 'no'}</p>
          </div>
          <div className="legacy-v1-side-bit">
            <h3>Quick Links</h3>
            <p><Link to="/team">Team</Link></p>
            <p><Link to="/tasks">Tasks</Link></p>
            <p><Link to="/notifications">Notifications</Link></p>
            <p><Link to="/contentstore">Contentstore</Link></p>
            <p><Link to="/resource-builder">Resource Builder</Link></p>
          </div>
          <div className="legacy-v1-side-bit">
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
