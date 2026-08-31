# Formulär: komplettera bokningen

Kulturverkstan har redan en workshoplista, filter, vald tid och bokningsstate. Nu **bygger vi vidare på samma app**. Vi tar inte bort `WorkshopList`, `WorkshopCard`, `BookingSummary` eller state från föregående lektion.

Använd samma tre workshops som i komponentlektionen (`keramik`, `vavning` och `foto`). Kontrollera att de syns i `WorkshopList` innan du fortsätter.

Efter lektionen kan besökaren välja tid, fylla i sina uppgifter och se en bekräftelse. Antalet deltagare kan aldrig vara större än antalet lediga platser på den valda tiden.

## Mål

- koppla tillgängliga formulärfält till befintlig state med `value` och `onChange`
- validera tid, namn, e-post och antal deltagare
- skicka en giltig bokning upp till `App` utan att riva det tidigare flödet

## 1. Se och förutsäg: ett kontrollerat fält

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
3. Spread behåller bokningens andra fält.
4. `App` sparar det nya objektet och React renderar igen.

`label`, `htmlFor` och `id` hör ihop. Klick på etiketten flyttar fokus till fältet och en skärmläsare kan läsa rätt namn.

> **Fyll i:** Vilken prop i `App` ska skickas som `onBookingChange` om `App` äger `booking` med `useState`? Svaret är setter-funktionen `__________`.

## 2. Ett fält som syns

Skapa `src/components/BookingForm.jsx` med bara namnfältet. Ingen validering ännu.

```jsx
export default function BookingForm({ booking, onBookingChange }) {
  return (
    <form>
      <div>
        <label htmlFor="name">Namn</label>
        <input
          id="name"
          name="name"
          value={booking.name}
          onChange={(event) => {
            onBookingChange({ ...booking, name: event.target.value });
          }}
        />
      </div>
    </form>
  );
}
```

Koppla in formuläret i den `App.jsx` du redan har. Behåll lista, filter, sammanfattning och deltagarknappar. Lägg till importen och visa formuläret när en workshop är vald:

```jsx
import BookingForm from './components/BookingForm.jsx';
```

`selectedWorkshop` finns redan i `App`. Lägg till det här **efter** `BookingSummary`, fortfarande inuti `<main>`:

```jsx
{selectedWorkshop && (
  <section aria-labelledby="booking-heading">
    <h2 id="booking-heading">Boka {selectedWorkshop.title}</h2>
    <BookingForm
      booking={booking}
      onBookingChange={setBooking}
    />
  </section>
)}
```

**Kör:** välj en tid i listan och skriv ditt namn. Sammanfattningen och fältet ska visa samma text. Formuläret ska inte synas innan en tid är vald.

## 3. Fyll i: e-post och meddelande

När flera fält ska uppdatera samma objekt blir en `onChange` per fält snabbt upprepande. En gemensam `handleChange` läser fältets `name` och uppdaterar rätt nyckel.

Lägg till funktionen i `BookingForm` och byt namnfältets `onChange` mot `handleChange`. Fyll sedan i luckorna så att e-post och meddelande följer samma mönster.

```jsx
function handleChange(event) {
  const { name, value } = event.target;

  onBookingChange({
    ...booking,
    [name]: value,
  });
}
```

```jsx
<div>
  <label htmlFor="email">E-post</label>
  <input
    id="email"
    name="_____"
    type="email"
    value={booking._____}
    onChange={handleChange}
    autoComplete="email"
  />
</div>

<div>
  <label htmlFor="message">Meddelande (valfritt)</label>
  <textarea
    id="message"
    name="_____"
    value={booking._____}
    onChange={_____}
  />
</div>
```

<details>
<summary>Lösningsförslag</summary>

```jsx
<div>
  <label htmlFor="email">E-post</label>
  <input
    id="email"
    name="email"
    type="email"
    value={booking.email}
    onChange={handleChange}
    autoComplete="email"
  />
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
```

`name="email"` måste matcha nyckeln `booking.email`. Annars går det inte att skriva i fältet.

</details>

`[name]` är en beräknad nyckel. Om `name` är `"email"` blir det samma sak som att skriva `email: value` i objektet.

**Kör:** fyll i namn, e-post och meddelande. Öppna React DevTools och kontrollera att `booking` i `App` innehåller alla tre värdena.

## 4. Skicka utan validering

Ett HTML-formulär laddar om sidan vid submit. I React stoppar du det med `event.preventDefault()` och låter state visa vad som hände.

