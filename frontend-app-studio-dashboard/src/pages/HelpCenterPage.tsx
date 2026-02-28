import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { searchHelpCenter } from '../api/studio';

export function HelpCenterPage() {
  const location = useLocation();
  const [query, setQuery] = useState('');

  const routeSeedQuery = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    if (pathname.startsWith('/support/')) {
      const raw = pathname.slice('/support/'.length).split('/')[0];
      return raw ? decodeURIComponent(raw) : '';
    }
    if (pathname.startsWith('/help_token/')) {
      const raw = pathname.slice('/help_token/'.length).split('/')[0];
      return raw ? `token:${decodeURIComponent(raw)}` : 'token';
    }
    return '';
  }, [location.pathname]);

  useEffect(() => {
    if (routeSeedQuery) {
      setQuery(routeSeedQuery);
    }
  }, [routeSeedQuery]);

  const searchMutation = useMutation({ mutationFn: searchHelpCenter });
  const { mutate: runSearch, isPending: isSearching, data: searchData } = searchMutation;

  useEffect(() => {
    if (!routeSeedQuery || isSearching || searchData) {
      return;
    }
    runSearch(routeSeedQuery);
  }, [isSearching, routeSeedQuery, runSearch, searchData]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-help-center">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Support</span>
            <span>Help Center Search</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/notifications" className="legacy-v1-link-btn">Notifications</Link>
          <Link to="/identity-access" className="legacy-v1-link-btn">Identity & Access</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              searchMutation.mutate(query.trim());
            }}
          >
            <h2>Search</h2>
            <label>
              Search query
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="password, enrollment..." />
            </label>
            <div className="actions">
              <button type="submit" disabled={searchMutation.isPending}>
                {searchMutation.isPending ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {searchMutation.error ? <p className="error-text legacy-v1-page-msg">Search failed.</p> : null}

          <section className="legacy-v1-user-list">
            {(searchMutation.data?.results ?? []).map((article) => (
              <article className="item-card" key={article.id}>
                <h3>{article.title}</h3>
                <p><strong>ID:</strong> {article.id}</p>
                <p><strong>URL:</strong> {article.url}</p>
              </article>
            ))}
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Search Info</h3>
            <p>Results: {searchMutation.data?.results.length ?? 0}</p>
            <p>Status: {searchMutation.isPending ? 'searching' : 'idle'}</p>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {searchMutation.data ? <pre>{JSON.stringify(searchMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
