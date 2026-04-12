# Design tokens och CSS custom properties

Design tokens är namngivna värden för till exempel färg, spacing och typografi. Tanken är att beskriva designbeslut en gång och återanvända dem konsekvent i hela projektet.

## Varför kombinera SCSS och CSS-variabler?

SCSS-variabler används vid kompilering. CSS custom properties (anpassade egenskaper) lever kvar i webbläsaren.

Det betyder att du kan:

1. Använda SCSS för struktur och logik i build.
2. Använda CSS custom properties för runtime (körtid), till exempel tema-byte.

## Exempel på tokens i SCSS

```scss
$color-brand-500: #0b6bcb;
$color-surface-100: #f7f9fc;
$space-md: 1rem;
$radius-md: 0.5rem;
```

## Exportera tokens till CSS custom properties

```scss
:root {
  --color-brand-500: #0b6bcb;
  --color-surface-100: #f7f9fc;
  --space-md: 1rem;
  --radius-md: 0.5rem;
}
```

## Användning i komponenter

```scss
.card {
  background: var(--color-surface-100);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.button {
  background: var(--color-brand-500);
  color: #fff;
}
```

## Tema med data-attribut

```scss
:root {
  --color-text: #1b1f23;
  --color-bg: #ffffff;
}

[data-theme='dark'] {
  --color-text: #e6edf3;
  --color-bg: #0d1117;
}

body {
  color: var(--color-text);
  background: var(--color-bg);
}
```

Med JavaScript kan du byta tema utan ny build.

## Token-nivåer

En vanlig modell är tre nivåer:

1. Primitive tokens (grundvärden), till exempel blå-500.
2. Semantic tokens (semantiska värden), till exempel color-text-primary.
3. Component tokens (komponentspecifika), till exempel button-primary-bg.

Denna uppdelning gör det lättare att byta utseende utan att skriva om all CSS.

## Vanliga misstag

1. Direkt hårdkodning i komponenter i stället för tokens.
2. Otydliga token-namn som color1, color2.
3. För många nästan likadana tokens.

## Säkerhet och robusthet

Låt inte användardata skriva direkt till stil-attribut utan validering. Felaktiga eller oväntade värden kan ge trasad layout och i vissa fall påverka användbarhet på kritiska sidor.

## Sammanfattning

- Design tokens ger konsekvens och skalar bra i team.
- SCSS hanterar struktur vid kompilering.
- CSS custom properties möjliggör dynamik i webbläsaren.
- Kombinationen är en praktisk väg till theming och designsystem.

## Se även

- [Variabler och Maps](./variabler-maps.md) – hur man strukturerar tokens i SCSS
- [Theming: ljust och mörkt tema](./theming.md) – tokens i praktiken för tema-system
- [Responsiv SCSS med breakpoints](./responsiv-breakpoints.md) – responsive tokens

## Övningar

1. Skapa fem färgtokens och fem spacing-tokens i :root.
2. Bygg en card-komponent som endast använder var().
3. Skapa ett dark theme med data-theme och visa skillnaden mellan teman.
