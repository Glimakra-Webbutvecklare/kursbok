const jsonServer = require('json-server');
const path = require('node:path');

const server = jsonServer.create();
const api = jsonServer.router(path.join(__dirname, 'db.json'));
const port = Number(process.env.PORT) || 3001;

server.use(jsonServer.defaults({ logger: true }));
server.use(jsonServer.bodyParser);
server.use('/api', api);

server.listen(port, () => {
  console.log(`Kulturverkstans demo-API kör på http://localhost:${port}/api`);
});
