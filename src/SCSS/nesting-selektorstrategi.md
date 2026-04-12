# Nesting och selektorstrategi

Nesting i SCSS gör att du kan skriva selektorer hierarkiskt. Det kan öka läsbarheten, men för djup nesting leder snabbt till tung och svårunderhållen CSS.

## Motivation

I små komponenter är nesting tydligt. I större kodbaser kan fyra till fem nivåer nesting skapa långa selektorkedjor som blir svåra att återanvända och felsöka.

Målet är att använda nesting medvetet, inte automatiskt.

## Bra nesting

```scss
.card {
  padding: 1rem;

  &__title {
    font-size: 1.25rem;
  }

  &:hover {
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
  }
}
```

Exemplet håller sig nära en komponent (component) och använder parent selector (föräldraselektor) med &.

**HTML som motsvarar denna SCSS:**

```html
<div class="card">
  <h2 class="card__title">Min kortkomponent</h2>
  <p>Innehål här...</p>
</div>
```

När du hovrar över `.card`, gäller `:hover` och skuggan visas. Titeln får sin storlek från `.card__title`.

## Problem med för djup nesting

```scss
.page {
  .content {
    .article {
      .card {
        .title {
          color: #222;
        }
      }
    }
  }
}
```

Det kompileras till: `.page .content .article .card .title { color: #222; }`

En mycket specifik selektor, vilket gör det svårt att skriva över stilar senare.

**HTML som motsvarar denna SCSS:**

```html
<div class="page">
  <div class="content">
    <article class="article">
      <div class="card">
        <h3 class="title">Rubrik</h3>
      </div>
    </article>
  </div>
</div>
```

Problemet: om du senare vill att `.title` ska ha en annan färg måste din nya selektor vara minst lika specifik, annars fungerar den inte.

## Rekommendationer

1. Håll nesting till max 2 till 3 nivåer.
2. Nesting passar bäst för pseudo-klasser och tillstånd.
3. Använd tydliga klassnamn i stället för långa beroendekedjor.
4. Kombinera gärna med BEM (Block Element Modifier).

## Parent selector med &

```scss
.button {
  background: #007aff;

  &:hover {
    background: #0069d9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--danger {
    background: #d92d20;
  }
}
```

**HTML som motsvarar denna SCSS:**

```html
<!-- Vanlig knapp -->
<button class="button">Klicka här</button>

<!-- Deaktiverad knapp -->
<button class="button" disabled>Deaktiverad</button>

<!-- Danger-variant -->
<button class="button button--danger">Ta bort</button>
```

Här ser du hur `&` expanderas:
- `&:hover` blir `.button:hover`
- `&:disabled` blir `.button:disabled`
- `&--danger` blir `.button--danger`

## Nesting med media query

```scss
.card {
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
}
```

Detta kan vara tydligt i komponentfiler, men undvik att sprida stora layoutbeslut i många filer utan plan.

**HTML:**

```html
<div class="card">
  <h3>Min kort</h3>
  <p>På små skärmar: 1rem padding</p>
  <p>På stora skärmar (768px+): 1.5rem padding</p>
</div>
```

Nesting med media queries gör att du kan se mobil och desktop tillsammans i samma kod-block, vilket kan vara praktiskt för komponenter som är små.

## Jämförelse: dålig och bättre struktur

Dålig struktur:

```scss
.main {
  .sidebar {
    .menu {
      li {
        a {
          color: #333;
        }
      }
    }
  }
}
```

Bättre struktur:

```scss
.sidebar-menu-link {
  color: #333;
}
```

Den bättre strukturen ger lägre specificitet och enklare återanvändning.

## Säkerhet och robusthet

Hög specificitet är inte en säkerhetsrisk i sig, men den ökar risken för oavsiktliga visuella fel. I gränssnitt för inloggning, betalning eller varningar kan sådana fel påverka användarens beslut.

## Sammanfattning

- Nesting förbättrar läsbarhet när den hålls kort och lokal.
- För djup nesting skapar svåröverskådlig CSS med hög specificitet.
- Använd & för tillstånd och varianter.
- Prioritera komponentbaserade klassnamn över djupa hierarkier.

## Se även

- [Mixins](./mixins.md) – ofta används tillsammans med nesting
- [7-1 Struktur med importer](./sju-ett-struktur.md) – hur man organiserar nesting i större projekt
- [Tillgänglighet i SCSS](./tillganglighet.md) – fokusstilar ofta kombineras med nesting

## Övningar

1. Refaktorera en djup nestad meny till max tre nivåer nesting.
2. Skapa en knappkomponent med modifierare för primary, secondary och danger.
3. Jämför kompilerad CSS före och efter refaktorering och beskriv skillnaden.
