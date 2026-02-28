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

function parseBookType(pathname: string): string {
  if (pathname.includes('/pdfbook/')) return 'pdfbook';
  if (pathname.includes('/htmlbook/')) return 'htmlbook';
  if (pathname.includes('/book/')) return 'book';
  return 'book';
}

export function LmsCourseBookPage() {
  const location = useLocation();
  const courseKey = useMemo(() => parseCourse(location.pathname), [location.pathname]);
  const bookType = useMemo(() => parseBookType(location.pathname), [location.pathname]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-course-book">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">LMS Course</span>
            <span>Book</span>
          </h1>
          <p>Legacy LMS {bookType} page shell.</p>
        </div>
      </section>
      <section className="legacy-v1-subnav">
        <Link to="/dashboard">My Courses</Link>
        <Link to="/courses">Course Catalog</Link>
      </section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <div className="legacy-v1-main">
          <section className="create-form">
            <h2>Book Reader</h2>
            <p className="legacy-v1-muted">Course Key: {courseKey || '(not detected)'}</p>
            <p className="legacy-v1-muted">Type: {bookType}</p>
          </section>
        </div>
        <aside className="legacy-v1-sidebar">
          <h2>Path</h2>
          <p className="legacy-v1-muted">{location.pathname}</p>
        </aside>
      </section>
    </main>
  );
}
