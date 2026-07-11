# Bygg ett REST-API för portfolio-projekt

Nu kopplar vi Express till `Project` och bygger CRUD i samma `portfolio-api`.

## Mål

Efter lektionen kan du:

- utforma resursbaserade routes
- dela upp kod i controller, router, app och server
- använda Mongoose för CRUD
- svara med relevanta HTTP-statuskoder
- hantera valideringsfel och ogiltiga MongoDB-id:n

## Förutsättningar

- Du har slutfört [MongoDB och Mongoose](./mongodb.md).
- MongoDB-anslutningen och `src/models/Project.js` fungerar.
- Projektet använder `"type": "module"` och endast ES-moduler.

## REST i korthet

REST låter URL:en beskriva resursen och HTTP-metoden handlingen:

| Metod | Endpoint | Handling | Lyckat svar |
|---|---|---|---|
| `GET` | `/api/projects` | lista projekt | `200 OK` |
| `GET` | `/api/projects/:id` | hämta ett projekt | `200 OK` |
| `POST` | `/api/projects` | skapa ett projekt | `201 Created` |
| `PATCH` | `/api/projects/:id` | ändra valda fält | `200 OK` |
| `DELETE` | `/api/projects/:id` | ta bort ett projekt | `204 No Content` |

`400` betyder ogiltig indata, `404` saknad resurs och `500` oväntat serverfel.

## 1. Skapa controllern

Skapa mapparna och sedan `src/controllers/projectController.js`:

<!-- terminal -->
```bash
$ mkdir -p src/controllers src/routes
```

```javascript
// src/controllers/projectController.js
import Project from '../models/Project.js';

const allowedFields = ['title', 'description', 'technologies', 'featured'];

function validateProject(data, requireAll = false) {
  const errors = [];

  if (requireAll && data.title === undefined) errors.push('title krävs');
  if (requireAll && data.description === undefined) {
    errors.push('description krävs');
  }
  if (data.title !== undefined && typeof data.title !== 'string') {
    errors.push('title måste vara en sträng');
  }
  if (
    data.description !== undefined &&
    typeof data.description !== 'string'
  ) {
    errors.push('description måste vara en sträng');
  }
  if (
    data.technologies !== undefined &&
    (!Array.isArray(data.technologies) ||
      !data.technologies.every((item) => typeof item === 'string'))
  ) {
    errors.push('technologies måste vara en array av strängar');
  }
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.push('featured måste vara true eller false');
  }

  return errors;
}

function sendDatabaseError(response, error) {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Ogiltigt projekt-id' });
  }
  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map(
      (item) => item.message,
    );
    return response.status(400).json({ error: 'Valideringsfel', details });
  }

  console.error(error);
  return response.status(500).json({ error: 'Internt serverfel' });
}

export async function listProjects(request, response) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return response.json(projects);
  } catch (error) {
    return sendDatabaseError(response, error);
  }
}

export async function getProject(request, response) {
  try {
    const project = await Project.findById(request.params.id);
    if (!project) {
      return response.status(404).json({ error: 'Projektet finns inte' });
    }
    return response.json(project);
  } catch (error) {
    return sendDatabaseError(response, error);
  }
}

export async function createProject(request, response) {
  const body = request.body ?? {};
  const errors = validateProject(body, true);
  if (errors.length > 0) {
    return response.status(400).json({ error: 'Ogiltig data', details: errors });
  }

  try {
    const data = Object.fromEntries(
      allowedFields
        .filter((field) => body[field] !== undefined)
        .map((field) => [field, body[field]]),
    );
    const project = await Project.create(data);
    response.location(`/api/projects/${project.id}`);
    return response.status(201).json(project);
  } catch (error) {
    return sendDatabaseError(response, error);
  }
}

export async function updateProject(request, response) {
  const body = request.body ?? {};
  const updates = Object.fromEntries(
    allowedFields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );
  const errors = validateProject(updates);

  if (Object.keys(updates).length === 0) {
    errors.push('Skicka minst ett tillåtet fält');
  }
  if (errors.length > 0) {
    return response.status(400).json({ error: 'Ogiltig data', details: errors });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      request.params.id,
      updates,
      { new: true, runValidators: true },
    );
    if (!project) {
      return response.status(404).json({ error: 'Projektet finns inte' });
    }
    return response.json(project);
  } catch (error) {
    return sendDatabaseError(response, error);
  }
}

export async function deleteProject(request, response) {
  try {
    const project = await Project.findByIdAndDelete(request.params.id);
    if (!project) {
      return response.status(404).json({ error: 'Projektet finns inte' });
    }
    return response.status(204).send();
  } catch (error) {
    return sendDatabaseError(response, error);
  }
}
```

