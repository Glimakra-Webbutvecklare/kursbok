# API och Effects: byt datakälla utan att byta app

Kulturverkstan har fyra fungerande vyer med lokal data. Nu gör vi en enda arkitekturändring: workshopdatan hämtas från `/api/workshops` och bokningar skickas till `/api/bookings`.

`WorkshopList`, `WorkshopCard`, `BookingSummary`, `BookingForm` och alla routes finns kvar. Eftersom lista, detalj och bokning behöver samma data äger `App` fetch-state redan från början. Vi bygger alltså inte först en lokal fetch som sedan måste flyttas.

## Mål

- skilja rendering och event handlers från ett Effect
- visa loading, error, empty och success på lista, detalj och bokning
- skicka exakt sex bokningsfält med `POST` och hantera väntan och fel

## 1. Var hör koden hemma?

| Kod | Vad startar den? | Plats |
| --- | --- | --- |
| `workshops.map(...)` | React räknar ut vyn | rendering |
| skicka en bokning | användaren skickar formuläret | submit-event |
| hämta workshops | appen synkroniseras med ett API | `useEffect` |

Ett Effect används för synkronisering med något utanför React. Ett POST-anrop ska inte ligga i ett Effect när användarens submit redan anger exakt när det ska köras.

## 2. Skapa det lokala demo-API:t

Installera två låsta paket i Kulturverkstans projektmapp:

```bash
npm install json-server@0.17.4 concurrently@10.0.5
```

### `db.json`

Skapa `db.json` i projektets rot. Datan är exakt samma som tidigare låg i `src/data/workshops.js`:

```json
{
  "workshops": [
    {
      "id": "keramik",
      "title": "Keramik för nybörjare",
      "category": "Hantverk",
      "description": "Forma och dekorera en egen liten skål.",
      "durationMinutes": 120,
      "priceSek": 350,
      "slots": [
        {
          "id": "keramik-lor-10",
          "label": "Lördag 10.00–12.00",
          "placesLeft": 6
        },
        {
          "id": "keramik-ons-18",
          "label": "Onsdag 18.00–20.00",
          "placesLeft": 2
        }
      ]
    },
    {
      "id": "vavning",
      "title": "Väv din första provbit",
      "category": "Textil",
      "description": "Lär dig grunderna i färg, varp och inslag i en liten bordsvävstol.",
      "durationMinutes": 150,
      "priceSek": 425,
      "slots": [
        {
          "id": "vavning-son-13",
          "label": "Söndag 13.00–15.30",
          "placesLeft": 4
        }
      ]
    },
    {
      "id": "foto",
      "title": "Fotopromenad i byn",
      "category": "Foto",
      "description": "Öva komposition och ljus med mobilen eller en egen kamera.",
      "durationMinutes": 90,
      "priceSek": 200,
      "slots": [
        {
          "id": "foto-tor-17",
          "label": "Torsdag 17.30–19.00",
          "placesLeft": 8
        },
        {
          "id": "foto-lor-14",
          "label": "Lördag 14.00–15.30",
          "placesLeft": 0
        }
      ]
    }
  ],
  "bookings": []
}
```

### `server.cjs`

Skapa `server.cjs` i projektets rot:

```js
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);
server.use('/api', router);

server.listen(3001, () => {
  console.log('Demo-API: http://localhost:3001/api');
});
```

Backend kommer senare i kursen. Här är servern färdig kursinfrastruktur.

### `vite.config.js`

Lägg till proxyn men behåll React-pluginen:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

### `package.json`

Ersätt bara `scripts` med dessa fem scripts. Behåll övriga fält och dependencies:

```json
{
  "scripts": {
    "vite": "vite",
    "api": "node server.cjs",
    "dev": "concurrently -k -n API,VITE \"npm:api\" \"npm:vite\"",
    "build": "vite build",
    "start": "node server.cjs"
  }
}
```

Starta båda delarna:

```bash
npm run dev
```

Öppna `http://localhost:3001/api/workshops`. Fortsätt först när du ser en JSON-array med `keramik`, `vavning` och `foto`.

## 3. Samla API-anropen i `src/api.js`

Skapa filen:

```js
export async function getWorkshops(signal) {
  const response = await fetch('/api/workshops', { signal });

  if (!response.ok) {
    throw new Error(`Servern svarade med status ${response.status}.`);
  }

  return response.json();
}

export async function createBooking(booking) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });

  if (!response.ok) {
    throw new Error(`Servern svarade med status ${response.status}.`);
  }

  return response.json();
}
```

`getWorkshops` får en `signal` så att appen kan avbryta anropet när den försvinner. `createBooking` skickar bokningsobjektet i request body.

## 4. Låt formuläret invänta POST-anropet

I `BookingForm.jsx` behövs tre avgränsade ändringar. All validering från förra lektionen ska vara kvar.

Lägg till state efter `errors` och `status`:

```jsx
const [submitting, setSubmitting] = useState(false);
```

