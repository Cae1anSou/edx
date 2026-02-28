import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBrandingFooterHtml, fetchBrandingFooterJson, fetchMfeConfig } from '../api/studio';

export function MfeBrandingPage() {
  const [mfeName, setMfeName] = useState('studio');
  const [activeMfe, setActiveMfe] = useState('studio');

  const configQuery = useQuery({ queryKey: ['mfe-config', activeMfe], queryFn: () => fetchMfeConfig(activeMfe) });
  const footerJsonQuery = useQuery({ queryKey: ['branding-footer-json'], queryFn: fetchBrandingFooterJson });
  const footerHtmlQuery = useQuery({ queryKey: ['branding-footer-html'], queryFn: fetchBrandingFooterHtml });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-mfe-branding">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Branding</span><span>MFE and Branding</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/identity-access" className="legacy-v1-link-btn">Identity & Access</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <form className="create-form" onSubmit={(event) => { event.preventDefault(); setActiveMfe(mfeName.trim() || 'studio'); }}>
            <h2>MFE Config Query</h2>
            <label>MFE name<input value={mfeName} onChange={(event) => setMfeName(event.target.value)} placeholder="studio, learning..." /></label>
            <div className="actions"><button type="submit">Load Config</button></div>
          </form>

          <section className="create-form">
            <h2>MFE Config</h2>
            {configQuery.isLoading ? <p>Loading MFE config...</p> : null}
            {configQuery.error ? <p className="error-text">Failed to load MFE config.</p> : null}
          </section>

          <section className="create-form">
            <h2>Branding Footer JSON</h2>
            {footerJsonQuery.isLoading ? <p>Loading footer JSON...</p> : null}
            {footerJsonQuery.error ? <p className="error-text">Failed to load footer JSON.</p> : null}
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Response</h3>
            {configQuery.data ? <pre>{JSON.stringify(configQuery.data, null, 2)}</pre> : null}
            {!configQuery.data && footerJsonQuery.data ? <pre>{JSON.stringify(footerJsonQuery.data, null, 2)}</pre> : null}
            {!configQuery.data && !footerJsonQuery.data && footerHtmlQuery.data ? <pre>{footerHtmlQuery.data}</pre> : null}
            {footerHtmlQuery.error ? <p className="error-text">Failed to load footer HTML.</p> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
