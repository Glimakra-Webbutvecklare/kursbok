# Loopar i praktiken och utility-klasser

Loopar i SCSS gör det möjligt att generera stora delar av CSS automatiskt. Det passar särskilt bra för utility classes (hjälpklasser), till exempel spacing, textstorlekar och färgvarianter.

## Varför loopar?

Utan loopar skriver du samma mönster många gånger:

- .mt-sm, .mt-md, .mt-lg
- .text-sm, .text-md, .text-lg
- .bg-primary, .bg-success, .bg-danger

Med loopar blir koden kortare, tydligare och mindre felbenägen.

## Exempel: spacing med map och @each

```scss
$spacing: (
  xs: 0.25rem,
  sm: 0.5rem,
  md: 1rem,
  lg: 1.5rem,
  xl: 2rem,
);

@each $name, $value in $spacing {
  .mt-#{$name} {
    margin-top: $value;
  }

  .mb-#{$name} {
    margin-bottom: $value;
  }

  .p-#{$name} {
    padding: $value;
  }
}
```

## Exempel: färgvarianter

```scss
$colors: (
  primary: #0b6bcb,
  success: #1a7f37,
  warning: #9a6700,
  danger: #cf222e,
);

@each $name, $value in $colors {
  .text-#{$name} {
    color: $value;
  }

  .bg-#{$name} {
    background-color: $value;
    color: #fff;
  }
}
```

## Exempel: @for-loop

```scss
@for $i from 1 through 6 {
  .col-#{$i} {
    width: calc(($i / 6) * 100%);
  }
}
```

Bra för gridsystem och typografiska nivåer.

## Strukturförslag

Placera loopbaserade hjälpsystem i en egen fil, till exempel components/_utilities.scss eller base/_utilities.scss beroende på projektets konvention.

## När utility-klasser är rätt val

1. Snabb prototyping (prototypframtagning)
2. Små variationer av spacing och text
3. Enhetligt designsystem

## När du bör vara försiktig

1. För många utility-klasser kan ge stor CSS-fil.
2. Otydliga namn gör HTML svårläst.
3. Blandning av utility och komponentstil utan strategi skapar kaos.

## Säkerhet och robusthet

Generera inte klassnamn från okontrollerad användardata. Håll klassnamn till fördefinierade tokens så att du inte får oförutsägbar CSS-output.

## Sammanfattning

- Loopar sparar tid och minskar repetitiv kod.
- @each passar för maps med tokens.
- @for passar för sekvenser och steg.
- Utility-klasser blir starka när namn och skala är konsekventa.

## Se även

- [Variabler och Maps](./variabler-maps.md) – maps som grund för loopar
- [Prestanda och CSS-output](./prestanda-css-output.md) – risker med för många utility-klasser

## Övningar

1. Skapa ett utility-system för margin och padding med minst fem steg.
2. Generera textfärger och bakgrundsfärger från en color map.
3. Bygg ett enkelt 12-kolumnersystem med @for.
