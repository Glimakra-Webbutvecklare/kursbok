import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBooking } from '../api.js';
import BookingForm from '../components/BookingForm.jsx';
import { findWorkshop } from '../data/workshops.js';

function BookingPage({
  workshops,
  status,
  errorMessage,
  onRetry,
  onBooked
}) {
  const { workshopId } = useParams();
  const navigate = useNavigate();

  if (status === 'loading') return <p className="notice">Laddar bokningen…</p>;

  if (status === 'error') {
    return (
      <section className="notice" role="alert">
        <h1>Bokningen kunde inte laddas</h1>
        <p>{errorMessage}</p>
        <button type="button" onClick={onRetry}>Försök igen</button>
      </section>
    );
  }

  if (workshops.length === 0) {
    return (
      <section className="notice">
        <h1>Inga workshops att boka</h1>
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

  async function handleBooking(form) {
    const booking = {
      workshopId: workshop.id,
      slotId: form.slotId,
      name: form.name,
      email: form.email,
      participants: form.participants,
      message: form.message
    };

    await createBooking(booking);
    onBooked(booking);
    navigate('/confirm');
  }

  return (
    <section className="form-page">
      <p className="eyebrow">Boka workshop</p>
      <h1>{workshop.title}</h1>
      <BookingForm workshop={workshop} onSubmit={handleBooking} />
    </section>
  );
}

export default BookingPage;
