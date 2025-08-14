# Routing: skydd och data

Varför behövs detta?
- Autentisering/auktorisering: vissa sidor ska bara vara tillgängliga för inloggade användare/roller.
- Data‑först: ladda data innan en sida renderas, eller hantera fel centralt.
- Bättre UX: behåll kontext, redirecta smart, och visa vänliga fel.

## Skyddade routes (Protected routes)

När? När du har sidor som kräver inloggning eller specifik roll.

Grundidé: en wrapper som kontrollerar status och annars navigerar bort.

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Laddar…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/unauthorized" replace />;

  return children;
}
```

Varför fungerar det? React Router v6 låter element vara vilken komponent som helst. Vi returnerar Navigate för att byta sida om villkor inte uppfylls.

## Data‑laddning och fel (v6.4+ loaders)

När? När sidan behöver data innan den renderas (SEO/UX eller undvika blink).

Koncept: definiera en `loader` som hämtar data. Komponenten läser med `useLoaderData()`.

```jsx
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';

async function productLoader({ params }) {
  const res = await fetch(`/api/products/${params.id}`);
  if (!res.ok) throw new Response('Not found', { status: 404 });
  return res.json();
}

function ProductDetail() {
  const product = useLoaderData();
  return <h1>{product.name}</h1>;
}

const router = createBrowserRouter([
  { path: '/products/:id', element: <ProductDetail />, loader: productLoader, errorElement: <div>Fel vid laddning</div> }
]);

export default function App() { return <RouterProvider router={router} />; }
```

Varför? Loader körs innan render — du får data/404 tidigt och kan visa rätt vy utan extra “loading” när data redan finns.

## Felhantering för routes

Error boundaries per route fångar renderingsfel och visar fallback. Det förbättrar robusthet och UX.

När? I större appar eller när sidor har sköra beroenden.

## Tips och trade‑offs
- Skydd i klienten räcker inte för säkerhet — backend måste alltid verifiera.
- Loaders förenklar dataflödet men låser in dig i Router‑pipen; använd där det passar.
- Central 404/unauthorized förbättrar navigationsflödet.
