# Komponenter: Återanvändbara UI-byggstenar

Komponenter låter dig dela upp UI:t i oberoende, återanvändbara delar och tänka på varje del isolerat. Den här sidan ger en introduktion till idén om komponenter.

**Mål:** Lära dig skapa, organisera och återanvända komponenter för att bygga skalbar React-kod.

## Definiera en Komponent

React-komponenter är JavaScript-funktioner som returnerar markup:

```jsx
function MyButton() {
  return (
    <button>Jag är en knapp</button>
  );
}
```

Nu när du har deklarerat `MyButton` kan du nästla den i en annan komponent:

```jsx
function MyApp() {
  return (
    <div>
      <h1>Välkommen till min app</h1>
      <MyButton />
    </div>
  );
}
```

Observera att `<MyButton />` börjar med stor bokstav. Så här vet du att det är en React-komponent. React-komponentnamn måste alltid börja med stor bokstav, medan HTML-taggar måste vara små bokstäver.

## Komponenter inom komponenter

Komponenter är vanliga JavaScript-funktioner, så du kan hålla flera komponenter i samma fil:

```jsx
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

function Profile() {
  return (
    <div>
      <Avatar />
      <Avatar />
      <Avatar />
    </div>
  );
}
```

I detta exempel har `Profile`-komponenten tre `Avatar`-komponenter.

## Funktionella Komponenter: Det Moderna Sättet

Sedan React 16.8 och introduktionen av **Hooks** är funktionella komponenter standardsättet att skriva React-kod.

### Grundläggande Komponent

```jsx
// Enkel funktionell komponent
function Greeting() {
  return <h1>Hej världen!</h1>;
}

// Arrow function syntax (också vanlig)
const Greeting = () => {
  return <h1>Hej världen!</h1>;
};

// Kort syntax för enkel return
const Greeting = () => <h1>Hej världen!</h1>;
```

### Komponent med Logik

```jsx
function UserProfile() {
  const user = {
    name: "Anna Andersson",
    age: 28,
    email: "anna@example.com",
    avatar: "/images/anna.jpg"
  };

  const isAdult = user.age >= 18;

  return (
    <div className="user-profile">
      <img src={user.avatar} alt={`${user.name}s avatar`} />
      <h2>{user.name}</h2>
      <p>Ålder: {user.age} {isAdult && "✅ Myndig"}</p>
      <p>E-post: {user.email}</p>
    </div>
  );
}
```

## Exportera och Importera Komponenter

Magin med komponenter ligger i deras återanvändbarhet: du kan skapa komponenter som består av andra komponenter. Men när du nästlar fler och fler komponenter är det ofta vettigt att börja dela upp dem i olika filer. Detta låter dig hålla dina filer lätta att skanna och återanvända komponenter på fler ställen.

```jsx
// Gallery.js
import Profile from './Profile.js';

function Gallery() {
  return (
    <section>
      <h1>Fantastiska forskare</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}

export default Gallery;
```

```jsx
// Profile.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default Profile;
```

```jsx
// App.js
import Gallery from './Gallery.js';

function App() {
  return (
    <Gallery />
  );
}

export default App;
```

## Komponentens Anatomi

En React-komponent består av några viktiga delar:

```jsx
// 1. Import-statements (om du använder andra komponenter)
import { useState } from 'react';
import './Button.css';

// 2. Komponentfunktionen
function Button() {
  // 3. Logik (variabler, funktioner)
  const handleClick = () => {
    alert('Knappen klickades!');
  };
  
  // 4. Return-statement med JSX
  return (
    <button onClick={handleClick}>
      Klicka mig
    </button>
  );
}

// 5. Export-statement
export default Button;
```

## Klasskomponenter: Det Äldre Sättet

Före hooks använde React klasskomponenter för att hantera state och lifecycle. Du kommer fortfarande stöta på dem i äldre kodbaser.

```jsx
import React, { Component } from 'react';

class ClassCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  // Lifecycle-metod
  componentDidMount() {
    console.log('Component har monterats');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log(`Count ändrades från ${prevState.count} till ${this.state.count}`);
    }
  }

  componentWillUnmount() {
    console.log('Component kommer att avmonteras');
  }

  // Event handler
  incrementCount = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <h2>Räknare: {this.state.count}</h2>
        <button onClick={this.incrementCount}>
          Öka
        </button>
      </div>
    );
  }
}
```

## Organisera Komponenter

När din app växer är det viktigt att organisera komponenter på ett smart sätt:

### Fil-per-komponent (Rekommenderat)

