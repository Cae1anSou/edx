import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchStudioDashboard } from '../api/studio';
import { ItemList } from '../components/ItemList';
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
  const [tab, setTab] = useState<Tab>(() => HASH_TO_TAB[window.location.hash] ?? 'courses');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLibraryForm, setShowLibraryForm] = useState(false);

  const dashboardQuery = useQuery({
    queryKey: ['studio-dashboard'],
    queryFn: fetchStudioDashboard
  });

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
    return <main className="container">Loading dashboard...</main>;
  }

  if (dashboardQuery.error || !dashboardQuery.data) {
    return <main className="container">Could not load dashboard.</main>;
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

  return (
    <main className="container">
      <header className="page-header">
        <h1>Studio Dashboard</h1>
        <p>Manage courses and libraries from one place.</p>
      </header>
      <Notifications notifications={dashboardQuery.data.notifications} />

      <nav className="tabs" aria-label="Course index tabs">
        <button className={tab === 'courses' ? 'active' : ''} onClick={() => setTab('courses')}>
          Courses
        </button>
        <button className={tab === 'archived' ? 'active' : ''} onClick={() => setTab('archived')}>
          Archived Courses
        </button>
        <button className={tab === 'libraries' ? 'active' : ''} onClick={() => setTab('libraries')}>
          Libraries
        </button>
      </nav>

      <section className="actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
        <Link to="/team" className="button-link secondary-btn">
          Team Management
        </Link>
        <Link to="/tasks" className="button-link secondary-btn">
          Tasks
        </Link>
        <Link to="/notifications" className="button-link secondary-btn">
          Notifications
        </Link>
        <Link to="/notification-preferences" className="button-link secondary-btn">
          Notification Prefs
        </Link>
        <Link to="/help-center" className="button-link secondary-btn">
          Help Center
        </Link>
        <Link to="/user-tours" className="button-link secondary-btn">
          User Tours
        </Link>
        <Link to="/mfe-branding" className="button-link secondary-btn">
          MFE Branding
        </Link>
        <Link to="/legacy-compatibility" className="button-link secondary-btn">
          Compatibility APIs
        </Link>
        <Link to="/api-families" className="button-link secondary-btn">
          API Families
        </Link>
        <Link to="/teams-v0" className="button-link secondary-btn">
          Teams v0
        </Link>
        <Link to="/uploads" className="button-link secondary-btn">
          Uploads
        </Link>
        <Link to="/contentstore" className="button-link secondary-btn">
          Contentstore
        </Link>
        <Link to="/learner-services" className="button-link secondary-btn">
          Learner Services
        </Link>
        <Link to="/instructor-tools" className="button-link secondary-btn">
          Instructor Tools
        </Link>
        <Link to="/legacy-system-apis" className="button-link secondary-btn">
          System APIs
        </Link>
        <Link to="/course-operations" className="button-link secondary-btn">
          Course Ops
        </Link>
        <Link to="/learner-experience" className="button-link secondary-btn">
          Learner UX
        </Link>
        <Link to="/platform-integrations" className="button-link secondary-btn">
          Platform APIs
        </Link>
        <Link to="/search-commerce" className="button-link secondary-btn">
          Search Commerce
        </Link>
        <Link to="/authoring-apis" className="button-link secondary-btn">
          Authoring APIs
        </Link>
        <Link to="/identity-access" className="button-link secondary-btn">
          Identity Access
        </Link>
        <Link to="/compliance" className="button-link secondary-btn">
          Compliance
        </Link>
        <Link to="/system-status" className="button-link secondary-btn">
          System Status
        </Link>
        <Link to="/notifications-center" className="button-link secondary-btn">
          Notifications Hub
        </Link>
        <Link to="/resource-builder" className="button-link secondary-btn">
          Resource Builder
        </Link>
        <button
          onClick={() => {
            setShowCourseForm((current) => !current);
            setShowLibraryForm(false);
          }}
          disabled={!permissions.canCreateCourse}
        >
          New Course
        </button>
        <button
          onClick={() => {
            setShowLibraryForm((current) => !current);
            setShowCourseForm(false);
          }}
          disabled={!permissions.canCreateLibrary}
        >
          New Library
        </button>
      </section>

      <CreateCourseForm
        enabled={showCourseForm}
        onCancel={() => {
          setShowCourseForm(false);
        }}
      />
      <CreateLibraryForm
        enabled={showLibraryForm}
        onCancel={() => {
          setShowLibraryForm(false);
        }}
      />

      <section>
        <ItemList courses={courseItems} libraries={libraryItems} allowReruns={permissions.allowReruns} />
      </section>
    </main>
  );
}
