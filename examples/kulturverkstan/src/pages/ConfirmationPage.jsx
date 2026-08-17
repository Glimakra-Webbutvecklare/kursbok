import { Link } from 'react-router-dom';
import { findSlot, findWorkshop } from '../data/workshops.js';

function ConfirmationPage({ booking, workshops }) {
  if (!booking) {
    return (
      <section className="notice">
        <h1>Ingen bokning att visa</h1>
        <p>Bekräftelsen finns efter att du har skickat bokningsformuläret.</p>
        <Link to="/">Till alla workshops</Link>
      </section>
    );
  }

  const workshop = findWorkshop(workshops, booking.workshopId);
  const slot = workshop && findSlot(workshop, booking.slotId);

  if (!workshop || !slot) {
    return (
      <section className="notice">
        <h1>Bokningsinformationen kunde inte visas</h1>
        <p>Workshoppen eller tillfället finns inte längre i listan.</p>
        <Link to="/">Till alla workshops</Link>
      </section>
    );
  }

  return (
    <section className="confirmation">
      <p className="eyebrow">Bokningen är sparad</p>
      <h1>Tack, {booking.name}!</h1>
      <p>Du har bokat {workshop.title}.</p>
      <dl className="confirmation-list">
        <div><dt>Tillfälle</dt><dd>{slot.label}</dd></div>
        <div><dt>Deltagare</dt><dd>{booking.participants}</dd></div>
        <div><dt>E-post</dt><dd>{booking.email}</dd></div>
      </dl>
      <Link to="/">Till alla workshops</Link>
    </section>
  );
}

export default ConfirmationPage;
