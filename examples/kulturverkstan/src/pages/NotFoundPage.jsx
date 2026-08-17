import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="notice">
      <h1>Sidan hittades inte</h1>
      <Link to="/">Till alla workshops</Link>
    </section>
  );
}

export default NotFoundPage;