Utöka `BookingForm` med status, `onBooked` och en submit-knapp:

```jsx
import { useState } from 'react';

export default function BookingForm({ booking, onBookingChange, onBooked }) {
  const [status, setStatus] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    onBookingChange({
      ...booking,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('Bokningen är klar.');
    onBooked(booking);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* namn, e-post och meddelande som tidigare */}
      <button type="submit">Bekräfta bokning</button>
      <p>{status}</p>
    </form>
  );
}
```

I `App` behövs en state för den bekräftade bokningen och en prop till formuläret:

```jsx
const [confirmedBooking, setConfirmedBooking] = useState(null);
```

```jsx
<BookingForm
  booking={booking}
  onBookingChange={setBooking}
  onBooked={setConfirmedBooking}
/>
```

**Kör:** skicka formuläret med tomt namn. Statusraden säger att bokningen är klar. Det är fel mot användaren, men koden gör precis vad du bad den om. Nästa steg stoppar ogiltiga värden.

## 5. Validera ett fält

Lägg till `errors` i `BookingForm` och en `validate`-funktion som bara kollar namn:

```jsx
const [errors, setErrors] = useState({});
```

```jsx
function validate() {
  const nextErrors = {};

  if (!booking.name.trim()) {
    nextErrors.name = 'Skriv ditt namn.';
  }

  return nextErrors;
}
```

`trim()` tar bort mellanslag. Ett fält med bara blanksteg räknas som tomt.

Ändra `handleSubmit` så att den validerar **innan** bokningen skickas:

```jsx
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
```

Visa felet under namnfältet:

```jsx
<input
  id="name"
  name="name"
  value={booking.name}
  onChange={handleChange}
  autoComplete="name"
/>
{errors.name && <p>{errors.name}</p>}
```

`Object.keys(nextErrors).length > 0` betyder att minst ett fält har ett fel. Då ska `onBooked` inte köras.

**Kör:** skicka med tomt namn. Felet ska synas under fältet och bekräftelsen ska inte komma. Fyll i ett namn och skicka igen. Nu ska statusen bli grön.

## 6. Fyll i: e-post och deltagare

Formuläret ska också stoppa ogiltig e-post och ett deltagarantal utanför `placesLeft`. `BookingForm` behöver workshopen för att veta hur många platser den valda tiden har.

Lägg till propen `workshop` och räkna fram den valda tiden:

```jsx
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
```

I `App`:

```jsx
<BookingForm
  workshop={selectedWorkshop}
  booking={booking}
  onBookingChange={setBooking}
  onBooked={setConfirmedBooking}
/>
```

Fyll i luckorna i `validate`. Namnregeln från förra steget ska vara kvar.

```jsx
function validate() {
  const nextErrors = {};

  if (!booking.name.trim()) {
    nextErrors.name = 'Skriv ditt namn.';
  }

  if (!booking.email.includes(_____)) {
    nextErrors.email = 'Skriv en giltig e-postadress.';
  }

  if (
    !selectedSlot ||
    booking.participants < 1 ||
    booking.participants > selectedSlot._____
  ) {
    nextErrors.participants = selectedSlot
      ? `Välj mellan 1 och ${selectedSlot.placesLeft} deltagare.`
      : 'Välj en tid innan du anger antal deltagare.';
  }

  return nextErrors;
}
```

<details>
<summary>Lösningsförslag</summary>

```jsx
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
```

</details>

Lägg till deltagarfältet. `handleChange` måste göra om värdet till ett tal:

```jsx
function handleChange(event) {
  const { name, value } = event.target;

  onBookingChange({
    ...booking,
    [name]: name === 'participants' ? Number(value) : value,
  });
}
```

```jsx
<div>
  <label htmlFor="participants">Antal deltagare</label>
  <input
    id="participants"
    name="participants"
    type="number"
    min="1"
    max={selectedSlot ? selectedSlot.placesLeft : 1}
    value={booking.participants}
    onChange={handleChange}
  />
  {selectedSlot && (
    <p>Högst {selectedSlot.placesLeft} deltagare för denna tid.</p>
  )}
  {errors.participants && <p>{errors.participants}</p>}
</div>
```

Visa också `{errors.email && <p>{errors.email}</p>}` under e-postfältet.

**Kör:** skicka med `hej` som e-post. Felet ska sitta under e-postfältet. Välj keramiktiden med 2 platser och skriv `5` som antal. Deltagarfelet ska nämna taket 2.

## 7. Tillgänglighet som eget steg

