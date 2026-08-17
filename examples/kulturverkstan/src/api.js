export async function getWorkshops(signal) {
  const response = await fetch('/api/workshops', { signal });

  if (!response.ok) {
    throw new Error('Det gick inte att hämta workshops.');
  }

  return response.json();
}

export async function createBooking(booking) {
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