`runValidators: true` aktiverar schemavalidering vid uppdatering. Ett felaktigt
`:id` ger `CastError` och `400`; ett giltigt id utan dokument ger `404`.

## 2. Koppla funktionerna till routes

Skapa `src/routes/projects.js`:

```javascript
// src/routes/projects.js
import { Router } from 'express';
import {
  createProject, deleteProject, getProject, listProjects, updateProject,
} from '../controllers/projectController.js';
const router = Router();
router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
```

Routern sköter URL:er och controllern databasarbetet.

## 3. Montera routern i appen

Uppdatera `src/app.js`:

```javascript
// src/app.js
import express from 'express';
import projectRoutes from './routes/projects.js';
const app = express();
app.use(express.json());
app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});
app.use('/api/projects', projectRoutes);
app.use((request, response) => {
  response.status(404).json({ error: 'Endpointen finns inte' });
});
export default app;
```

`express.json()` måste ligga före routern. `src/server.js` är oförändrad:

```javascript
// src/server.js
import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';
const PORT = process.env.PORT || 3000;
try {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Kunde inte starta servern:', error.message);
  process.exit(1);
}
```

## 4. Prova hela CRUD-flödet

Kör nu i din riktiga terminal:

<!-- terminal -->
```bash
$ npm start

MongoDB ansluten: portfolio
Servern körs på http://localhost:3000
```

Kopiera `_id` från POST-svaret och ersätt `PROJECT_ID` nedan.

<!-- terminal -->
```bash
$ curl -i -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"Portfolio","description":"Min webbportfolio","technologies":["HTML","CSS","JavaScript"],"featured":true}'
HTTP/1.1 201 Created
...
$ curl -i http://localhost:3000/api/projects
HTTP/1.1 200 OK
...
$ curl -i -X PATCH http://localhost:3000/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"featured":false}'
HTTP/1.1 200 OK
...
$ curl -i -X DELETE http://localhost:3000/api/projects/PROJECT_ID
HTTP/1.1 204 No Content
```

Prova `GET /api/projects/PROJECT_ID` före DELETE. Efteråt ska det ge `404`.

## Vanliga misstag

- **`request.body` är `undefined`:** placera `express.json()` före routes.
- **Validering hoppas över vid PATCH:** använd `runValidators: true`.
- **Alla fel blir 500:** skilj på CastError, ValidationError och serverfel.
- **204 skickar JSON:** `204 No Content` ska inte ha någon response body.
- **Routern monteras dubbelt:** endpointen ska bli `/api/projects`, inte
  `/api/projects/projects`.
- **CommonJS används:** behåll `.js` i imports och använd endast ES-moduler.

## Checkpoint

- [ ] POST skapar ett projekt och svarar med `201` samt `Location`.
- [ ] GET listar projekt och kan hämta ett projekt med id.
- [ ] PATCH validerar och returnerar det uppdaterade dokumentet.
- [ ] DELETE svarar med `204` utan body.
- [ ] Ogiltigt id ger `400` och ett saknat projekt ger `404`.

Fortsätt med [middleware och felhantering](./middleware.md).
