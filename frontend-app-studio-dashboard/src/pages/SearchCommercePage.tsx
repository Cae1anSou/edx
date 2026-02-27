import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCommerceBaskets, fetchCreditProviders, fetchEntitlements, searchLegacy } from '../api/studio';

export function SearchCommercePage() {
  const [courseId, setCourseId] = useState('course-v1:org+num+run');
  const [user, setUser] = useState('studio-react-user');

  const commerceQuery = useQuery({ queryKey: ['sc-commerce'], queryFn: fetchCommerceBaskets });
  const creditQuery = useQuery({ queryKey: ['sc-credit'], queryFn: fetchCreditProviders });
  const entitlementsQuery = useQuery({ queryKey: ['sc-entitlements'], queryFn: fetchEntitlements });

  const searchMutation = useMutation({
    mutationFn: searchLegacy
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Search and Commerce</h1>
        <p>React migration for search, baskets, credit providers, and entitlements.</p>
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
          searchMutation.mutate({
            courseId: courseId || undefined,
            user: user || undefined
          });
        }}
      >
        <h2>Legacy Search</h2>
        <label>
          course id
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
        </label>
        <label>
          user
          <input value={user} onChange={(event) => setUser(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={searchMutation.isPending}>
            {searchMutation.isPending ? 'Searching...' : 'Run Search'}
          </button>
        </div>
        {searchMutation.error ? <p className="error-text">Search failed.</p> : null}
        {searchMutation.data ? <pre>{JSON.stringify(searchMutation.data, null, 2)}</pre> : null}
      </form>

      <section className="create-form">
        <h2>Commerce Baskets</h2>
        {commerceQuery.isLoading ? <p>Loading baskets...</p> : null}
        {commerceQuery.error ? <p className="error-text">Failed to load baskets.</p> : null}
        {commerceQuery.data ? <pre>{JSON.stringify(commerceQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Credit Providers and Entitlements</h2>
        {creditQuery.isLoading ? <p>Loading credit providers...</p> : null}
        {creditQuery.error ? <p className="error-text">Failed to load credit providers.</p> : null}
        {creditQuery.data ? <pre>{JSON.stringify(creditQuery.data, null, 2)}</pre> : null}

        {entitlementsQuery.isLoading ? <p>Loading entitlements...</p> : null}
        {entitlementsQuery.error ? <p className="error-text">Failed to load entitlements.</p> : null}
        {entitlementsQuery.data ? <pre>{JSON.stringify(entitlementsQuery.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
