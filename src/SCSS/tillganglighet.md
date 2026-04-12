# Tillgänglighet i SCSS

Tillgänglighet (accessibility) handlar om att fler användare ska kunna förstå och använda gränssnittet. SCSS spelar en viktig roll genom färg, typografi, fokusstilar och rörelse.

## Kontrast

Text måste ha tillräcklig kontrast mot bakgrunden för att vara läsbar.

```scss
:root {
  --color-text: #1f2328;
  --color-bg: #ffffff;
}

body {
  color: var(--color-text);
  background: var(--color-bg);
}
```

Undvik ljusgrå text på vit bakgrund i vanliga textstorlekar.

## Fokusstilar

När användaren navigerar med tangentbord måste fokus synas tydligt.

```scss
.button:focus-visible,
.link:focus-visible,
.input:focus-visible {
  outline: 3px solid #0b6bcb;
  outline-offset: 2px;
}
```

Ta inte bort outline utan att ersätta den med en tydlig variant.

## Klickytor

För små klickytor är svåra att använda, särskilt på mobil.

```scss
.icon-button {
  min-width: 44px;
  min-height: 44px;
}
```

## Läsbar typografi

```scss
body {
  line-height: 1.5;
  font-size: 1rem;
}

.article {
  max-width: 70ch;
}
```

Lagom radlängd och radavstånd förbättrar läsbarheten.

## Reduced motion

Vissa användare är känsliga för rörelse. Stöd prefers-reduced-motion.

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Tillstånd i formulär

Färg ensam räcker inte för att kommunicera fel eller framgång. Kombinera färg med text och ikoner i gränssnittet.

## Säkerhet och robusthet

God tillgänglighet minskar risken att användare missar kritisk information, till exempel varningar, felmeddelanden eller bekräftelser i viktiga flöden.

## Sammanfattning

- Kontrast och fokus är grundläggande tillgänglighet.
- Klickytor och typografi påverkar användbarheten direkt.
- Stöd reduced motion för att minska obehag.
- Tillgänglighet ska testas i alla teman och skärmstorlekar.

## Se även

- [Theming: ljust och mörkt tema](./theming.md) – kontrast i olika teman
- [Nesting och selektorstrategi](./nesting-selektorstrategi.md) – fokusstilar med &:focus-visible
- [Design tokens och CSS custom properties](./design-tokens-css-custom-properties.md) – konsekvent tillgänglighet via tokens

## Övningar

1. Lägg till fokusstilar för knappar, länkar och formulärfält i ett befintligt projekt.
2. Kontrollera kontrast för primär knapp, sekundär knapp och varningsmeddelande.
3. Lägg till stöd för prefers-reduced-motion och verifiera resultatet.
