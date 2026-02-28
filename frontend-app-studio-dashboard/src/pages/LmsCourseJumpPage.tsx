import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

function parseCourse(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  const marker = '/courses/';
  if (!clean.startsWith(marker)) return '';
  const tail = clean.slice(marker.length).split('/');
  const stop = tail.findIndex((seg) => ['about', 'progress', 'courseware', 'dates', 'teams', 'discussion', 'instructor', 'bookmarks', 'tab', 'lti_tab', 'masquerade', 'edxnotes', 'enroll_staff', 'syllabus', 'book', 'pdfbook', 'htmlbook', 'jump_to', 'jump_to_id'].includes(seg));
  const keyParts = stop >= 0 ? tail.slice(0, stop) : tail;
  return decodeURIComponent(keyParts.join('/'));
}

export function LmsCourseJumpPage() {
  const location = useLocation();
  const courseKey = useMemo(() => parseCourse(location.pathname), [location.pathname]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-course-jump">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Course</span><span>Jump To Unit</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/courses">Course Catalog</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Navigation Redirect</h2><p className="legacy-v1-muted">Course Key: {courseKey || '(not detected)'}</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
