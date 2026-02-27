import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDiscountsV1, fetchEmbargoV1, fetchExperimentsV1, fetchValV0 } from '../api/studio';

export function CompliancePage() {
  const discountsQuery = useQuery({ queryKey: ['compliance-discounts'], queryFn: fetchDiscountsV1 });
  const embargoQuery = useQuery({ queryKey: ['compliance-embargo'], queryFn: fetchEmbargoV1 });
  const valQuery = useQuery({ queryKey: ['compliance-val'], queryFn: fetchValV0 });
  const experimentsQuery = useQuery({ queryKey: ['compliance-experiments'], queryFn: fetchExperimentsV1 });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Compliance and Controls</h1>
        <p>React migration for policy, entitlement validation, and rollout control endpoints.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Pricing and Embargo</h2>
        {discountsQuery.isLoading ? <p>Loading discounts...</p> : null}
        {discountsQuery.error ? <p className="error-text">Failed to load discounts.</p> : null}
        {discountsQuery.data ? <pre>{JSON.stringify(discountsQuery.data, null, 2)}</pre> : null}

        {embargoQuery.isLoading ? <p>Loading embargo...</p> : null}
        {embargoQuery.error ? <p className="error-text">Failed to load embargo.</p> : null}
        {embargoQuery.data ? <pre>{JSON.stringify(embargoQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>VAL and Experiments</h2>
        {valQuery.isLoading ? <p>Loading VAL...</p> : null}
        {valQuery.error ? <p className="error-text">Failed to load VAL.</p> : null}
        {valQuery.data ? <pre>{JSON.stringify(valQuery.data, null, 2)}</pre> : null}

        {experimentsQuery.isLoading ? <p>Loading experiments...</p> : null}
        {experimentsQuery.error ? <p className="error-text">Failed to load experiments.</p> : null}
        {experimentsQuery.data ? <pre>{JSON.stringify(experimentsQuery.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
