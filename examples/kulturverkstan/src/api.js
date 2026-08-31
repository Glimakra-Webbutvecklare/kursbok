function workshopsUrl() {
  if (import.meta.env.PROD) {
    return `${import.meta.env.BASE_URL}workshops.json`;
  }

  return '/api/workshops';
}

export async function getWorkshops(signal) {
  const response = await fetch(workshopsUrl(), { signal });

  if (!response.ok) {
    throw new Error('Det gick inte att hämta workshops.');
  }

  return response.json();
}

export async function createBooking(booking) {
  if (import.meta.env.PROD) {
    return booking;
  }

  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });

  if (!response.ok) {
    throw new Error('Bokningen kunde inte sparas. Försök igen.');
  }

  return response.json();
}