Gör `handleSubmit` asynkron och ersätt den godkända delen efter valideringen:

```jsx
async function handleSubmit(event) {
  event.preventDefault();
  const nextErrors = validate();
  setErrors(nextErrors);

  if (Object.keys(nextErrors).length > 0) {
    setStatus('Bokningen kunde inte skickas. Kontrollera fälten.');
    return;
  }

  try {
    setSubmitting(true);
    setStatus('Skickar bokningen…');
    await onBooked(booking);
    setStatus('Bokningen är klar.');
  } catch (error) {
    setStatus('Bokningen kunde inte skickas. Försök igen.');
  } finally {
    setSubmitting(false);
  }
}
```

Ersätt submitknappen och behåll statusraden:

```jsx
<button type="submit" disabled={submitting}>
  {submitting ? 'Skickar…' : 'Bekräfta bokning'}
</button>
<p aria-live="polite">{status}</p>
```

Formuläret vet inte hur API:t fungerar. Det väntar bara på funktionen i `onBooked`. Därför kan samma formulär fortsätta återanvändas.

## 5. Komplett slutsteg: lyft fetch-state till `App`

Nu ersätter du `src/App.jsx` med den kompletta versionen nedan. Det är den enda stora filen som ändras i slutsteget.

Skillnader från routing-lektionen:

- importen från `./data/workshops.js` är borta,
- `App` äger `workshops`, `status`, `errorMessage` och Effectet,
- alla tre datavyer får samma props,
- varje datavy hanterar loading, error, empty och success innan den använder datan,
- `handleBooked` skickar POST och sparar samma bekräftade bokningsobjekt.

```jsx
import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { createBooking, getWorkshops } from './api.js';
import BookingForm from './components/BookingForm.jsx';
import BookingSummary from './components/BookingSummary.jsx';
import WorkshopList from './components/WorkshopList.jsx';

const emptyBooking = {
  workshopId: '',
  slotId: '',
  name: '',
  email: '',
  participants: 1,
  message: '',
};

function ErrorNotice({ message, onRetry }) {
  return (
    <section role="alert">
      <h1>Något gick fel</h1>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>Försök igen</button>
    </section>
  );
}

function HomePage({
  workshops,
  status,
  errorMessage,
  onRetry,
  category,
  onCategoryChange,
  onSelectSlot,
}) {
  const navigate = useNavigate();

  if (status === 'loading') return <p aria-live="polite">Laddar workshops…</p>;
  if (status === 'error') {
    return <ErrorNotice message={errorMessage} onRetry={onRetry} />;
  }
  if (workshops.length === 0) {
    return <p>Det finns inga workshops just nu.</p>;
  }

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

      {visibleWorkshops.length === 0 ? (
        <p>Inga workshops matchar filtret.</p>
      ) : (
        <WorkshopList
          workshops={visibleWorkshops}
          onSelectSlot={handleSelectSlot}
        />
      )}
    </section>
  );
}

function WorkshopPage({ workshops, status, errorMessage, onRetry }) {
  const { workshopId } = useParams();

  if (status === 'loading') return <p aria-live="polite">Laddar workshop…</p>;
  if (status === 'error') {
    return <ErrorNotice message={errorMessage} onRetry={onRetry} />;
  }
  if (workshops.length === 0) {
    return <p>Det finns inga workshops att visa.</p>;
  }

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

function BookPage({
  workshops,
  status,
  errorMessage,
  onRetry,
  booking,
  onBookingChange,
  onBooked,
}) {
  const { workshopId } = useParams();
  const navigate = useNavigate();

  if (status === 'loading') return <p aria-live="polite">Laddar bokning…</p>;
  if (status === 'error') {
    return <ErrorNotice message={errorMessage} onRetry={onRetry} />;
  }
  if (workshops.length === 0) {
    return <p>Det finns inga workshops att boka.</p>;
  }

  const workshop = workshops.find((item) => item.id === workshopId);
  if (!workshop) return <MissingWorkshop />;

  const pageBooking = booking.workshopId === workshop.id
    ? booking
    : { ...booking, workshopId: workshop.id, slotId: '', participants: 1 };

  async function handleBooked(nextBooking) {
    await onBooked(nextBooking);
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

function ConfirmPage({ booking, workshops }) {
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

  if (!workshop || !slot) {
    return <p>Bokningen är sparad, men workshopinformationen kunde inte visas.</p>;
  }

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
      <Link to="/">Till alla workshops</Link>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section>
      <h1>Sidan finns inte</h1>
      <Link to="/">Till startsidan</Link>
    </section>
  );
}

function Layout(props) {
  return (
    <>
      <header>
        <NavLink to="/">Kulturverkstan</NavLink>
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
                workshops={props.workshops}
                status={props.status}
                errorMessage={props.errorMessage}
                onRetry={props.onRetry}
                category={props.category}
                onCategoryChange={props.onCategoryChange}
                onSelectSlot={props.onSelectSlot}
              />
            )}
          />
          <Route
            path="/workshops/:workshopId"
            element={(
              <WorkshopPage
                workshops={props.workshops}
                status={props.status}
                errorMessage={props.errorMessage}
                onRetry={props.onRetry}
              />
            )}
          />
          <Route
            path="/book/:workshopId"
            element={(
              <BookPage
                workshops={props.workshops}
                status={props.status}
                errorMessage={props.errorMessage}
                onRetry={props.onRetry}
                booking={props.booking}
                onBookingChange={props.onBookingChange}
                onBooked={props.onBooked}
              />
            )}
          />
          <Route
            path="/confirm"
            element={(
              <ConfirmPage
                booking={props.confirmedBooking}
                workshops={props.workshops}
              />
            )}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  const [workshops, setWorkshops] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [category, setCategory] = useState('Alla');
  const [booking, setBooking] = useState(emptyBooking);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkshops() {
      setStatus('loading');
      setErrorMessage('');
      setWorkshops([]);

      try {
        const data = await getWorkshops(controller.signal);
        setWorkshops(data);
        setStatus('success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage('Workshops kunde inte hämtas. Försök igen.');
          setStatus('error');
        }
      }
    }

    loadWorkshops();
    return () => controller.abort();
  }, [reloadCount]);

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

  async function handleBooked(nextBooking) {
    await createBooking(nextBooking);
    setConfirmedBooking(nextBooking);
  }

  return (
    <BrowserRouter>
      <Layout
        workshops={workshops}
        status={status}
        errorMessage={errorMessage}
        onRetry={() => setReloadCount((count) => count + 1)}
        category={category}
        onCategoryChange={setCategory}
        booking={booking}
        onBookingChange={setBooking}
        confirmedBooking={confirmedBooking}
        onSelectSlot={handleSelectSlot}
        onBooked={handleBooked}
      />
    </BrowserRouter>
  );
}
```

