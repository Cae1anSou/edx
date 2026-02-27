import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { createCourse, createLibrary, CreateCourseInput, CreateLibraryInput, fetchOrganizations } from '../api/studio';
import { validateCombinedKeyLength, validateKeyField, validateRequired } from '../validation';
import { trackEvent } from '../analytics';

type CourseFormProps = {
  enabled: boolean;
  onCancel: () => void;
};

type LibraryFormProps = {
  enabled: boolean;
  onCancel: () => void;
};

function renderError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Request failed';
}

export function CreateCourseForm({ enabled, onCancel }: CourseFormProps) {
  const [form, setForm] = useState<CreateCourseInput>({
    display_name: '',
    org: '',
    number: '',
    run: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const organizations = useQuery({ queryKey: ['organizations'], queryFn: fetchOrganizations });

  const create = useMutation({
    mutationFn: createCourse,
    onSuccess: (result) => {
      window.location.assign(result.url);
    }
  });

  if (!enabled) {
    return null;
  }

  const validate = (): string | null => {
    return (
      validateRequired(form.display_name) ||
      validateKeyField(form.org) ||
      validateKeyField(form.number) ||
      validateKeyField(form.run) ||
      validateCombinedKeyLength([form.org, form.number, form.run])
    );
  };

  const hasValidationError = Boolean(validate());

  return (
    <form
      className="create-form"
      onSubmit={(event) => {
        event.preventDefault();
        const error = validate();
        if (error) {
          setValidationError(error);
          return;
        }
        setValidationError(null);
        trackEvent('Created a Course', form);
        create.mutate(form);
      }}
    >
      <h2>Create Course</h2>
      <label>
        Display Name
        <input value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} />
      </label>
      <label>
        Organization
        <input list="organizations" value={form.org} onChange={(event) => setForm({ ...form, org: event.target.value })} />
      </label>
      <datalist id="organizations">
        {(organizations.data ?? []).map((org) => (
          <option value={org} key={org} />
        ))}
      </datalist>
      <label>
        Course Number
        <input value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} />
      </label>
      <label>
        Course Run
        <input
          className={document.body.classList.contains('rtl') && !form.run ? 'placeholder-text-direction' : ''}
          value={form.run}
          onChange={(event) => setForm({ ...form, run: event.target.value })}
        />
      </label>
      <div className="actions">
        <button type="submit" disabled={create.isPending || hasValidationError}>
        {create.isPending ? 'Creating...' : 'Create Course'}
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            setForm({ display_name: '', org: '', number: '', run: '' });
            setValidationError(null);
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>
      {validationError ? <p className="error-text">{validationError}</p> : null}
      {create.error ? <p className="error-text">{renderError(create.error)}</p> : null}
    </form>
  );
}

export function CreateLibraryForm({ enabled, onCancel }: LibraryFormProps) {
  const [form, setForm] = useState<CreateLibraryInput>({
    display_name: '',
    org: '',
    number: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: createLibrary,
    onSuccess: (result) => {
      window.location.assign(result.url);
    }
  });

  if (!enabled) {
    return null;
  }

  const validate = (): string | null => {
    return (
      validateRequired(form.display_name) ||
      validateKeyField(form.org) ||
      validateKeyField(form.number) ||
      validateCombinedKeyLength([form.org, form.number])
    );
  };

  const hasValidationError = Boolean(validate());

  return (
    <form
      className="create-form"
      onSubmit={(event) => {
        event.preventDefault();
        const error = validate();
        if (error) {
          setValidationError(error);
          return;
        }
        setValidationError(null);
        trackEvent('Created a Library', form);
        create.mutate(form);
      }}
    >
      <h2>Create Library</h2>
      <label>
        Display Name
        <input value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} />
      </label>
      <label>
        Organization
        <input value={form.org} onChange={(event) => setForm({ ...form, org: event.target.value })} />
      </label>
      <label>
        Library Code
        <input value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} />
      </label>
      <div className="actions">
        <button type="submit" disabled={create.isPending || hasValidationError}>
        {create.isPending ? 'Creating...' : 'Create Library'}
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            setForm({ display_name: '', org: '', number: '' });
            setValidationError(null);
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>
      {validationError ? <p className="error-text">{validationError}</p> : null}
      {create.error ? <p className="error-text">{renderError(create.error)}</p> : null}
    </form>
  );
}