```
src/
  components/
    Button/
      Button.jsx
      Button.css
      Button.test.js
    Avatar/
      Avatar.jsx
      Avatar.css
    Card/
      Card.jsx
      Card.css
  pages/
    Home.jsx
    About.jsx
  App.jsx
```

### Flera komponenter per fil (För små, relaterade komponenter)

```jsx
// components/UI.jsx
export function Button({ children, onClick, type = "button" }) {
  return (
    <button type={type} onClick={onClick} className="btn">
      {children}
    </button>
  );
}

export function Input({ placeholder, value, onChange }) {
  return (
    <input 
      className="input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
```

## Komponent-komposition

En av Reacts starkaste funktioner är **komposition** - att bygga komplexa komponenter från enklare komponenter:

```jsx
function WelcomeMessage({ name }) {
  return <h1>Hej {name}!</h1>;
}

function UserAvatar({ imageUrl, name }) {
  return (
    <img 
      src={imageUrl} 
      alt={name}
      className="avatar" 
    />
  );
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <UserAvatar imageUrl={user.avatar} name={user.name} />
      <WelcomeMessage name={user.name} />
      <p>E-post: {user.email}</p>
    </div>
  );
}

// Användning
function App() {
  const user = {
    name: "Anna Andersson",
    email: "anna@example.com", 
    avatar: "/anna.jpg"
  };

  return <UserCard user={user} />;
}
```

## Best Practices för Komponenter

### 1. Håll Komponenter Små och Fokuserade

```jsx
// ❌ För stor komponent
function BlogPost({ post, user, comments, relatedPosts }) {
  return (
    <article>
      {/* Hundratals rader kod... */}
    </article>
  );
}

// ✅ Uppdelade komponenter
function BlogPost({ post }) {
  return (
    <article>
      <BlogHeader post={post} />
      <BlogContent content={post.content} />
      <BlogFooter postId={post.id} />
    </article>
  );
}

function BlogHeader({ post }) {
  return (
    <header>
      <h1>{post.title}</h1>
      <AuthorInfo author={post.author} />
      <PublishDate date={post.publishedAt} />
    </header>
  );
}
```

### 2. Använda PropTypes för Typkontroll (Optional)
PropTypes är ett verktyg för typkontroll i React som hjälper dig att:

1. **Hitta buggar tidigt:** Genom att validera props under utveckling upptäcks fel direkt istället för att de dyker upp i produktion.

2. **Dokumentera komponenter:** PropTypes fungerar som självdokumenterande kod - andra utvecklare kan snabbt se vilka props en komponent förväntar sig.

3. **Förbättra underhållbarhet:** När du ändrar en komponent varnar PropTypes om du råkar skicka fel datatyp eller glömmer en required prop.

4. **Underlätta refaktorering:** Med tydliga kontrakt mellan komponenter blir det säkrare att göra större kodändringar.

Exempel på vanliga PropTypes:


```jsx
import PropTypes from 'prop-types';

function ProductCard({ name, price, image, onSale }) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className={onSale ? "sale-price" : "regular-price"}>
        {price} kr
      </p>
    </div>
  );
}

ProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  onSale: PropTypes.bool
};

ProductCard.defaultProps = {
  onSale: false
};
```

Ett vanligt alternativ till PropTypes är TypeScript som erbjuder statisk typkontroll under kompilering och ger bättre IDE-stöd med autocompletions och refaktoreringsmöjligheter. TypeScript är särskilt användbart i större projekt där PropTypes kan bli otillräckligt.

### 3. Komponentnamnskonventioner

```jsx
// ✅ PascalCase för komponenter
function UserProfile() { }
function ProductCard() { }
function NavigationMenu() { }

// ✅ camelCase för funktioner och variabler
const handleClick = () => { };
const userName = "Anna";
const isLoading = true;

// ✅ Beskrivande namn
function LoadingSpinner() { }  // Bättre än Spinner()
function ErrorMessage() { }   // Bättre än Error()
```

## Sammanfattning

Komponenter är byggstenen i React-applikationer:

*   **Komponenter** är JavaScript-funktioner som returnerar JSX
*   **Komponentnamn** måste börja med stor bokstav
*   **Import/Export** låter dig organisera komponenter i separata filer
*   **Komposition** bygger komplexa UI från enkla komponenter
*   **Håll komponenter små** och fokuserade på en sak

## Vad händer härnäst?

Nu när du kan skapa komponenter är det dags att göra dem interaktiva! I nästa avsnitt lär du dig:

* **Props** - skicka data mellan komponenter
* **State** - ge komponenter minne
* **Events** - reagera på användarinteraktion

Gå vidare till **State och Props** för att lära dig hur du gör dina komponenter levande!
