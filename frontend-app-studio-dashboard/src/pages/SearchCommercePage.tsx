import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchCommerceBaskets, fetchCreditProviders, fetchEntitlements, searchLegacy } from '../api/studio';

function queryState(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

export function SearchCommercePage() {
  const location = useLocation();
  const [courseId, setCourseId] = useState('course-v1:org+num+run');
  const [user, setUser] = useState('studio-react-user');

  const routeSeed = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      courseId: searchParams.get('course_id') ?? '',
      user: searchParams.get('user') ?? ''
    };
  }, [location.search]);

  useEffect(() => {
    if (routeSeed.courseId) {
      setCourseId(routeSeed.courseId);
    }
    if (routeSeed.user) {
      setUser(routeSeed.user);
    }
  }, [routeSeed]);

  const commerceQuery = useQuery({ queryKey: ['sc-commerce'], queryFn: fetchCommerceBaskets });
  const creditQuery = useQuery({ queryKey: ['sc-credit'], queryFn: fetchCreditProviders });
  const entitlementsQuery = useQuery({ queryKey: ['sc-entitlements'], queryFn: fetchEntitlements });

  const searchMutation = useMutation({ mutationFn: searchLegacy });
  const { mutate: runSearch, isPending: isSearching, data: searchData } = searchMutation;

  useEffect(() => {
    const isLegacySearchEntry = location.pathname.startsWith('/search') || location.pathname.startsWith('/catalog');
    if (!isLegacySearchEntry || isSearching || searchData) {
      return;
    }
    if (!courseId.trim() && !user.trim()) {
      return;
    }
    runSearch({ courseId: courseId.trim() || undefined, user: user.trim() || undefined });
  }, [courseId, isSearching, location.pathname, runSearch, searchData, user]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-search-commerce">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Catalog</span>
            <span>Search and Commerce</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/learner-services" className="legacy-v1-link-btn">Learner Services</Link>
          <Link to="/compliance" className="legacy-v1-link-btn">Compliance</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              searchMutation.mutate({ courseId: courseId || undefined, user: user || undefined });
            }}
          >
            <h2>Legacy Search</h2>
            <label>
              Course id
              <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
            </label>
            <label>
              User
              <input value={user} onChange={(event) => setUser(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={searchMutation.isPending}>{searchMutation.isPending ? 'Searching...' : 'Run Search'}</button>
            </div>
            {searchMutation.error ? <p className="error-text">Search failed.</p> : null}
          </form>

          <section className="create-form">
            <h2>Commerce Services</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Baskets</h3><p><strong>Status:</strong> {queryState(commerceQuery.isLoading, commerceQuery.isError)}</p></li>
              <li className="item-card"><h3>Credit Providers</h3><p><strong>Status:</strong> {queryState(creditQuery.isLoading, creditQuery.isError)}</p></li>
              <li className="item-card"><h3>Entitlements</h3><p><strong>Status:</strong> {queryState(entitlementsQuery.isLoading, entitlementsQuery.isError)}</p></li>
            </ul>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Result Data</h3>
            {searchMutation.data ? <pre>{JSON.stringify(searchMutation.data, null, 2)}</pre> : null}
            {!searchMutation.data && commerceQuery.data ? <pre>{JSON.stringify(commerceQuery.data, null, 2)}</pre> : null}
            {!searchMutation.data && !commerceQuery.data && entitlementsQuery.data ? <pre>{JSON.stringify(entitlementsQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
