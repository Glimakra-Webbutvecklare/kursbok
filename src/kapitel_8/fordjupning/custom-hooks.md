# Custom hooks

En custom hook är en JavaScript-funktion vars namn börjar med `use` och som
anropar andra hooks. Den delar **logik**, inte en gemensam state-instans.

> **Mål:** Extrahera redan fungerande hook-logik när minst två komponenter eller projekt behöver samma beteende.

## När ska logik flyttas?

Extrahera inte kod bara för att en komponent är lång. Överväg en custom hook
när:

- hook-anrop och tillhörande eventfunktioner bildar ett tydligt ansvar,
- samma logik ska återanvändas,
- komponenten blir lättare att läsa efter flytten.

Reglerna är samma som för inbyggda hooks:

- anropa hooks högst upp,
- anropa dem inte villkorligt eller i loopar,
- använd prefixet `use`.

## Exempel 1: `useWorkshops`

Kärnkapitlets API-logik kan samlas när den fungerar och testats i `App`:

```jsx
import { useEffect, useState } from 'react';

export function useWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setStatus('loading');
        setError('');
        const response = await fetch('/api/workshops', {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        setWorkshops(await response.json());
        setStatus('success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError('Workshops kunde inte hämtas.');
          setStatus('error');
        }
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return { workshops, status, error };
}
```

Användning:

```jsx
const { workshops, status, error } = useWorkshops();
```

Varje komponent som anropar hooken får sin egen state. Hooken är en
återanvändbar funktion, inte en global lagringsplats.

## Exempel 2: `useBookingForm`

Formulärets state och generella fältuppdatering kan samlas:

```jsx
import { useState } from 'react';

const emptyBooking = {
  workshopId: '',
  slotId: '',
  name: '',
  email: '',
  participants: 1,
  message: '',
};

export function useBookingForm(workshopId) {
  const [booking, setBooking] = useState({
    ...emptyBooking,
    workshopId,
  });

  function updateField(event) {
    const { name, value } = event.target;

    setBooking((current) => ({
      ...current,
      [name]: name === 'participants' ? Number(value) : value,
    }));
  }

  function reset() {
    setBooking({ ...emptyBooking, workshopId });
  }

  return { booking, updateField, reset };
}
```

Validering kan stanna i formuläret tills även den behöver återanvändas. En
custom hook behöver inte ta över allt på en gång.

## Övning

1. Välj API-logiken eller formulärlogiken i din fungerande app.
2. Committa före refaktoreringen.
3. Flytta logiken till `src/hooks/`.
4. Kontrollera samma loading/error-lägen eller formulärflöde igen.

**Klar när:** beteendet är oförändrat, komponenten är lättare att läsa och du
kan förklara varför logiken hör ihop.

## Första hjälpen

| Symptom | Kontroll |
|---|---|
| Hook anropas villkorligt | Flytta anropet till komponentens översta nivå |
| Två komponenter delar inte state | Det är förväntat; använd lyft state eller Context om de måste dela |
| Oändliga API-anrop | Kontrollera Effectets beroendelista |
| Hooken har nästan hela UI:t | JSX bör oftast stanna i komponenten |
