import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { createCourse, createLibrary, fetchOrganizations, rerunCourse } from '../api/studio';
import { validateCombinedKeyLength, validateKeyField, validateRequired } from '../validation';

type CoursePayload = { display_name: string; org: string; number: string; run: string };
type RerunPayload = CoursePayload & { source_course_key: string };
type LibraryPayload = { display_name: string; org: string; number: string };

function validateCourse(input: CoursePayload): string | null {
  return validateRequired(input.display_name) || validateKeyField(input.org) || validateKeyField(input.number) || validateKeyField(input.run) || validateCombinedKeyLength([input.org, input.number, input.run]);
}

function validateLibrary(input: LibraryPayload): string | null {
  return validateRequired(input.display_name) || validateKeyField(input.org) || validateKeyField(input.number) || validateCombinedKeyLength([input.org, input.number]);
}

export function ResourceBuilderPage() {
  const location = useLocation();
  const params = useParams<{ courseKey?: string; providedId?: string }>();
  const seededCourseKey = params.courseKey ? decodeURIComponent(params.courseKey) : '';

  const routeSeed = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    const parseCourseLike = (segments: string[]) => {
      if (segments.length === 0) return '';
      if (segments[0].includes(':')) return decodeURIComponent(segments[0]);
      if (segments.length >= 3) return decodeURIComponent(segments.slice(0, 3).join('/'));
      return decodeURIComponent(segments[0]);
    };
    if (pathname.startsWith('/course_info/')) {
      const rest = pathname.slice('/course_info/'.length).split('/').filter(Boolean);
      return { courseKey: parseCourseLike(rest), providedId: '' };
    }
    if (pathname.startsWith('/course_info_update/')) {
      const rest = pathname.slice('/course_info_update/'.length).split('/').filter(Boolean);
      const courseKey = parseCourseLike(rest);
      const providedIndex = rest[0]?.includes(':') ? 1 : 3;
      const providedId = rest.length > providedIndex ? decodeURIComponent(rest[providedIndex]) : '';
      return { courseKey, providedId };
    }
    if (pathname.startsWith('/settings/details/')) {
      const rest = pathname.slice('/settings/details/'.length).split('/').filter(Boolean);
      return { courseKey: parseCourseLike(rest), providedId: '' };
    }
    return { courseKey: seededCourseKey, providedId: params.providedId ? decodeURIComponent(params.providedId) : '' };
  }, [location.pathname, params.providedId, seededCourseKey]);

  const effectiveCourseKey = routeSeed.courseKey || seededCourseKey;
  const seededProvidedId = routeSeed.providedId;

  const organizationsQuery = useQuery({ queryKey: ['resource-builder-organizations'], queryFn: fetchOrganizations });
  const [courseForm, setCourseForm] = useState<CoursePayload>({ display_name: '', org: '', number: '', run: '' });
  const [libraryForm, setLibraryForm] = useState<LibraryPayload>({ display_name: '', org: '', number: '' });
  const [rerunForm, setRerunForm] = useState<RerunPayload>({ display_name: '', org: '', number: '', run: '', source_course_key: effectiveCourseKey });

  useEffect(() => {
    if (effectiveCourseKey) setRerunForm((prev) => ({ ...prev, source_course_key: effectiveCourseKey }));
  }, [effectiveCourseKey]);

  const createCourseMutation = useMutation({ mutationFn: createCourse });
  const createLibraryMutation = useMutation({ mutationFn: createLibrary });
  const rerunMutation = useMutation({ mutationFn: rerunCourse });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-resource-builder">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Authoring</span><span>Resource Builder</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/rerun" className="legacy-v1-link-btn">Rerun</Link>
          <Link to="/team" className="legacy-v1-link-btn">Team</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <form className="create-form" onSubmit={(event) => { event.preventDefault(); if (!validateCourse(courseForm)) createCourseMutation.mutate(courseForm); }}>
            <h2>Create Course</h2>
            <label>Display name<input value={courseForm.display_name} onChange={(event) => setCourseForm({ ...courseForm, display_name: event.target.value })} /></label>
            <label>Organization<input list="resource-builder-orgs" value={courseForm.org} onChange={(event) => setCourseForm({ ...courseForm, org: event.target.value })} /></label>
            <label>Number<input value={courseForm.number} onChange={(event) => setCourseForm({ ...courseForm, number: event.target.value })} /></label>
            <label>Run<input value={courseForm.run} onChange={(event) => setCourseForm({ ...courseForm, run: event.target.value })} /></label>
            <div className="actions"><button type="submit" disabled={createCourseMutation.isPending}>{createCourseMutation.isPending ? 'Creating...' : 'Create Course'}</button></div>
            {validateCourse(courseForm) ? <p className="error-text">{validateCourse(courseForm)}</p> : null}
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); if (!validateLibrary(libraryForm)) createLibraryMutation.mutate(libraryForm); }}>
            <h2>Create Library</h2>
            <label>Display name<input value={libraryForm.display_name} onChange={(event) => setLibraryForm({ ...libraryForm, display_name: event.target.value })} /></label>
            <label>Organization<input list="resource-builder-orgs" value={libraryForm.org} onChange={(event) => setLibraryForm({ ...libraryForm, org: event.target.value })} /></label>
            <label>Code<input value={libraryForm.number} onChange={(event) => setLibraryForm({ ...libraryForm, number: event.target.value })} /></label>
            <div className="actions"><button type="submit" disabled={createLibraryMutation.isPending}>{createLibraryMutation.isPending ? 'Creating...' : 'Create Library'}</button></div>
            {validateLibrary(libraryForm) ? <p className="error-text">{validateLibrary(libraryForm)}</p> : null}
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); if (!validateCourse(rerunForm) && !validateRequired(rerunForm.source_course_key)) rerunMutation.mutate(rerunForm); }}>
            <h2>Rerun Course</h2>
            <label>Source course key<input value={rerunForm.source_course_key} onChange={(event) => setRerunForm({ ...rerunForm, source_course_key: event.target.value })} /></label>
            <label>Display name<input value={rerunForm.display_name} onChange={(event) => setRerunForm({ ...rerunForm, display_name: event.target.value })} /></label>
            <label>Organization<input list="resource-builder-orgs" value={rerunForm.org} onChange={(event) => setRerunForm({ ...rerunForm, org: event.target.value })} /></label>
            <label>Number<input value={rerunForm.number} onChange={(event) => setRerunForm({ ...rerunForm, number: event.target.value })} /></label>
            <label>Run<input value={rerunForm.run} onChange={(event) => setRerunForm({ ...rerunForm, run: event.target.value })} /></label>
            <div className="actions"><button type="submit" disabled={rerunMutation.isPending}>{rerunMutation.isPending ? 'Submitting...' : 'Create Rerun'}</button></div>
            {validateCourse(rerunForm) ? <p className="error-text">{validateCourse(rerunForm)}</p> : null}
            {validateRequired(rerunForm.source_course_key) ? <p className="error-text">source_course_key is required.</p> : null}
          </form>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Results</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {effectiveCourseKey ? <p className="legacy-v1-muted">Legacy course: {effectiveCourseKey}</p> : null}
            {seededProvidedId ? <p className="legacy-v1-muted">Provided id: {seededProvidedId}</p> : null}
            {createCourseMutation.data ? <pre>{JSON.stringify(createCourseMutation.data, null, 2)}</pre> : null}
            {!createCourseMutation.data && createLibraryMutation.data ? <pre>{JSON.stringify(createLibraryMutation.data, null, 2)}</pre> : null}
            {!createCourseMutation.data && !createLibraryMutation.data && rerunMutation.data ? <pre>{JSON.stringify(rerunMutation.data, null, 2)}</pre> : null}
            <p>Organizations loaded: {organizationsQuery.data?.length ?? 0}</p>
          </div>
        </aside>
      </section>

      <datalist id="resource-builder-orgs">{(organizationsQuery.data ?? []).map((org) => <option key={org} value={org} />)}</datalist>
    </main>
  );
}
