import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchHelpCenter } from '../api/studio';

export function HelpCenterPage() {
  const [query, setQuery] = useState('');

  const searchMutation = useMutation({
    mutationFn: searchHelpCenter
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Help Center Search</h1>
        <p>Search support articles through the legacy help center API.</p>
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
