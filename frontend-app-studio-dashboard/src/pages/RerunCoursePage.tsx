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

function validate(input: RerunInput): string | null {
  if (validateRequired(input.display_name)) {
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

function sourceCourseKeyFromLocation(queryValue: string | null, pathValue?: string): string {
  if (queryValue && queryValue.trim().length > 0) {
    return queryValue;
  }
  if (pathValue && pathValue.trim().length > 0) {
    return decodeURIComponent(pathValue);
  }
  return '';
}

export function RerunCoursePage() {
  const [searchParams] = useSearchParams();
  const params = useParams<{ sourceCourseKey?: string }>();
  const defaultSource = useMemo(
    () => sourceCourseKeyFromLocation(searchParams.get('source_course_key'), params.sourceCourseKey),
    [params.sourceCourseKey, searchParams]
  );
  const [form, setForm] = useState<RerunInput>({
    display_name: '',
    org: '',
    number: '',
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
    <main className="container">
      <header className="page-header">
        <h1>Create Course Re-run</h1>
      </header>
      <form
        className="create-form"
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
        <input type="hidden" value={form.source_course_key} />
        <label>
          Display Name
          <input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
        </label>
        <label>
          Organization
          <input list="rerun-organizations" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
        </label>
        <datalist id="rerun-organizations">
          {(organizations.data ?? []).map((org) => (
            <option value={org} key={org} />
          ))}
        </datalist>
        <label>
          Course Number
          <input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
        </label>
        <label>
          Course Run
          <input
            className={document.body.classList.contains('rtl') && !form.run ? 'placeholder-text-direction' : ''}
            value={form.run}
            onChange={(e) => setForm({ ...form, run: e.target.value })}
          />
        </label>
        <div className="actions">
          <button type="submit" disabled={rerunMutation.isPending}>
            {rerunMutation.isPending ? 'Processing Re-run Request' : 'Create Re-run'}
          </button>
          <Link to="/course/" className="button-link secondary-btn">
            Cancel
          </Link>
        </div>
        {validationError ? <p className="error-text">{validationError}</p> : null}
        {rerunMutation.error instanceof Error ? <p className="error-text">{rerunMutation.error.message}</p> : null}
      </form>
    </main>
  );
}
