import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUpload, fetchUpload } from '../api/studio';

export function UploadsPage() {
  const [filename, setFilename] = useState('syllabus.pdf');
  const [token, setToken] = useState('');

  const createMutation = useMutation({
    mutationFn: createUpload,
    onSuccess: (result) => {
      const nextToken = result.upload.token;
      if (typeof nextToken === 'string') {
        setToken(nextToken);
      }
    }
  });

  const statusMutation = useMutation({
    mutationFn: fetchUpload
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Uploads</h1>
        <p>React migration of upload creation and upload status flows.</p>
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
          createMutation.mutate(filename || undefined);
        }}
      >
        <h2>Create Upload</h2>
        <label>
          filename
          <input value={filename} onChange={(event) => setFilename(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Upload'}
          </button>
        </div>
        {createMutation.error ? <p className="error-text">Failed to create upload.</p> : null}
        {createMutation.data ? <pre>{JSON.stringify(createMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (token.trim()) {
            statusMutation.mutate(token.trim());
          }
        }}
      >
        <h2>Upload Status</h2>
        <label>
          token
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="up-token-1" />
        </label>
        <div className="actions">
          <button type="submit" disabled={statusMutation.isPending}>
            {statusMutation.isPending ? 'Loading...' : 'Load Status'}
          </button>
        </div>
        {statusMutation.error ? <p className="error-text">Failed to load upload status.</p> : null}
        {statusMutation.data ? <pre>{JSON.stringify(statusMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
