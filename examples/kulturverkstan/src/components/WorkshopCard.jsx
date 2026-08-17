import { Link } from 'react-router-dom';

function WorkshopCard({ workshop }) {
  const openPlaces = workshop.slots.reduce(
    (sum, slot) => sum + slot.placesLeft,
    0
  );

  return (
    <article className="workshop-card">
      <p className="eyebrow">{workshop.category}</p>
      <h2>{workshop.title}</h2>
      <p>{workshop.description}</p>
      <dl className="facts">
        <div>
          <dt>Längd</dt>
          <dd>{workshop.durationMinutes} minuter</dd>
        </div>
        <div>
          <dt>Pris</dt>
          <dd>{workshop.priceSek} kr</dd>
        </div>
      </dl>
      <p>{openPlaces > 0 ? `${openPlaces} platser kvar` : 'Fullbokad'}</p>
      <Link className="button-link" to={`/workshops/${workshop.id}`}>
        Läs mer om {workshop.title}
      </Link>
    </article>
  );
}

export default WorkshopCard;
