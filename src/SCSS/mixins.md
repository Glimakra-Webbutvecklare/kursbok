# Mixins i SCSS

Precis som variabler låter oss återanvända *värden*, låter **mixins** oss återanvända hela *CSS-regler*. Om du märker att du skriver samma uppsättning CSS-deklarationer om och om igen – till exempel för flexbox-centrering eller mediafrågor – är det ett tecken på att ett mixin kan förenkla koden.

## Vad är ett Mixin?

Ett **mixin** är ett namngivet block av CSS-regler som kan inkluderas var som helst i din SCSS-kod. Tänk på det som en funktion som istället för att returnera ett värde "klistrar in" ett kodblock.

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

Inkludera mixinet med `@include`:

```scss
.hero {
  @include flex-center;
  height: 100vh;
}

.modal {
  @include flex-center;
}
```

Det kompileras till:

```css
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Mixins med parametrar

Mixins blir riktigt kraftfulla när de tar **parametrar** (parameters) – argument som styr vad mixinet genererar. Parametrar deklareras med `$`-tecken, precis som vanliga variabler.

```scss
@mixin flex($justify-content: center, $align-items: center) {
  display: flex;
  justify-content: $justify-content;
  align-items: $align-items;
}

.header {
  @include flex(space-between, center);
}

.card-grid {
  @include flex(flex-start, stretch);
}

.hero {
  @include flex; // Använder standardvärden: center, center
}
```

Värdet efter `:` är ett **standardvärde** (default value). Om du inte skickar in ett argument används standardvärdet automatiskt.

### Namngivna argument

Du kan skicka in argument med namn för att göra anrop tydligare och kunna hoppa över argument du inte vill ändra:

```scss
.footer {
  @include flex($justify-content: space-between);
  // $align-items får sitt standardvärde: center
}
```

## Praktiska exempel

### Breakpoint-mixin

Mediafrågor (media queries) är ett vanligt tillfälle för mixins. Istället för att skriva `@media (min-width: 768px)` varje gång skapar vi ett mixin:

```scss
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
);

@use 'sass:map';

@mixin breakpoint($size) {
  $value: map.get($breakpoints, $size);
  @media (min-width: $value) {
    @content;
  }
}
```

`@content` är en platshållare (placeholder) för allt du skriver inuti `@include`-blocket – ungefär som `children` i React. Användningen ser ut så här:

```scss
.container {
  padding: 1rem;

  @include breakpoint(md) {
    padding: 2rem;
    max-width: 960px;
    margin: 0 auto;
  }
}
```

Det kompileras till:

```css
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 960px;
    margin: 0 auto;
  }
}
```

### Knappstilar med tema

```scss
@mixin button-variant($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  @include button-variant(#007aff);
}

.btn-danger {
  @include button-variant(#f44336);
}

.btn-light {
  @include button-variant(#f8f9fa, #333);
}
```

### Trunkering av text

```scss
@mixin truncate($max-width: 100%) {
  max-width: $max-width;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title {
  @include truncate(200px);
}

.nav-link {
  @include truncate;
}
```

## Mixin vs `@extend`

SCSS erbjuder också `@extend` som ett sätt att dela stilar mellan selektorer. Det är lätt att blanda ihop dessa – här är skillnaden:

| | `@mixin` + `@include` | `@extend` |
|---|---|---|
| Kan ta parametrar | Ja | Nej |
| Kopierar CSS-regler | Ja (duplicerar output) | Nej (grupperar selektorer) |
| Flexibel | Hög | Låg |
| Rekommenderas | Ja, i de flesta fall | Sällan |

```scss
// Med @extend – selektorer grupperas
%button-base {
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.btn-primary {
  @extend %button-base;
  background: blue;
}

.btn-danger {
  @extend %button-base;
  background: red;
}

// Kompileras till:
// .btn-primary, .btn-danger { padding: 0.5rem 1rem; border-radius: 4px; }
// .btn-primary { background: blue; }
// .btn-danger  { background: red; }
```

`@extend` kan orsaka oväntade sidoeffekter i komplexa projekt. Som tumregel: **använd mixins**.

## Mixin vs funktion

Mixins och SCSS-funktioner kan verka lika – båda tar parametrar och är återanvändbara. Skillnaden är:

- En **funktion** *returnerar ett värde*: `font-size: rem(24)`
- Ett **mixin** *genererar CSS-regler*: `@include flex-center`

```scss
// Funktion – returnerar ett värde
@function rem($px) {
  @return $px / 16 * 1rem;
}

.title {
  font-size: rem(24); // 1.5rem
}

// Mixin – genererar regler
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.screen-reader-text {
  @include visually-hidden;
}
```

## Sammanfattning

- Mixins definieras med `@mixin namn { }` och inkluderas med `@include namn`.
- Parametrar med standardvärden gör mixins flexibla och återanvändbara.
- `@content` gör att mixins kan ta in ett block – perfekt för mediafrågor och liknande mönster.
- Mixins är oftast att föredra framför `@extend` tack vare sin flexibilitet.
- Använd mixins för regler, funktioner för beräknade värden.
