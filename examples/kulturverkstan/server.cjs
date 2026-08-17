const fs = require('node:fs');
const path = require('node:path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const api = jsonServer.router(path.join(__dirname, 'db.json'));
const port = Number(process.env.PORT) || 3001;
const distDirectory = path.join(__dirname, 'dist');

server.use(jsonServer.defaults({
  logger: true,
  static: fs.existsSync(distDirectory) ? distDirectory : undefined
}));
server.use(jsonServer.bodyParser);
server.use('/api', api);

// BrowserRouter needs the same index.html for direct links and refreshes.
server.get('*', (request, response) => {
  const indexFile = path.join(distDirectory, 'index.html');

  if (fs.existsSync(indexFile)) {
    response.sendFile(indexFile);
    return;
  }

  response.status(404).json({
    message: 'Starta Vite med npm run dev eller bygg appen med npm run build.'
  });
});

server.listen(port, () => {
  console.log(`Kulturverkstans demo-API kör på http://localhost:${port}/api`);
});
