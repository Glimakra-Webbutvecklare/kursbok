# Formulär i React: Interaktiv Användarinmatning

## Problemet: Statisk HTML räcker inte

Du har byggt en fin statisk webbsida, men nu vill användarna kunna skicka meddelanden, registrera konton eller söka efter produkter. Vanlig HTML-formulär skickar dig till en ny sida - inte så användarvänligt för moderna webbappar.

```html
<!-- Traditionellt HTML-formulär -->
<form action="/submit" method="POST">
  <input type="text" name="username" />
  <button type="submit">Skicka</button>
</form>
<!-- Sidan laddas om och användaren förlorar sitt sammanhang -->
```

**Problem:**
- Sidan laddas om vid varje submit
- Ingen validering innan skickning
- Svårt att ge användaren feedback
- Kan inte kombinera med andra React-komponenter smidigt

## Lösningen: Kontrollerade formulär med React

React gör formulär **interaktiva** genom att låta oss hantera all input i JavaScript och ge omedelbar feedback utan sidladdningar.

### Grundprincipen

I React kontrollerar vi formulär-värden med `useState` och hanterar ändringar med event handlers. Detta kallas "controlled components".

## Steg-för-steg: Bygg interaktiva formulär

### Steg 1: Ett enkelt textfält

Låt oss börja med det allra enklaste - en komponent som visar vad användaren skriver medan de skriver:

```jsx
import { useState } from 'react';

function SimpleForm() {
  const [name, setName] = useState('');

  return (
    <div>
      <h2>Hej, {name || 'okänd person'}!</h2>
      
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Skriv ditt namn..."
      />
      
      <p>Du har skrivit: "{name}"</p>
    </div>
  );
}
```

**Prova detta:** Skriv i fältet och se hur texten uppdateras direkt medan du skriver!

**Viktiga delar:**
- `value={name}` - React kontrollerar vad som visas
- `onChange` - Körs varje gång användaren skriver
- `e.target.value` - Det nya värdet från input-fältet

### Steg 2: Hantera formulär-submit

Nu lägger vi till en submit-knapp och förhindrar sidladdning:

```jsx
function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindra sidladdning!
    
    console.log('Formulär skickat:', { name, email });
    alert(`Tack ${name}! Vi kontaktar dig på ${email}`);
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Kontakta oss</h2>
      
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ditt namn"
        className="form-input"
      />
      
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Din e-post"
        className="form-input"
      />
      
      <button type="submit" className="submit-button">
        Skicka meddelande
      </button>
    </form>
  );
}
```

**Förslag CSS**
```css
.contact-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

**Testa:** Fyll i formuläret och klicka "Skicka meddelande"

### Steg 3: Lägg till validering

Nu gör vi formuläret smartare med validering:

```jsx
function ValidatedForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Namn är obligatoriskt';
    }
    
    if (!email.trim()) {
      newErrors.email = 'E-post är obligatoriskt';
    } else if (!email.includes('@')) {
      newErrors.email = 'Ange en giltig e-postadress';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      // Inga fel - skicka formuläret
      console.log('Formulär godkänt:', { name, email });
      alert('Meddelande skickat!');
      
      // Rensa formuläret
      setName('');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="validated-form">
      <h2>Kontakta oss</h2>
      
      <div className="form-group">
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ditt namn"
          className={`form-input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Din e-post"
          className={`form-input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <button type="submit" className="submit-button">
        Skicka meddelande
      </button>
    </form>
  );
}
```

**Lägg till CSS för fel:**
```css
.form-group {
  margin-bottom: 15px;
}

.form-input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  display: block;
  margin-top: 5px;
}
```

**Testa:** Försök skicka utan att fylla i fälten, eller med ogiltig e-post

### Steg 4: Fler formulärelement

Låt oss utöka med olika typer av input:

```jsx
function CompleteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    country: '',
    newsletter: false,
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Komplett formulär:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="complete-form">
      <h2>Registrera dig</h2>
      
      {/* Textfält */}
      <input 
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Namn"
        className="form-input"
      />
      
      {/* E-post */}
      <input 
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="E-post"
        className="form-input"
      />
      
      {/* Nummer */}
      <input 
        type="number"
        name="age"
        value={formData.age}
        onChange={handleInputChange}
        placeholder="Ålder"
        className="form-input"
        min="13"
        max="120"
      />
      
      {/* Dropdown */}
      <select 
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        className="form-input"
      >
        <option value="">Välj land</option>
        <option value="sweden">Sverige</option>
        <option value="norway">Norge</option>
        <option value="denmark">Danmark</option>
        <option value="finland">Finland</option>
      </select>
      
      {/* Checkbox */}
      <label className="checkbox-label">
        <input 
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleInputChange}
        />
        Jag vill få nyhetsbrev
      </label>
      
      {/* Textarea */}
      <textarea 
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        placeholder="Meddelande (valfritt)"
        className="form-input"
        rows="4"
      />
      
      <button type="submit" className="submit-button">
        Registrera
      </button>
      
      {/* Debug: visa vad som fylls i */}
      <details style={{ marginTop: '20px' }}>
        <summary>Debug: Se formulärdata</summary>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </details>
    </form>
  );
}
```

**Lägg till CSS:**
```css
.checkbox-label {
  display: flex;
  align-items: center;
  margin: 10px 0;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}
```

## Steg 5: Experimentera själv! 🎯

Nu har du grunderna för React-formulär. Prova att lägga till:

### Enkla förbättringar:
```jsx
// Realtidsvalidering (validera medan användaren skriver)
const handleNameChange = (e) => {
  const value = e.target.value;
  setName(value);
  
  if (value.length < 2) {
    setNameError('Namnet måste vara minst 2 tecken');
  } else {
    setNameError('');
  }
};

// Räkna tecken i textarea
<div>
  <textarea /* ... */ />
  <small>{message.length}/500 tecken</small>
</div>

// Disable knapp tills formuläret är giltigt
<button 
  type="submit" 
  disabled={!name || !email || errors.name}
  className="submit-button"
>
  Skicka
</button>
```

### Medelsvåra utmaningar:
- **Lösenordsstyrka:** Visa färgad indikator för lösenordsstyrka
- **Bekräfta lösenord:** Kontrollera att två lösenordsfält matchar
- **Fil-upload:** Hantera filuppladdning med preview
- **Steg-för-steg formulär:** Dela upp i flera steg/sidor

### Avancerade idéer:
- **Auto-save:** Spara formulärdata i localStorage medan användaren skriver
- **Async validering:** Kontrollera om e-post redan finns (simulera API-anrop)
- **Dynamiska fält:** Lägg till/ta bort fält baserat på användarens val

## Populära formulärbibliotek

När dina formulär blir mer komplexa finns det hjälpsamma bibliotek:

- **React Hook Form:** Prestanda-optimerat, minimal re-rendering
- **Formik:** Populärt val med bra validering
- **React Final Form:** Flexibelt och kraftfullt

Men lär dig grunderna först - förståelse för kontrollerade komponenter är grunden för allt formulärarbete i React!

## Viktiga takeaways

✅ **Controlled components:** React kontrollerar formulärvärdena via state  
✅ **preventDefault():** Förhindra sidladdning vid submit  
✅ **Validering:** Ge användaren omedelbar feedback  
✅ **Olika input-typer:** text, email, number, select, checkbox, textarea  
✅ **Användarvänlighet:** Tydliga felmeddelanden och visuell feedback  

Formulär är en av React:s största styrkor - du kan skapa riktigt interaktiva upplevelser! 🚀
