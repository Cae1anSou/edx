import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchOrganizations, rerunCourse } from '../api/studio';
import { validateCombinedKeyLength, validateKeyField, validateRequired } from '../validation';
import { trackEvent } from '../analytics';

type RerunInput = {
  display_name: string;
  org: string;
  number: string;
  run: string;
  source_course_key: string;
};

function sourceCourseKeyFromLocation(queryValue: string | null, pathValue?: string): string {
  if (queryValue && queryValue.trim().length > 0) {
    return queryValue;
  }
  if (pathValue && pathValue.trim().length > 0) {
    return decodeURIComponent(pathValue);
  }
  return '';
}

function parseSourceKey(source: string): { org: string; number: string; run: string } {
  const decoded = decodeURIComponent(source || '');
  const courseV1Match = decoded.match(/^course-v1:([^+]+)\+([^+]+)\+(.+)$/);
  if (courseV1Match) {
    return {
      org: courseV1Match[1],
      number: courseV1Match[2],
      run: courseV1Match[3]
    };
  }

  const slashParts = decoded.split('/').filter(Boolean);
  if (slashParts.length >= 3) {
    return {
      org: slashParts[0],
      number: slashParts[1],
      run: slashParts[2]
    };
  }

  return { org: '', number: '', run: '' };
}

function validate(input: RerunInput): string | null {
  if (validateRequired(input.display_name)) {
    return 'Required field.';
  }
  if (validateRequired(input.org) || validateRequired(input.number) || validateRequired(input.run)) {
    return 'Required field.';
  }
  if (validateKeyField(input.org) || validateKeyField(input.number) || validateKeyField(input.run)) {
    return 'Please do not use any spaces or special characters in this field.';
  }
  const combinedKeyError = validateCombinedKeyLength([input.org, input.number, input.run]);
  if (combinedKeyError) {
    return combinedKeyError;
  }
  if (validateRequired(input.source_course_key)) {
    return 'source_course_key is required.';
  }
  return null;
}

export function RerunCoursePage() {
  const [searchParams] = useSearchParams();
  const params = useParams<{ sourceCourseKey?: string }>();
  const defaultSource = useMemo(
    () => sourceCourseKeyFromLocation(searchParams.get('source_course_key'), params.sourceCourseKey),
    [params.sourceCourseKey, searchParams]
  );

  const sourceParts = useMemo(() => parseSourceKey(defaultSource), [defaultSource]);

  const [form, setForm] = useState<RerunInput>({
    display_name: '',
    org: sourceParts.org,
    number: sourceParts.number,
    run: '',
    source_course_key: defaultSource
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const organizations = useQuery({ queryKey: ['organizations'], queryFn: fetchOrganizations });
  const rerunMutation = useMutation({
    mutationFn: rerunCourse,
    onSuccess: (result) => {
      window.location.assign(result.url);
    }
  });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-rerun">
      <section className="legacy-v1-mast mast mast-wizard has-actions">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Create a re-run of a course</span>
          </h1>
          <h2 className="legacy-v1-super-title">
            <span className="legacy-v1-super-copy">You are creating a re-run from:</span>
            <span>{[sourceParts.org, sourceParts.number, sourceParts.run].filter(Boolean).join(' ') || '(unknown source)'}</span>
          </h2>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Cancel</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <div className="legacy-v1-intro-copy">
            <p>
              Provide identifying information for this re-run of the course. The original course is not affected in any way by a re-run.
              <strong> Note: Together, the organization, course number, and course run must uniquely identify this new course instance.</strong>
            </p>
          </div>

          <form
            id="rerun-course-form"
            name="rerun-course-form"
            className="create-form legacy-v1-form-list form-create rerun-course course-info"
            onSubmit={(event) => {
              event.preventDefault();
              const error = validate(form);
              if (error) {
                setValidationError(error);
                return;
              }
              setValidationError(null);
              trackEvent('Reran a Course', form);
              rerunMutation.mutate(form);
            }}
          >
            {validationError ? (
              <div className="legacy-v1-error-wrap" role="alert">
                <p className="error-text">{validationError}</p>
              </div>
            ) : null}

            {rerunMutation.error instanceof Error ? (
              <div className="legacy-v1-error-wrap" role="alert">
                <p className="error-text">{rerunMutation.error.message}</p>
              </div>
            ) : null}

            <input type="hidden" value={form.source_course_key} readOnly />

            <label>
              Course Name
              <input
                id="rerun-course-name"
                className="rerun-course-name"
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                placeholder="e.g. Introduction to Computer Science"
              />
              <span className="legacy-v1-tip">The public display name for the new course. This is often the same as the original course name.</span>
            </label>

            <label>
              Organization
              <input
                id="rerun-course-org"
                className="rerun-course-org"
                list="rerun-organizations"
                value={form.org}
                onChange={(e) => setForm({ ...form, org: e.target.value })}
                placeholder="e.g. UniversityX"
              />
              <span className="legacy-v1-tip">The organization sponsoring the new course. This is often the same as the original organization. No spaces or special characters are allowed.</span>
            </label>
            <datalist id="rerun-organizations">
              {(organizations.data ?? []).map((org) => (
                <option value={org} key={org} />
              ))}
            </datalist>

            <div className="legacy-v1-two-col-row">
              <label>
                Course Number
                <input value={form.number} readOnly />
                <span className="legacy-v1-tip">This value is copied from the source course and cannot be changed.</span>
              </label>

              <label>
                Course Run
                <input
                  id="rerun-course-run"
                  className={`rerun-course-run ${document.body.classList.contains('rtl') && !form.run ? 'placeholder-text-direction' : ''}`.trim()}
                  value={form.run}
                  onChange={(e) => setForm({ ...form, run: e.target.value })}
                  placeholder="e.g. 2026_T1"
                />
                <span className="legacy-v1-tip">The term in which the new course will run. This is often different from the original run value. No spaces or special characters are allowed.</span>
              </label>
            </div>

            <div className="actions">
              <button type="submit" disabled={rerunMutation.isPending}>
                {rerunMutation.isPending ? 'Processing Re-run Request...' : 'Create Re-run'}
              </button>
              <Link to="/course/" className="secondary-btn button-link">Cancel</Link>
            </div>
          </form>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>When will my course re-run start?</h3>
            <p>The new course is set to start on January 1, 2030 at midnight (UTC).</p>
          </div>
          <div className="legacy-v1-side-bit">
            <h3>What transfers from the original course?</h3>
            <p>The new course has the same course outline and content as the original course.</p>
            <p>Problems, videos, announcements, and other files are duplicated to the new course.</p>
          </div>
          <div className="legacy-v1-side-bit">
            <h3>What does not transfer from the original course?</h3>
            <p>You are the only member of the new course staff. No students are enrolled, and there is no student data.</p>
            <p>There is no content in the discussion topics or wiki.</p>
          </div>
          <div className="legacy-v1-side-bit">
            <a href="https://docs.openedx.org/" target="_blank" rel="noopener" className="legacy-v1-link-btn">Learn more about Course Re-runs</a>
          </div>
        </aside>
      </section>
    </main>
  );
}
