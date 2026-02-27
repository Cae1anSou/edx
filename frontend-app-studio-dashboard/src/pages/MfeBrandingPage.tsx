import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBrandingFooterHtml, fetchBrandingFooterJson, fetchMfeConfig } from '../api/studio';

export function MfeBrandingPage() {
  const [mfeName, setMfeName] = useState('studio');
  const [activeMfe, setActiveMfe] = useState('studio');

  const configQuery = useQuery({
    queryKey: ['mfe-config', activeMfe],
    queryFn: () => fetchMfeConfig(activeMfe)
  });

  const footerJsonQuery = useQuery({
    queryKey: ['branding-footer-json'],
    queryFn: fetchBrandingFooterJson
  });

  const footerHtmlQuery = useQuery({
    queryKey: ['branding-footer-html'],
    queryFn: fetchBrandingFooterHtml
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>MFE and Branding</h1>
        <p>Inspect MFE config and branding footer payloads.</p>
      </header>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          setActiveMfe(mfeName.trim() || 'studio');
        }}
      >
        <label>
          MFE name
          <input value={mfeName} onChange={(event) => setMfeName(event.target.value)} placeholder="studio, learning..." />
        </label>
        <div className="actions">
          <button type="submit">Load Config</button>
          <Link to="/course/" className="button-link secondary-btn">
            Back to Dashboard
          </Link>
        </div>
      </form>

      <section className="create-form">
        <h2>MFE Config</h2>
        {configQuery.isLoading ? <p>Loading MFE config...</p> : null}
        {configQuery.error ? <p className="error-text">Failed to load MFE config.</p> : null}
        {configQuery.data ? <pre>{JSON.stringify(configQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Branding Footer JSON</h2>
        {footerJsonQuery.isLoading ? <p>Loading footer JSON...</p> : null}
        {footerJsonQuery.error ? <p className="error-text">Failed to load footer JSON.</p> : null}
        {footerJsonQuery.data ? <pre>{JSON.stringify(footerJsonQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Branding Footer HTML</h2>
        {footerHtmlQuery.isLoading ? <p>Loading footer HTML...</p> : null}
        {footerHtmlQuery.error ? <p className="error-text">Failed to load footer HTML.</p> : null}
        {footerHtmlQuery.data ? <pre>{footerHtmlQuery.data}</pre> : null}
      </section>
    </main>
  );
}
