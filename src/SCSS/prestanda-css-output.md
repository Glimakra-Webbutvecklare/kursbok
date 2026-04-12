# Prestanda och CSS-output

SCSS gör det enkelt att skriva mycket kod snabbt. Samtidigt kan för mycket genererad CSS ge större filer, långsammare laddning och mer komplex felsökning.

## Varför tänka på output?

Webbläsaren läser bara slutlig CSS. Om SCSS-koden genererar tusentals rader oanvända regler påverkar det prestanda, särskilt på mobila nätverk.

## Vanliga orsaker till stor CSS

1. För breda loopar med många varianter som aldrig används.
2. Dubblerad kod från mixins i många komponenter.
3. Djup nesting som skapar långa selektorer.
4. Oklara imports där samma filer används flera gånger.

## Praktiskt exempel: övergenerering

```scss
$colors: (
  blue: #007aff,
  red: #cf222e,
  green: #1a7f37,
);

$sizes: (
  sm: 0.875rem,
  md: 1rem,
  lg: 1.25rem,
);

@each $color-name, $color in $colors {
  @each $size-name, $size in $sizes {
    .badge-#{$color-name}-#{$size-name} {
      background: $color;
      font-size: $size;
    }
  }
}
```

I små projekt är detta okej. I stora projekt kan kombinationer växa exponentiellt.

## Strategier för bättre prestanda

1. Generera bara de varianter som faktiskt används.
2. Håll utility-system fokuserat och token-baserat.
3. Mät filstorlek regelbundet i build-pipeline.
4. Använd minifiering i produktion.

## Specificitet och renderingskostnad

Långa selektorkedjor kan vara svårare att underhålla och kan påverka renderingen. Kortare, komponentbaserade selektorer är oftast bättre.

## Exempel: mer kontrollerad loop

```scss
$button-variants: (
  primary: #0b6bcb,
  danger: #cf222e,
);

@each $name, $value in $button-variants {
  .btn-#{$name} {
    background: $value;
    color: #fff;
  }
}
```

## Säkerhet och robusthet

För stor CSS kan leda till att kritiska stilar laddas sent på långsamma enheter. Det kan ge visuellt trasiga vyer i till exempel formulärflöden där tydlig feedback är viktig.

## Sammanfattning

- Optimera SCSS efter faktisk användning.
- Begränsa loopar och varianter till tydliga behov.
- Håll selektorer korta och förutsägbara.
- Kontrollera outputstorlek och minifiera för produktion.

## Se även

- [Loopar i praktiken och utility-klasser](./loopar-utility-klasser.md) – risker med övergenerering
- [Nesting och selektorstrategi](./nesting-selektorstrategi.md) – specificity-problem
- [7-1 Struktur med importer](./sju-ett-struktur.md) – organisering för bättre prestanda

## Övningar

1. Mät skillnad i CSS-storlek mellan bred och kontrollerad loop.
2. Identifiera en komponent med onödigt hög specificitet och förenkla den.
3. Skapa en enkel checklista för SCSS-prestanda i teamet.
