import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchBulkDiscussionToggle, fetchMobileApi, fetchYoutubeVideoIds, postBulkEnroll } from '../api/studio';

export function CourseOperationsPage() {
  const location = useLocation();
  const [courseId, setCourseId] = useState('course-v1:org+num+run');
  const [apiVersion, setApiVersion] = useState('v0');
  const [bulkPayload, setBulkPayload] = useState('{"course_id":"course-v1:org+num+run","emails":"a@example.com"}');

  const legacyRouteCourseId = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    const parseCourseLikeFromPath = (restPath: string) => {
      const segments = restPath.split('/').filter(Boolean);
      if (segments.length === 0) {
        return '';
      }
      if (segments[0].includes(':')) {
        return decodeURIComponent(segments[0]);
      }
      if (segments.length >= 3) {
        return decodeURIComponent(segments.slice(0, 3).join('/'));
      }
      return decodeURIComponent(segments[0]);
    };
    const prefixes = ['/import/', '/import_status/', '/export/', '/export_output/', '/export_status/', '/checklists/'];
    for (const prefix of prefixes) {
      if (pathname.startsWith(prefix)) {
        const raw = parseCourseLikeFromPath(pathname.slice(prefix.length));
        if (raw) {
          return raw;
        }
      }
    }
    if (pathname.startsWith('/course/') && pathname.endsWith('/search_reindex')) {
      const candidate = pathname.slice('/course/'.length, pathname.length - '/search_reindex'.length).replace(/\/+$/, '');
      if (candidate) {
        return decodeURIComponent(candidate);
      }
    }
    return '';
  }, [location.pathname]);

  useEffect(() => {
    if (!legacyRouteCourseId) {
      return;
    }
    setCourseId(legacyRouteCourseId);
    setBulkPayload(JSON.stringify({ course_id: legacyRouteCourseId, emails: 'a@example.com' }));
  }, [legacyRouteCourseId]);

  const bulkEnrollMutation = useMutation({ mutationFn: postBulkEnroll });
  const discussionMutation = useMutation({ mutationFn: fetchBulkDiscussionToggle });
  const mobileMutation = useMutation({ mutationFn: fetchMobileApi });
  const youtubeMutation = useMutation({ mutationFn: fetchYoutubeVideoIds });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Course Operations</h1>
        <p>React migration of bulk enrollment, discussions toggle, mobile, and youtube endpoints.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {legacyRouteCourseId ? (
          <p>
            <strong>Legacy course key:</strong> {legacyRouteCourseId}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            const parsed = JSON.parse(bulkPayload) as Record<string, unknown>;
            bulkEnrollMutation.mutate(parsed);
          } catch {
            bulkEnrollMutation.reset();
          }
        }}
      >
        <h2>Bulk Enroll</h2>
        <label>
          payload (JSON)
          <input value={bulkPayload} onChange={(event) => setBulkPayload(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={bulkEnrollMutation.isPending}>
            {bulkEnrollMutation.isPending ? 'Submitting...' : 'Submit Bulk Enroll'}
          </button>
        </div>
        {bulkEnrollMutation.error ? <p className="error-text">Request failed or JSON is invalid.</p> : null}
        {bulkEnrollMutation.data ? <pre>{JSON.stringify(bulkEnrollMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          discussionMutation.mutate(courseId);
        }}
      >
        <h2>Bulk Discussion Toggle</h2>
        <label>
          course id
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={discussionMutation.isPending}>
            {discussionMutation.isPending ? 'Loading...' : 'Load Toggle State'}
          </button>
        </div>
        {discussionMutation.error ? <p className="error-text">Request failed.</p> : null}
        {discussionMutation.data ? <pre>{JSON.stringify(discussionMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          mobileMutation.mutate(apiVersion);
        }}
      >
        <h2>Mobile API</h2>
        <label>
          api version
          <input value={apiVersion} onChange={(event) => setApiVersion(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={mobileMutation.isPending}>
            {mobileMutation.isPending ? 'Loading...' : 'Load Mobile Response'}
          </button>
        </div>
        {mobileMutation.error ? <p className="error-text">Request failed.</p> : null}
        {mobileMutation.data ? <pre>{JSON.stringify(mobileMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          youtubeMutation.mutate(courseId);
        }}
      >
        <h2>YouTube Video IDs</h2>
        <label>
          course id
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={youtubeMutation.isPending}>
            {youtubeMutation.isPending ? 'Loading...' : 'Load Video IDs'}
          </button>
        </div>
        {youtubeMutation.error ? <p className="error-text">Request failed.</p> : null}
        {youtubeMutation.data ? <pre>{JSON.stringify(youtubeMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
