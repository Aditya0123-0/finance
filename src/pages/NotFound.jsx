import { Link } from 'react-router-dom';
import { PageHeader } from '../components/index.js';
import { ROUTES } from '../constants/routes.js';

function NotFound() {
  return (
    <main>
      <PageHeader
        eyebrow="404"
        title="Page Not Found"
        description="The page you are looking for may have moved or does not exist."
        actions={
          <Link to={ROUTES.HOME} className="rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-ink">
            Go Home
          </Link>
        }
      />
    </main>
  );
}

export default NotFound;
