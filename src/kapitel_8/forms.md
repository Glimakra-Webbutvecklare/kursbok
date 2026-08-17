# Formulär: komplettera bokningen

Kulturverkstan har redan en workshoplista, filter, vald tid och bokningsstate. Nu **bygger vi vidare på samma app**. Vi tar inte bort `WorkshopList`, `WorkshopCard`, `BookingSummary` eller state från föregående lektion.

Efter lektionen kan besökaren välja tid, fylla i sina uppgifter och se en bekräftelse. Antalet deltagare kan aldrig vara större än antalet lediga platser på den valda tiden.

## Mål

- koppla tillgängliga formulärfält till befintlig state med `value` och `onChange`
- validera tid, namn, e-post och antal deltagare
- skicka en giltig bokning upp till `App` utan att riva det tidigare flödet

## 1. Säkerställ samma workshopdata

Resten av kapitlet använder exakt samma tre workshops. Ersätt innehållet i `src/data/workshops.js` med:

```js
export const workshops = [
  {
    id: 'keramik',
    title: 'Keramik för nybörjare',
    category: 'Hantverk',
    description: 'Forma och dekorera en egen liten skål.',
    durationMinutes: 120,
    priceSek: 350,
    slots: [
      { id: 'keramik-lor-10', label: 'Lördag 10.00–12.00', placesLeft: 6 },
      { id: 'keramik-ons-18', label: 'Onsdag 18.00–20.00', placesLeft: 2 },
    ],
  },
  {
    id: 'vavning',
    title: 'Väv din första provbit',
    category: 'Textil',
    description: 'Lär dig grunderna i färg, varp och inslag i en liten bordsvävstol.',
    durationMinutes: 150,
    priceSek: 425,
    slots: [
      { id: 'vavning-son-13', label: 'Söndag 13.00–15.30', placesLeft: 4 },
    ],
  },
  {
    id: 'foto',
    title: 'Fotopromenad i byn',
    category: 'Foto',
    description: 'Öva komposition och ljus med mobilen eller en egen kamera.',
    durationMinutes: 90,
    priceSek: 200,
    slots: [
      { id: 'foto-tor-17', label: 'Torsdag 17.30–19.00', placesLeft: 8 },
      { id: 'foto-lor-14', label: 'Lördag 14.00–15.30', placesLeft: 0 },
    ],
  },
];
```

Kontrollera att alla tre visas genom den befintliga `WorkshopList` innan du fortsätter.

## 2. Se och förutsäg

Ett **kontrollerat fält** visar ett värde från state och skickar varje ändring tillbaka till state:

```jsx
<label htmlFor="name">Namn</label>
<input
  id="name"
  name="name"
  value={booking.name}
  onChange={(event) => {
    onBookingChange({ ...booking, name: event.target.value });
  }}
/>
```

Förutsäg vad `booking.name` innehåller när användaren skriver `Sam`:

1. `value` visar värdet från state.
2. `onChange` körs när användaren skriver.
3. Spread behåller bokningens andra fem fält.
4. `App` sparar det nya objektet och React renderar igen.

`label`, `htmlFor` och `id` hör ihop. Klick på etiketten flyttar fokus till fältet och en skärmläsare kan läsa rätt namn.

## 3. Lägg till `BookingForm`

Skapa `src/components/BookingForm.jsx`. Komponenten får den valda workshopen och bokningsobjektet från `App`.

```jsx
import { useState } from 'react';

export default function BookingForm({
  workshop,
  booking,
  onBookingChange,
  onBooked,
}) {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const selectedSlot = workshop.slots.find(
    (slot) => slot.id === booking.slotId,
  );
  const maxParticipants = selectedSlot ? selectedSlot.placesLeft : 1;

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === 'slotId') {
      const nextSlot = workshop.slots.find((slot) => slot.id === value);
      const nextMaximum = nextSlot ? nextSlot.placesLeft : 1;

      onBookingChange({
        ...booking,
        workshopId: workshop.id,
        slotId: value,
        participants: Math.min(booking.participants, nextMaximum),
      });
      return;
    }

    onBookingChange({
      ...booking,
      [name]: name === 'participants' ? Number(value) : value,
    });
  }

  function validate() {
    const nextErrors = {};

    if (!selectedSlot || selectedSlot.placesLeft === 0) {
      nextErrors.slotId = 'Välj en tid med lediga platser.';
    }
    if (!booking.name.trim()) {
      nextErrors.name = 'Skriv ditt namn.';
    }
    if (!booking.email.includes('@')) {
      nextErrors.email = 'Skriv en giltig e-postadress.';
    }
    if (
      !selectedSlot ||
      booking.participants < 1 ||
      booking.participants > selectedSlot.placesLeft
    ) {
      nextErrors.participants = selectedSlot
        ? `Välj mellan 1 och ${selectedSlot.placesLeft} deltagare.`
        : 'Välj en tid innan du anger antal deltagare.';
    }

    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('Bokningen kunde inte skickas. Kontrollera fälten.');
      return;
    }

    setStatus('Bokningen är klar.');
    onBooked(booking);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset aria-invalid={Boolean(errors.slotId)}>
        <legend>Välj tid</legend>
        {workshop.slots.map((slot) => (
          <div key={slot.id}>
            <input
              id={slot.id}
              type="radio"
              name="slotId"
              value={slot.id}
              checked={booking.slotId === slot.id}
              onChange={handleChange}
              aria-invalid={Boolean(errors.slotId)}
              aria-describedby={errors.slotId ? 'slot-error' : undefined}
              disabled={slot.placesLeft === 0}
            />
            <label htmlFor={slot.id}>
              {slot.label} ({slot.placesLeft} platser kvar)
            </label>
          </div>
        ))}
        {errors.slotId && <p id="slot-error" role="alert">{errors.slotId}</p>}
      </fieldset>

      <div>
        <label htmlFor="name">Namn</label>
        <input
          id="name"
          name="name"
          value={booking.name}
          onChange={handleChange}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <p id="name-error" role="alert">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email">E-post</label>
        <input
          id="email"
          name="email"
          type="email"
          value={booking.email}
          onChange={handleChange}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <p id="email-error" role="alert">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="participants">Antal deltagare</label>
        <input
          id="participants"
          name="participants"
          type="number"
          min="1"
          max={maxParticipants}
          value={booking.participants}
          onChange={handleChange}
          aria-invalid={Boolean(errors.participants)}
          aria-describedby={errors.participants ? 'participants-error' : undefined}
        />
        {selectedSlot && <p>Högst {selectedSlot.placesLeft} deltagare för denna tid.</p>}
        {errors.participants && (
          <p id="participants-error" role="alert">{errors.participants}</p>
        )}
      </div>

      <div>
        <label htmlFor="message">Meddelande (valfritt)</label>
        <textarea
          id="message"
          name="message"
          value={booking.message}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Bekräfta bokning</button>
      <p aria-live="polite">{status}</p>
    </form>
  );
}
```

