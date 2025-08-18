# Layout med Flexbox och Grid

## 📖 Flexbox i Tailwind
Flexbox används för att styra layout horisontellt och vertikalt.

### Exempel 1 – Enkel navbar
```html
<div class="flex justify-between items-center p-4 bg-gray-200">
  <div class="font-bold text-xl">Logo</div>
  <div class="space-x-4">
    <a href="#" class="hover:text-blue-600">Hem</a>
    <a href="#" class="hover:text-blue-600">Om oss</a>
    <a href="#" class="hover:text-blue-600">Kontakt</a>
  </div>
</div>
```
Förklaringar:
- `flex` → Aktiverar flexbox.  
- `justify-between` → Sprider ut elementen horisontellt.  
- `items-center` → Centrerar vertikalt.  
- `space-x-4` → Skapar horisontellt mellanrum mellan barn-element.  

### Exempel 2 – Centerad container
```html
<div class="flex justify-center items-center h-64 bg-gray-100">
  <p class="text-lg">Centrerad text</p>
</div>
```

## 📖 Grid
Grid används för mer avancerade layouter med kolumner och rader.

```html
<div class="grid grid-cols-3 gap-4 p-4">
  <div class="bg-red-300 p-4">1</div>
  <div class="bg-green-300 p-4">2</div>
  <div class="bg-blue-300 p-4">3</div>
</div>
```
- `grid-cols-3` → Tre kolumner.  
- `gap-4` → Mellanrum mellan rader och kolumner.  

## 📝 Övning
1. Skapa en flexbox navbar med 5 länkar, centrera vertikalt.  
2. Bygg en 4-kolumns grid-layout med olika färger.  
3. Testa `flex-col` och `flex-wrap` för responsiv layout.
