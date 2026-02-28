import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

function parseCourse(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  const marker = '/courses/';
  if (!clean.startsWith(marker)) return '';
  const tail = clean.slice(marker.length).split('/');
  const stop = tail.findIndex((seg) => ['set_course_mode_price', 'discussion', 'lti_rest_endpoints', 'generate_user_cert', 'course', 'yt_video_metadata'].includes(seg));
  const keyParts = stop >= 0 ? tail.slice(0, stop) : tail;
  return decodeURIComponent(keyParts.join('/'));
}

function sectionFor(pathname: string): string {
  if (pathname.includes('set_course_mode_price')) return 'Set Course Mode Price';
  if (pathname.includes('discussion/topics')) return 'Discussion Topics';
  if (pathname.includes('lti_rest_endpoints')) return 'LTI REST Endpoints';
  if (pathname.includes('generate_user_cert')) return 'Generate User Cert';
  if (pathname.includes('/course')) return 'Course Root';
  if (pathname.includes('yt_video_metadata')) return 'YouTube Video Metadata';
  return 'Course Admin';
}

export function LmsCourseAdminExtrasPage() {
  const location = useLocation();
  const courseKey = useMemo(() => parseCourse(location.pathname), [location.pathname]);
  const section = useMemo(() => sectionFor(location.pathname), [location.pathname]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-lms-course-admin-extras">
      <section className="legacy-v1-mast"><div><h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">LMS Course Admin</span><span>{section}</span></h1></div></section>
      <section className="legacy-v1-subnav"><Link to="/dashboard">My Courses</Link><Link to="/instructor-tools">Instructor Tools</Link></section>
      <section className="legacy-v1-layout legacy-v1-layout-mastless"><div className="legacy-v1-main"><section className="create-form"><h2>Course Admin Operation</h2><p className="legacy-v1-muted">Course Key: {courseKey || '(not detected)'}</p></section></div><aside className="legacy-v1-sidebar"><h2>Path</h2><p className="legacy-v1-muted">{location.pathname}</p></aside></section>
    </main>
  );
}
