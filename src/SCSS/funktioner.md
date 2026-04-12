# Funktioner i SCSS

SCSS-funktioner (functions) används när du vill returnera ett värde i stället för att generera hela CSS-regler. Det gör koden mer konsekvent och minskar risken för manuella fel.

## Varför funktioner?

När ett projekt växer dyker samma beräkningar upp flera gånger: px till rem, spacing-skalor och färgjusteringar. Om varje utvecklare räknar själv blir resultatet ofta inkonsekvent.

Med en funktion skriver du logiken en gång och återanvänder den överallt.

## Grundsyntax

En funktion deklareras med @function och returnerar ett värde med @return.

```scss
@function rem($px) {
  @return ($px / 16) * 1rem;
}

.title {
  font-size: rem(24);
}
```

Kompilerad CSS:

```css
.title {
  font-size: 1.5rem;
}
```

## Exempel: spacing-funktion

```scss
$space-unit: 0.25rem;

@function space($step) {
  @return $step * $space-unit;
}

.card {
  padding: space(4); // 1rem
  gap: space(2);     // 0.5rem
}
```

Detta gör det enklare att hålla ett konsekvent design system (designsystem).

## Exempel: färgfunktion med sass:color

SCSS har en inbyggd color-modul som låter dig manipulera färger automatiskt. Med `color.scale()` och parametern `$lightness` kan du göra färger ljusare eller mörkare.

Så här fungerar `$lightness`:

- **`$lightness: 10%`** – gör färgen 10% ljusare på vägen mot vitt
- **`$lightness: -10%`** – gör färgen 10% mörkare på vägen mot svart

```scss
@use 'sass:color';

@function button-hover-color($base-color) {
  @return color.scale($base-color, $lightness: -10%);
}

.button {
  background-color: #007aff;

  &:hover {
    background-color: button-hover-color(#007aff);
  }
}
```

### Skillnad mellan color.scale och darken/lighten

Det finns flera sätt att manipulera färger i SCSS:

```scss
@use 'sass:color';

$primary: #0b6bcb;

// Modern sätt – använd color.scale
color.scale($primary, $lightness: -15%)   // Gör 15% mörkare

// Äldre sätt – fortfarande vanligt
darken($primary, 15%)                     // Gör 15% mörkare
lighten($primary, 15%)                    // Gör 15% ljusare
```

**Praktiskt exempel med flera tillstånd:**

```scss
@use 'sass:color';

@function button-state-color($color, $state) {
  @if $state == 'hover' {
    @return color.scale($color, $lightness: -15%);
  } @else if $state == 'active' {
    @return color.scale($color, $lightness: -25%);
  } @else if $state == 'disabled' {
    @return color.scale($color, $lightness: 20%, $saturation: -40%);
  } @else {
    @return $color;
  }
}

.button {
  background-color: #007aff;

  &:hover {
    background-color: button-state-color(#007aff, 'hover');
  }

  &:active {
    background-color: button-state-color(#007aff, 'active');
  }

  &:disabled {
    background-color: button-state-color(#007aff, 'disabled');
  }
}
```

Med denna funktion kan du helt automatiskt beräkna rätt färger för verschiedene tillstånd – hover blir mörkare, active ännu mörkare, och disabled blir gråare och ljusare.

## Funktioner och moduler

Placera funktioner i en separat modul, till exempel abstracts/_functions.scss.

```scss
// abstracts/_functions.scss
@function rem($px) {
  @return ($px / 16) * 1rem;
}
```

```scss
// components/_card.scss
@use '../abstracts/functions' as f;

.card {
  border-radius: f.rem(8);
}
```

## Vanliga misstag

1. Blanda ihop mixin och funktion
En funktion returnerar ett värde. En mixin genererar regler.

2. Dolda enheter
Om indata är px i ett projekt och rem i ett annat blir resultatet svårt att förutsäga. Bestäm en tydlig standard.

3. Otydliga namn
Namn som calc1 eller size2 gör koden svår att förstå. Använd namn som beskriver syftet.

## Praktiskt exempel: typografisk skala

```scss
@function type-scale($level, $base: 1rem, $ratio: 1.2) {
  $result: $base;

  @for $i from 1 through $level {
    $result: $result * $ratio;
  }

  @return $result;
}

h1 { font-size: type-scale(4); }
h2 { font-size: type-scale(3); }
h3 { font-size: type-scale(2); }
```

## Säkerhet och robusthet

SCSS körs vid build (bygge), men felaktiga antaganden kan ändå ge trasig CSS i produktion. Begränsa därför indata till funktioner och undvik att bygga selektorer från okontrollerade strängar.

## Sammanfattning

- Funktioner används för återanvändbara beräkningar.
- @return skickar tillbaka ett värde till en CSS-egenskap.
- Bra funktionsnamn och tydliga enhetsregler minskar buggar.
- Funktioner passar perfekt för px till rem, spacing och färglogik.

## Se även

- [Design tokens och CSS custom properties](./design-tokens-css-custom-properties.md) – hur funktioner kan användas tillsammans med tokens
- [Mixins](./mixins.md) – skillnaden mellan funktioner och mixins
- [Mini-projekt: komponentbibliotek i SCSS](./mini-projekt-komponentbibliotek.md) – funktioner i praktiken

## Övningar

1. Skapa en funktion to-em($px, $context) som konverterar px till em.
2. Skapa en funktion radius($size) som hämtar värden från en map med nycklarna sm, md, lg.
3. Bygg en typografisk skala för h1 till h4 med en funktion och ett ratio-värde.
