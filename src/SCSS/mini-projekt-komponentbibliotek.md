# Mini-projekt: komponentbibliotek i SCSS

I den här lektionen bygger du ett litet komponentbibliotek med samma principer som i tidigare kapitel: tokens, mixins, moduler, responsiv design och tillgänglighet.

## Mål

Efter övningen ska du kunna:

1. Strukturera SCSS med moduler.
2. Skapa återanvändbara komponenter.
3. Bygga light och dark theme.
4. Säkerställa grundläggande tillgänglighet.

## Föreslagen struktur

```text
SCSS/
  abstracts/
    _variables.scss
    _functions.scss
    _mixins.scss
    _index.scss
  components/
    _button.scss
    _card.scss
    _input.scss
  themes/
    _theme-light.scss
    _theme-dark.scss
  main.scss
```

## Steg 1: Tokens

```scss
// abstracts/_variables.scss
$radius-md: 0.5rem;
$space-md: 1rem;
$space-lg: 1.5rem;
```

```scss
// themes/_theme-light.scss
:root {
  --color-bg: #ffffff;
  --color-surface: #f6f8fa;
  --color-text: #1f2328;
  --color-primary: #0b6bcb;
}
```

```scss
// themes/_theme-dark.scss
[data-theme='dark'] {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-text: #e6edf3;
  --color-primary: #58a6ff;
}
```

## Steg 2: Mixins

```scss
// abstracts/_mixins.scss
@mixin focus-ring {
  &:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
  }
}
```

## Steg 3: Komponenter

```scss
// components/_button.scss
@use '../abstracts' as a;

.button {
  border: 0;
  border-radius: a.$radius-md;
  padding: 0.625rem 1rem;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;

  @include a.focus-ring;
}
```

```scss
// components/_card.scss
@use '../abstracts' as a;

.card {
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: a.$radius-md;
  padding: a.$space-lg;
}
```

```scss
// components/_input.scss
@use '../abstracts' as a;

.input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d0d7de;
  border-radius: a.$radius-md;
  background: var(--color-bg);
  color: var(--color-text);

  @include a.focus-ring;
}
```

## Steg 4: main.scss

```scss
@use 'abstracts';
@use 'themes/theme-light';
@use 'themes/theme-dark';
@use 'components/button';
@use 'components/card';
@use 'components/input';
```

## Steg 5: Responsiv förbättring

Lägg till en enkel breakpoint-mixin och öka spacing i kort på större skärmar.

## Steg 6: Testa kvalitet

Kontrollera:

1. Fungerar komponenterna i båda teman?
2. Syns fokus tydligt vid tangentbordsnavigering?
3. Är kontrasten tillräcklig för text och knappar?
4. Ser layouten bra ut på mobil och desktop?

## Utmaning

Bygg även en badge-komponent med tre varianter: info, success och danger. Använd tokens och loop för att undvika duplicerad kod.

## Sammanfattning

Detta mini-projekt samlar hela SCSS-spåret i en praktisk leverans. Samma arbetssätt går att använda i större frontend-projekt med flera utvecklare.

## Se även – alla tidigare SCSS-kapitel

- [Variabler och Maps](./variabler-maps.md) – tokens i abstracts/
- [Funktioner i SCSS](./funktioner.md) – för beräkningar i komponenter
- [Mixins](./mixins.md) – återanvändbar logik
- [Nesting och selektorstrategi](./nesting-selektorstrategi.md) – komponentstil
- [7-1 Struktur med importer](./sju-ett-struktur.md) – mapporganisation
- [Moduler med @use och @forward](./moduler-use-forward.md) – moderna imports
- [Design tokens och CSS custom properties](./design-tokens-css-custom-properties.md) – token-system
- [Theming: ljust och mörkt tema](./theming.md) – multi-tema-stöd
- [Loopar i praktiken och utility-klasser](./loopar-utility-klasser.md) – utility-klasser
- [Tillgänglighet i SCSS](./tillganglighet.md) – WCAG-compliance

Detta projekt samlar all kunskap från SCSS-spåret.

## Övningar

1. Lägg till en modal-komponent med fokusstil och tema-stöd.
2. Skapa utility-klasser för spacing som komplement till komponenterna.
3. Dokumentera komponenterna med exempel på användning i HTML.