När användaren byter tid räknas maxvärdet om från just den tidens `placesLeft`. Om antalet var 5 och den nya tiden bara har 2 platser sänks antalet automatiskt till 2.

## 4. Koppla formuläret till den befintliga appen

Behåll `WorkshopList`, `BookingSummary`, filtret och bokningsstate från förra lektionen. Ersätt `App.jsx` med den sammanhängande versionen nedan:

```jsx
import { useState } from 'react';
import BookingForm from './components/BookingForm.jsx';
import BookingSummary from './components/BookingSummary.jsx';
import WorkshopList from './components/WorkshopList.jsx';
import { workshops } from './data/workshops.js';

const emptyBooking = {
  workshopId: '',
  slotId: '',
  name: '',
  email: '',
  participants: 1,
  message: '',
};

export default function App() {
  const [category, setCategory] = useState('Alla');
  const [booking, setBooking] = useState(emptyBooking);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const visibleWorkshops = category === 'Alla'
    ? workshops
    : workshops.filter((workshop) => workshop.category === category);
  const selectedWorkshop = workshops.find(
    (workshop) => workshop.id === booking.workshopId,
  );

  function handleSelectSlot(workshopId, slotId) {
    const workshop = workshops.find((item) => item.id === workshopId);
    const slot = workshop.slots.find((item) => item.id === slotId);

    setBooking((current) => ({
      ...current,
      workshopId,
      slotId,
      participants: Math.min(current.participants, slot.placesLeft),
    }));
    setConfirmedBooking(null);
  }

  return (
    <main>
      <h1>Kulturverkstan</h1>
      <p>Hitta en workshop och boka din plats.</p>

      <div aria-label="Filtrera workshops">
        {['Alla', 'Hantverk', 'Textil', 'Foto'].map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <WorkshopList
        workshops={visibleWorkshops}
        onSelectSlot={handleSelectSlot}
      />
      <BookingSummary booking={booking} workshops={workshops} />

      {selectedWorkshop && (
        <section aria-labelledby="booking-heading">
          <h2 id="booking-heading">Boka {selectedWorkshop.title}</h2>
          <BookingForm
            workshop={selectedWorkshop}
            booking={booking}
            onBookingChange={setBooking}
            onBooked={setConfirmedBooking}
          />
        </section>
      )}

      {confirmedBooking && (
        <section aria-live="polite">
          <h2>Tack, {confirmedBooking.name}!</h2>
          <p>Din bokning är sparad i appens state.</p>
        </section>
      )}
    </main>
  );
}
```

Detta är en utbyggnad av föregående `App`: samma lista skickar valet uppåt, samma bokningsobjekt visas i sammanfattningen och formuläret kompletterar de återstående fälten.

## Se → förutsäg → kör → ändra

1. **Se:** följ `booking` från `App` till ett fält och tillbaka igen.
2. **Förutsäg:** vad händer med 5 deltagare om du byter till tiden med 2 platser?
3. **Kör:** välj tider med olika antal platser och skicka en giltig bokning.
4. **Ändra:** skriv en tydligare hjälptext under deltagarfältet.
5. **Kontrollera:** använd formuläret med endast tangentbord och klicka på alla etiketter.
6. **Förklara:** varför äger `App` bokningsstate medan formuläret äger felmeddelanden?

## Checkpoint

Du är klar när:

- lista, filter, val och bokningssammanfattning från förra lektionen finns kvar
- alla fält har etiketter och ogiltiga fält får `aria-invalid="true"`
- max och validering alltid följer `placesLeft` för vald tid
- en giltig bokning visar bekräftelsen utan sidladdning

## Första hjälpen

| Problem | Kontrollera först |
| --- | --- |
| Det går inte att skriva | Matchar fältets `name`, `value` och nyckeln i `booking`? |
| Andra fält försvinner | Finns `...booking` i objektet som skickas till `onBookingChange`? |
| Fel maxvärde visas | Hittas `selectedSlot` i den valda workshopens `slots`? |
| Formuläret visas inte | Har listans knapp skickat både `workshopId` och `slotId` upp till `App`? |
| Sidan laddas om | Kör `event.preventDefault()` först i `handleSubmit`. |

## Commit

```bash
git add src
git commit -m "lägg till tillgängligt bokningsformulär"
```

I nästa lektion placerar du samma lista, detalj, formulär och bekräftelse på fyra routes.
