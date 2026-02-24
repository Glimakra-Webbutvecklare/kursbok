# WordPress page builders

Page builders är verktyg som gör att du kan bygga sidlayout visuellt i WordPress utan att skriva all kod själv. De används ofta för landningssidor, kampanjsidor och projekt där redaktörer snabbt behöver skapa egna layouter.

## Förkunskaper

Innan du börjar bör du ha läst:

- [WordPress](./wordpress.md)
- [WordPress adminpanel](./wordpress-admin.md)
- [WordPress teman](./wordpress-teman.md)

## Vad är en page builder?

En page builder är ett tillägg (plugin) eller en redigeringsmiljö där du bygger sida med block, sektioner och komponenter genom drag and drop.

Vanliga exempel:

- Elementor
- Beaver Builder
- Divi Builder
- Bricks (tema-baserad builder)

## Hur skiljer det sig från Gutenberg?

WordPress har redan blockredigeraren Gutenberg. En page builder erbjuder ofta:

- Fler designkontroller direkt i redigeraren
- Färdiga mallar (templates)
- Visuell layoutstyrning på detaljnivå

Gutenberg är ofta enklare och lättare för prestanda, medan page builders kan ge snabbare designproduktion i vissa projekt.

## När passar page builders?

Page builders passar bra när du vill:

- Bygga många unika landningssidor snabbt
- Låta redaktörer arbeta visuellt utan kod
- Använda färdiga komponenter och mallar

De passar sämre när du behöver:

- Maximal prestanda med minimal frontend-kod
- Mycket strikt designsystem med få avvikelser
- Full kontroll över markup och kodstruktur

## Jämförelseöversikt

| Verktyg | Styrka | Att tänka på |
|---|---|---|
| Gutenberg | Inbyggt, lättviktigt | Färre avancerade designfunktioner |
| Elementor | Stor flexibilitet | Kan bli tungt med många widgets |
| Beaver Builder | Stabilt arbetsflöde | Färre visuella effekter än vissa alternativ |
| Divi Builder | Många designmöjligheter | Kan ge leverantörslåsning (vendor lock-in) |

## Arbetsflöde med page builder

```mermaid
flowchart LR
	A[Välj builder] --> B[Skapa sidmall]
	B --> C[Bygg sektioner]
	C --> D[Testa mobil och desktop]
	D --> E[Optimera och publicera]
```

## Prestanda och underhåll

När du använder page builders behöver du särskilt tänka på:

1. Antal tillägg och externa scripts.
2. Bildoptimering och lazy loading.
3. Återanvändning av mallar i stället för duplicering.
4. Dokumentation av vilka komponenter teamet ska använda.

## Säkerhet och drift

- Installera bara builders från betrodda leverantörer.
- Uppdatera builder-plugin regelbundet.
- Ta backup innan större uppdateringar.
- Testa i staging (testmiljö) före produktion.

Det minskar risken för driftstopp och kompatibilitetsproblem.

## Vanliga misstag

1. För många olika sidmallar utan gemensam struktur.
2. Tung design med stora bilder och animationer överallt.
3. Blandning av flera page builders i samma projekt.
4. Ingen plan för hur innehåll ska flyttas om builder byts.

## Sammanfattning

Page builders kan vara ett effektivt verktyg för snabb visuell produktion i WordPress. Med tydliga riktlinjer för prestanda, struktur och uppdateringar kan de fungera bra i både små och medelstora projekt.

## Reflektionsfrågor

1. När skulle du välja Gutenberg framför en extern page builder?
2. Vilka risker ser du med att bygga hela sajten i en enda builder?
3. Hur kan du säkra att teamet bygger sidor konsekvent och snabbt?
