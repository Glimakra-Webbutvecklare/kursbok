import { Link, useParams } from 'react-router-dom';
import { findWorkshop } from '../data/workshops.js';

function WorkshopPage({ workshops, status, errorMessage, onRetry }) {
  const { workshopId } = useParams();

  if (status === 'loading') return <p className="notice">Laddar workshop…</p>;

  if (status === 'error') {
    return (
      <section className="notice" role="alert">
        <h1>Workshoppen kunde inte laddas</h1>
        <p>{errorMessage}</p>
        <button type="button" onClick={onRetry}>Försök igen</button>
      </section>
    );
  }

  if (workshops.length === 0) {
    return (
      <section className="notice">
        <h1>Inga workshops att visa</h1>
        <p>Det finns inga workshops just nu. Försök igen senare.</p>
        <Link to="/">Till alla workshops</Link>
      </section>
    );
  }

  const workshop = findWorkshop(workshops, workshopId);
  if (!workshop) {
    return (
      <section className="notice">
        <h1>Workshoppen hittades inte</h1>
        <Link to="/">Till alla workshops</Link>
      </section>
    );
  }

  const hasOpenSlot = workshop.slots.some((slot) => slot.placesLeft > 0);

  return (
    <article className="detail-page">
      <p className="eyebrow">{workshop.category}</p>
      <h1>{workshop.title}</h1>
      <p>{workshop.description}</p>
      <p>{workshop.durationMinutes} minuter · {workshop.priceSek} kr</p>

      <h2>Tillfällen</h2>
      <ul className="slot-list">
        {workshop.slots.map((slot) => (
          <li key={slot.id}>
            <span>{slot.label}</span>
            <span>{slot.placesLeft > 0 ? `${slot.placesLeft} platser kvar` : 'Fullbokad'}</span>
          </li>
        ))}
      </ul>

      {hasOpenSlot ? (
        <Link className="button-link" to={`/book/${workshop.id}`}>
          Boka {workshop.title}
        </Link>
      ) : (
        <p>Workshoppen är fullbokad.</p>
      )}
    </article>
  );
}

export default WorkshopPage;
