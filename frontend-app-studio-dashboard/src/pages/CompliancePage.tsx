import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDiscountsV1, fetchEmbargoV1, fetchExperimentsV1, fetchValV0 } from '../api/studio';

type ApiRow = { label: string; route: string; state: 'loading' | 'error' | 'ok' };

function getState(isLoading: boolean, isError: boolean): ApiRow['state'] {
  if (isLoading) return 'loading';
  return isError ? 'error' : 'ok';
}

export function CompliancePage() {
  const discountsQuery = useQuery({ queryKey: ['compliance-discounts'], queryFn: fetchDiscountsV1 });
  const embargoQuery = useQuery({ queryKey: ['compliance-embargo'], queryFn: fetchEmbargoV1 });
  const valQuery = useQuery({ queryKey: ['compliance-val'], queryFn: fetchValV0 });
  const experimentsQuery = useQuery({ queryKey: ['compliance-experiments'], queryFn: fetchExperimentsV1 });

  const rows: ApiRow[] = [
    { label: 'Discount Rules', route: '/api/discounts/v1/', state: getState(discountsQuery.isLoading, discountsQuery.isError) },
    { label: 'Embargo', route: '/api/embargo/v1/', state: getState(embargoQuery.isLoading, embargoQuery.isError) },
    { label: 'VAL', route: '/api/val/v0/', state: getState(valQuery.isLoading, valQuery.isError) },
    { label: 'Experiments', route: '/api/experiments/v1/', state: getState(experimentsQuery.isLoading, experimentsQuery.isError) }
  ];

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-compliance">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Policy</span><span>Compliance and Controls</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/search-commerce" className="legacy-v1-link-btn">Search & Commerce</Link>
          <Link to="/system-status" className="legacy-v1-link-btn">System Status</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Service Summary</h2>
            <ul className="item-list">
              {rows.map((item) => (
                <li className="item-card" key={item.route}>
                  <h3>{item.label}</h3>
                  <p><strong>Endpoint:</strong> {item.route}</p>
                  <p><strong>Status:</strong> {item.state}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="create-form">
            <h2>Control Surfaces</h2>
            <p>Discount and embargo endpoints are used for checkout guardrails and regional restrictions.</p>
            <p>VAL and experiments endpoints back controlled media rollout and runtime feature toggles.</p>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Responses</h3>
            {discountsQuery.data ? <pre>{JSON.stringify(discountsQuery.data, null, 2)}</pre> : null}
            {!discountsQuery.data && embargoQuery.data ? <pre>{JSON.stringify(embargoQuery.data, null, 2)}</pre> : null}
            {!discountsQuery.data && !embargoQuery.data && valQuery.data ? <pre>{JSON.stringify(valQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
