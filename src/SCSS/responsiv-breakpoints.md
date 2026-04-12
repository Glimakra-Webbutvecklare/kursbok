# Responsiv SCSS med breakpoints

Responsiv design betyder att layouten anpassar sig till olika skärmstorlekar. I SCSS kan du strukturera detta med maps och mixins för att undvika upprepning.

## Mobile first

Mobile first (mobil först) innebär att du skriver grundstilar för små skärmar först och sedan lägger till regler för större skärmar med min-width.

```scss
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Breakpoints i en map

```scss
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
);
```

## Mixin för media query

```scss
@use 'sass:map';

$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
);

@mixin up($size) {
  $value: map.get($breakpoints, $size);

  @media (min-width: $value) {
    @content;
  }
}
```

Användning:

```scss
.container {
  padding: 1rem;

  @include up(md) {
    padding: 2rem;
  }

  @include up(lg) {
    max-width: 1100px;
    margin-inline: auto;
  }
}
```

## Struktur i 7-1

Placera breakpoint-map och mixin i abstracts.

- abstracts/_variables.scss för breakpoint-värden
- abstracts/_mixins.scss för up()-mixin

Då får alla komponenter samma responsiva regler.

## Exempel: responsiv navigation

```scss
.nav {
  display: none;
}

.menu-toggle {
  display: inline-flex;
}

@include up(md) {
  .nav {
    display: flex;
    gap: 1rem;
  }

  .menu-toggle {
    display: none;
  }
}
```

## Vanliga misstag

1. Blanda många godtyckliga breakpoint-värden i olika filer.
2. Skriva desktop first och mobile first samtidigt utan plan.
3. Duplicera samma media query i varje komponent i stället för att standardisera.

## Tillgänglighet och robusthet

Responsiv design handlar också om läsbarhet. Kontrollera radlängd, textstorlek och klickytor på små skärmar så att sidan fungerar för fler användare.

## Sammanfattning

- Mobile first ger en stabil grund.
- Maps och mixins gör breakpoints konsekventa.
- Samma breakpoint-system i hela projektet minskar buggar.
- Responsiv kod ska vara både tekniskt och visuellt hållbar.

## Se även

- [Mixins](./mixins.md) – breakpoint-mixins med @content
- [Design tokens och CSS custom properties](./design-tokens-css-custom-properties.md) – responsive design tokens
- [Nesting och selektorstrategi](./nesting-selektorstrategi.md) – media queries i nesting

## Övningar

1. Skapa en responsive card-grid med 1, 2 och 3 kolumner för olika breakpoints.
2. Bygg en meny som växlar mellan hamburger och horisontell navigation.
3. Flytta alla media queries till ett enhetligt mixin-system.
