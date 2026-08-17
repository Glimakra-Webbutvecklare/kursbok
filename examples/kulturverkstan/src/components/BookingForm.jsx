import { useState } from 'react';

const initialForm = {
  slotId: '',
  name: '',
  email: '',
  participants: 1,
  message: ''
};

function validate(form, workshop) {
  const errors = {};
  const selectedSlot = workshop.slots.find((slot) => slot.id === form.slotId);

  if (!selectedSlot || selectedSlot.placesLeft === 0) {
    errors.slotId = 'Välj ett ledigt tillfälle.';
  }
  if (!form.name.trim()) errors.name = 'Skriv ditt namn.';
  if (!form.email.includes('@')) errors.email = 'Skriv en giltig e-postadress.';
  if (form.participants < 1) {
    errors.participants = 'Välj minst en deltagare.';
  } else if (selectedSlot && form.participants > selectedSlot.placesLeft) {
    errors.participants = `Det finns bara ${selectedSlot.placesLeft} platser kvar.`;
  }

  return errors;
}

function FieldError({ id, children }) {
  if (!children) return null;
  return <p className="field-error" id={id} role="alert">{children}</p>;
}

function BookingForm({ workshop, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle');
  const selectedSlot = workshop.slots.find((slot) => slot.id === form.slotId);

  function updateField(event) {
    const { name, value } = event.target;

    if (name === 'slotId') {
      const nextSlot = workshop.slots.find((slot) => slot.id === value);
      setForm((current) => ({
        ...current,
        slotId: value,
        participants: nextSlot
          ? Math.min(current.participants, nextSlot.placesLeft)
          : current.participants
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: name === 'participants' ? Number(value) : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form, workshop);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitStatus('saving');
    try {
      await onSubmit(form);
    } catch {
      setSubmitStatus('error');
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="slotId">Tillfälle</label>
        <select
          id="slotId"
          name="slotId"
          value={form.slotId}
          onChange={updateField}
          aria-invalid={Boolean(errors.slotId)}
          aria-describedby={errors.slotId ? 'slotId-error' : undefined}
        >
          <option value="">Välj ett tillfälle</option>
          {workshop.slots.map((slot) => (
            <option key={slot.id} value={slot.id} disabled={slot.placesLeft === 0}>
              {slot.label} ({slot.placesLeft} platser kvar)
            </option>
          ))}
        </select>
        <FieldError id="slotId-error">{errors.slotId}</FieldError>
      </div>

      <div>
        <label htmlFor="name">Namn</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={updateField}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        <FieldError id="name-error">{errors.name}</FieldError>
      </div>

      <div>
        <label htmlFor="email">E-post</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        <FieldError id="email-error">{errors.email}</FieldError>
      </div>

      <div>
        <label htmlFor="participants">Antal deltagare</label>
        <input
          id="participants"
          name="participants"
          type="number"
          min="1"
          max={selectedSlot ? selectedSlot.placesLeft : undefined}
          value={form.participants}
          onChange={updateField}
          aria-invalid={Boolean(errors.participants)}
          aria-describedby={errors.participants ? 'participants-error' : undefined}
        />
        <FieldError id="participants-error">{errors.participants}</FieldError>
      </div>

      <div>
        <label htmlFor="message">Meddelande (valfritt)</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={form.message}
          onChange={updateField}
        />
      </div>

      <button disabled={submitStatus === 'saving'} type="submit">
        {submitStatus === 'saving' ? 'Bokar…' : 'Bekräfta bokning'}
      </button>
      <p className="form-status" aria-live="polite">
        {submitStatus === 'error' ? 'Bokningen kunde inte sparas. Försök igen.' : ''}
      </p>
    </form>
  );
}

export default BookingForm;
