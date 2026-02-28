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

  const searchMutation = useMutation({
    mutationFn: searchHelpCenter
  });
  const { mutate: runSearch, isPending: isSearching, data: searchData } = searchMutation;

  useEffect(() => {
    if (!routeSeedQuery || isSearching || searchData) {
      return;
    }
    runSearch(routeSeedQuery);
  }, [isSearching, routeSeedQuery, runSearch, searchData]);

  return (
    <main className="container">
      <header className="page-header">
        <h1>Help Center Search</h1>
        <p>Search support articles through the legacy help center API.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
      </header>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          searchMutation.mutate(query.trim());
        }}
      >
        <label>
          Search query
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="password, enrollment..." />
        </label>
        <div className="actions">
          <button type="submit" disabled={searchMutation.isPending}>
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </button>
          <Link to="/course/" className="button-link secondary-btn">
            Back to Dashboard
          </Link>
        </div>
      </form>

      {searchMutation.error ? <p className="error-text">Search failed.</p> : null}

      {searchMutation.data ? (
        <section className="team-grid">
          {searchMutation.data.results.map((article) => (
            <article className="item-card" key={article.id}>
              <h3>{article.title}</h3>
              <p>
                <strong>ID:</strong> {article.id}
              </p>
              <p>
                <strong>URL:</strong> {article.url}
              </p>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