`WorkshopList` ska fortfarande bara ta emot `workshops` och `onSelectSlot` som props. Lägg inte `useEffect` där. Om datan hämtades i listan skulle detalj- och bokningsvyn behöva göra samma anrop eller få datan på en omväg.

När appen fungerar från API:t används inte längre `src/data/workshops.js`. Behåll filen under lektionen som en trygg jämförelse och ta bort importen; du kan radera filen senare när API-checkpointen är godkänd.

## 6. Testa alla lägen, vy för vy

| Läge | Lista `/` | Detalj `/workshops/keramik` | Bokning `/book/keramik` |
| --- | --- | --- | --- |
| loading | “Laddar workshops…” | “Laddar workshop…” | “Laddar bokning…” |
| error | stoppa API:t och använd Försök igen | samma felruta | samma felruta |
| empty | sätt `workshops` till `[]` i `db.json` | inget innehåll att visa | inget innehåll att boka |
| success | tre kort | keramikdetaljen | formuläret |

Återställ alltid `db.json` och starta om API:t efter empty-testet.

Kontrollera POST i Network-fliken. Request body ska innehålla exakt:

```text
workshopId, slotId, name, email, participants, message
```

`json-server` lägger till ett `id` i **svaret**, men request body från formuläret har de sex beslutade fälten.

## Se → förutsäg → kör → ändra

1. **Se:** markera rendering, submit-event och Effect i slutkoden.
2. **Förutsäg:** vilket tidigt `return` används när API:t ger `[]`?
3. **Kör:** testa tabellens tolv kombinationer och titta i Network.
4. **Ändra:** gör GET-adressen fel, kontrollera error och återställ.
5. **Kontrollera:** dubbelklick ska inte ge två POST eftersom knappen låses.
6. **Förklara:** varför äger `App` GET-state men formulärets submit-event startar POST?

## Checkpoint

Du är klar när:

- samma tre workshops visas från `/api/workshops` utan lokal dataimport
- loading, error, empty och success fungerar på lista, detalj och bokning
- Försök igen startar ett nytt GET-anrop
- giltig submit skickar sex fält, väntar på svaret och går till `/confirm`
- felaktig submit eller misslyckad POST stannar på formuläret med begriplig status

## Första hjälpen

| Problem | Kontrollera först |
| --- | --- |
| `Unexpected token <` | Gav URL:en HTML i stället för JSON? Titta i Network. |
| 404 på `/api/workshops` | Kör både API och Vite via `npm run dev`. |
| `map is not a function` | Är API-svaret arrayen från `/api/workshops`? |
| GET kör om och om igen | Har Effectet bara `[reloadCount]` som beroende? |
| CORS-fel | Finns Vite-proxyn och används den relativa adressen `/api`? |
| POST lyckas men ingen navigation sker | Returnerar och inväntar `handleBooked` Promise-kedjan? |
| För många deltagare kan skickas | Använder formuläret vald slots `placesLeft` i både `max` och `validate`? |

## Commit

```bash
git add src db.json server.cjs vite.config.js package.json package-lock.json
git commit -m "koppla kulturverkstan till api"
```