Felen syns nu visuellt, men ett ogiltigt fält behöver också kopplas för skärmläsare. Tre attribut gör jobbet:

- `aria-invalid="true"` när fältet har ett fel
- `aria-describedby` pekar på feltextens `id`
- `role="alert"` på feltexten så att den läses upp

**Följ med:** koppla namnfältet.

```jsx
<input
  id="name"
  name="name"
  value={booking.name}
  onChange={handleChange}
  autoComplete="name"
  aria-invalid={Boolean(errors.name)}
  aria-describedby={errors.name ? 'name-error' : undefined}
/>
{errors.name && (
  <p id="name-error" role="alert">{errors.name}</p>
)}
```

`Boolean(errors.name)` blir `true` när feltexten finns, annars `false`. `aria-describedby` ska bara sättas när felstycket faktiskt finns i DOM:en.

Lägg `noValidate` på `<form>` så att webbläsarens inbyggda e-postvarning inte krockar med era egna meddelanden. Flytta statusraden till `aria-live="polite"` så att “Bokningen är klar.” läses upp utan att stjäla fokus:

```jsx
<form onSubmit={handleSubmit} noValidate>
```

```jsx
<p aria-live="polite">{status}</p>
```

**Gör själv:** lägg samma `aria-invalid`, `aria-describedby` och `role="alert"` på e-post och deltagare. Använd `id="email-error"` och `id="participants-error"`.

<details>
<summary>Lösningsförslag för e-post</summary>

```jsx
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
{errors.email && (
  <p id="email-error" role="alert">{errors.email}</p>
)}
```

</details>

**Kontrollera:** skicka ett tomt formulär. Inspektera namnfältet. Det ska ha `aria-invalid="true"` och peka på `name-error`.

## 8. Tid och tak

Listan har redan valt en tid, men besökaren ska kunna byta tid i formuläret. Radioknappar i ett `fieldset` grupperar valet. Fullbokade tider ska vara `disabled`.

Lägg till tidvalet **överst** i formuläret och en regel i `validate`:

```jsx
if (!selectedSlot || selectedSlot.placesLeft === 0) {
  nextErrors.slotId = 'Välj en tid med lediga platser.';
}
```

När användaren byter tid måste maxvärdet räknas om. Om antalet var 5 och den nya tiden bara har 2 platser sänks antalet till 2.

```jsx
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
```

```jsx
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
  {errors.slotId && (
    <p id="slot-error" role="alert">{errors.slotId}</p>
  )}
</fieldset>
```

**Kör:** välj fototid med 8 platser och skriv `5` deltagare. Byt till keramiktiden med 2 platser. Antalet ska bli `2` utan att du rört deltagarfältet. Den fullbokade lördagen ska inte gå att välja.

## 9. Bekräftelse i App

När `onBooked` körs sparar `App` bokningen i `confirmedBooking`. Visa ett tackmeddelande **efter** formulärsektionen, fortfarande i `<main>`:

```jsx
{confirmedBooking && (
  <section aria-live="polite">
    <h2>Tack, {confirmedBooking.name}!</h2>
    <p>Din bokning är sparad i appens state.</p>
  </section>
)}
```

I `handleSelectSlot` i `App`, nollställ bekräftelsen när besökaren väljer en ny tid, så att ett gammalt tack inte ligger kvar:

```jsx
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
```

Detta är en utbyggnad av föregående `App`: samma lista skickar valet uppåt, samma bokningsobjekt visas i sammanfattningen och formuläret kompletterar de återstående fälten.

## Se → förutsäg → kör → ändra → kontrollera → förklara

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
- ett tomt namn stoppas innan `onBooked` körs

## Första hjälpen

| Problem | Kontrollera först |
| --- | --- |
| Det går inte att skriva | Matchar fältets `name`, `value` och nyckeln i `booking`? |
| Andra fält försvinner | Finns `...booking` i objektet som skickas till `onBookingChange`? |
| Fel maxvärde visas | Hittas `selectedSlot` i den valda workshopens `slots`? |
| Formuläret visas inte | Har listans knapp skickat både `workshopId` och `slotId` upp till `App`? |
| Sidan laddas om | Kör `event.preventDefault()` först i `handleSubmit`. |
| Bekräftelsen kommer trots fel | Returnerar `validate` ett objekt, och stoppar `handleSubmit` när det har nycklar? |

## Commit

```bash
git add src
git commit -m "lägg till tillgängligt bokningsformulär"
```

I nästa lektion placerar du samma lista, detalj, formulär och bekräftelse på fyra routes.
