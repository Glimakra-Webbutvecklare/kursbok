# Routing: fyra vyer i Kulturverkstan

Kulturverkstan har redan en fungerande lista, bokningsstate och ett formulär. Nu flyttar vi dessa delar till fyra adresser. Vi behåller komponenterna och datan; routing bestämmer bara **vilken vy** som visas.

Efter lektionen kan besökaren gå från lista till detalj, bokning och bekräftelse utan att hela sidan laddas om. En wildcard-route fångar alla okända adresser.

## Mål

- skapa fyra appvyer och en fallback med `BrowserRouter`, `Routes` och `Route`
- navigera med `Link` och läsa `workshopId` med `useParams`
- navigera efter ett event med `useNavigate` utan att förlora bokningsstate

## 1. Installera React Router

Stå i Kulturverkstans projektmapp:

```bash
npm install react-router-dom@7.18.2
npm run dev
```

Appen ser likadan ut tills routerkomponenterna används.

## 2. Förutsäg appens fem route-regler

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/workshops/:workshopId" element={<WorkshopPage />} />
  <Route path="/book/:workshopId" element={<BookPage />} />
  <Route path="/confirm" element={<ConfirmPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

De fyra första är appens vyer. `*` är en **wildcard fallback** för alla andra adresser.

`:workshopId` är en parameter. Adressen `/workshops/keramik` ger parametern `workshopId` värdet `'keramik'`. Samma route fungerar för `vavning` och `foto`.

## 3. Lägg till länkar utan att skriva om kortet

Behåll valknapparna i `WorkshopCard`. Importera dessutom `Link` och lägg till en detaljlänk i kortet:

```jsx
import { Link } from 'react-router-dom';

// Behåll kortets befintliga innehåll och tidsknappar.
<Link to={`/workshops/${workshop.id}`}>
  Läs mer om {workshop.title}
</Link>
```

`Link` byter adress utan en helsidesladdning. En knapp används fortfarande för valet av en tid, eftersom det är en användarhandling som ändrar state.

## 4. Integrera routing i den befintliga `App`

Ersätt `src/App.jsx` med koden nedan. Lägg märke till vad som **finns kvar** från formulärlektionen:

- `WorkshopList`, `BookingSummary` och `BookingForm` återanvänds.
- `src/data/workshops.js` är fortfarande enda datakällan.
- `category`, `booking` och `confirmedBooking` ägs fortfarande av `App`.

```jsx
import { useState } from 'react';
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
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

function HomePage({ category, onCategoryChange, onSelectSlot }) {
  const navigate = useNavigate();
  const visibleWorkshops = category === 'Alla'
    ? workshops
    : workshops.filter((workshop) => workshop.category === category);

  function handleSelectSlot(workshopId, slotId) {
    onSelectSlot(workshopId, slotId);
    navigate(`/book/${workshopId}`);
  }

  return (
    <section>
      <h1>Hitta din nästa workshop</h1>
      <p>Välj en aktivitet, ett tillfälle och boka din plats.</p>

      <div aria-label="Filtrera workshops">
        {['Alla', 'Hantverk', 'Textil', 'Foto'].map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => onCategoryChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <WorkshopList
        workshops={visibleWorkshops}
        onSelectSlot={handleSelectSlot}
      />
    </section>
  );
}

function WorkshopPage() {
  const { workshopId } = useParams();
  const workshop = workshops.find((item) => item.id === workshopId);

  if (!workshop) return <MissingWorkshop />;

  const hasOpenSlot = workshop.slots.some((slot) => slot.placesLeft > 0);

  return (
    <article>
      <p>{workshop.category}</p>
      <h1>{workshop.title}</h1>
      <p>{workshop.description}</p>
      <p>{workshop.durationMinutes} minuter · {workshop.priceSek} kr</p>

      <h2>Tillfällen</h2>
      <ul>
        {workshop.slots.map((slot) => (
          <li key={slot.id}>
            {slot.label} · {slot.placesLeft > 0
              ? `${slot.placesLeft} platser kvar`
              : 'Fullbokad'}
          </li>
        ))}
      </ul>

      {hasOpenSlot ? (
        <Link to={`/book/${workshop.id}`}>Boka {workshop.title}</Link>
      ) : (
        <p>Workshoppen är fullbokad.</p>
      )}
    </article>
  );
}

function BookPage({ booking, onBookingChange, onBooked }) {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const workshop = workshops.find((item) => item.id === workshopId);

  if (!workshop) return <MissingWorkshop />;

  const pageBooking = booking.workshopId === workshop.id
    ? booking
    : { ...booking, workshopId: workshop.id, slotId: '', participants: 1 };

  function handleBooked(nextBooking) {
    onBooked(nextBooking);
    navigate('/confirm');
  }

  return (
    <section>
      <h1>Boka {workshop.title}</h1>
      <BookingSummary booking={pageBooking} workshops={workshops} />
      <BookingForm
        workshop={workshop}
        booking={pageBooking}
        onBookingChange={onBookingChange}
        onBooked={handleBooked}
      />
    </section>
  );
}

function ConfirmPage({ booking }) {
  if (!booking) {
    return (
      <section>
        <h1>Ingen bokning att visa</h1>
        <p>Gör en bokning först, eller välj en workshop från listan.</p>
        <Link to="/">Till alla workshops</Link>
      </section>
    );
  }

  const workshop = workshops.find((item) => item.id === booking.workshopId);
  const slot = workshop && workshop.slots.find((item) => item.id === booking.slotId);

  if (!workshop || !slot) return <MissingWorkshop />;

  return (
    <section>
      <h1>Tack för din bokning, {booking.name}!</h1>
      <p>{workshop.title}</p>
      <p>{slot.label} · {booking.participants} deltagare</p>
      <p>Bekräftelsen skickas till {booking.email}.</p>
      <Link to="/">Till alla workshops</Link>
    </section>
  );
}

function MissingWorkshop() {
  return (
    <section>
      <h1>Workshoppen finns inte</h1>
      <p>Kontrollera adressen eller välj en workshop från listan.</p>
      <Link to="/">Till alla workshops</Link>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section>
      <h1>Sidan finns inte</h1>
      <p>Adressen matchar ingen av Kulturverkstans fyra vyer.</p>
      <Link to="/">Till startsidan</Link>
    </section>
  );
}

function Layout({
  category,
  onCategoryChange,
  booking,
  onBookingChange,
  confirmedBooking,
  onSelectSlot,
  onBooked,
}) {
  return (
    <>
      <header>
        <p>Kulturverkstan</p>
        <nav aria-label="Huvudmeny">
          <NavLink to="/">Workshops</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={(
              <HomePage
                category={category}
                onCategoryChange={onCategoryChange}
                onSelectSlot={onSelectSlot}
              />
            )}
          />
          <Route path="/workshops/:workshopId" element={<WorkshopPage />} />
          <Route
            path="/book/:workshopId"
            element={(
              <BookPage
                booking={booking}
                onBookingChange={onBookingChange}
                onBooked={onBooked}
              />
            )}
          />
          <Route
            path="/confirm"
            element={<ConfirmPage booking={confirmedBooking} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  const [category, setCategory] = useState('Alla');
  const [booking, setBooking] = useState(emptyBooking);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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
    <BrowserRouter>
      <Layout
        category={category}
        onCategoryChange={setCategory}
        booking={booking}
        onBookingChange={setBooking}
        confirmedBooking={confirmedBooking}
        onSelectSlot={handleSelectSlot}
        onBooked={setConfirmedBooking}
      />
    </BrowserRouter>
  );
}
```

Koden är lång eftersom alla fyra vyer visas samlat första gången. Den introducerar inte en ny app: varje vy återanvänder komponenter och state som redan fungerar. Senare kan sidkomponenterna flyttas till egna filer utan att beteendet ändras.

## 5. Kontrollera en vy i taget

| Adress | Ska visa | Tidigare kod som återanvänds |
| --- | --- | --- |
| `/` | filter och `WorkshopList` | komponent- och statelektionerna |
| `/workshops/keramik` | detalj och bokningslänk | samma workshopdata |
| `/book/keramik` | `BookingSummary` och `BookingForm` | formulärlektionen |
| `/confirm` | senaste bokningen eller ett tomläge | `confirmedBooking` |
| valfri annan adress | `NotFoundPage` | wildcard `*` |

Direkt omladdning av en route kan kräva serverinställning efter publicering. Det löser vi i hosting-lektionen.

## Se → förutsäg → kör → ändra

1. **Se:** hitta de fyra appvyerna och wildcard-routen.
2. **Förutsäg:** vad visas på `/workshops/finns-inte` respektive `/helt-fel`?
3. **Kör:** välj en tid på startsidan, fyll i formuläret och kontrollera `/confirm`.
4. **Ändra:** länka Kulturverkstans namn i sidhuvudet till `/`.
5. **Kontrollera:** data och formulärvärden ska finnas kvar när du navigerar inom appen.
6. **Förklara:** varför är `Link` rätt för navigation men en knapp rätt för att välja en tid?

## Checkpoint

Du är klar när:

- `/`, `/workshops/:workshopId`, `/book/:workshopId` och `/confirm` fungerar
- wildcard-routen visar hjälp för en okänd adress
- `WorkshopList`, filtret, bokningsstate och kapacitetsvalideringen finns kvar
- en giltig bokning navigerar till `/confirm` utan helsidesladdning

## Första hjälpen

| Problem | Kontrollera först |
| --- | --- |
| Tom sida | Läs första felet i Console och kontrollera imports. |
| `useParams` eller `useNavigate` ger fel | Körs komponenten inuti `BrowserRouter`? |
| Rätt URL men fel workshop | Jämför parametern med `workshop.id`, inte `title`. |
| Formuläret visar gammal tid | Skapar `pageBooking` ett tomt `slotId` för en annan workshop? |
| Okänd route visar tom sida | Finns `<Route path="*" element={<NotFoundPage />} />` sist? |

## Commit

```bash
git add src package.json package-lock.json
git commit -m "lägg till kulturverkstans fyra routes"
```

I nästa lektion ersätter du den lokala dataimporten med API-data, men behåller samma vyer och komponenter.
