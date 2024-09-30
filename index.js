const http = require('http');
const url = require('url');
const fs = require('fs').promises;

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { id, name } = parsedUrl.query;

  // Leer archivo JSON
  let animeData;
  try {
    const data = await fs.readFile('anime.json', 'utf8');
    animeData = JSON.parse(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error al leer el archivo');
    return;
  }

  // Listar todos los animes
  if (parsedUrl.pathname === '/anime' && req.method === 'GET') {
    if (id && animeData[id]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(animeData[id]));
    } else if (name) {
      const anime = Object.values(animeData).find(a => a.name.toLowerCase() === name.toLowerCase());
      if (anime) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(anime));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Anime no encontrado');
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(animeData));
    }
  }

  // Crear un nuevo anime
  if (parsedUrl.pathname === '/anime' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      const newAnime = JSON.parse(body);
      const newId = String(Object.keys(animeData).length + 1);
      animeData[newId] = newAnime;

      await fs.writeFile('anime.json', JSON.stringify(animeData, null, 2));
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Anime agregado exitosamente');
    });
  }

  // Actualizar un anime
  if (parsedUrl.pathname === '/anime' && req.method === 'PUT') {
    if (id && animeData[id]) {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', async () => {
        const updatedAnime = JSON.parse(body);
        animeData[id] = { ...animeData[id], ...updatedAnime };

        await fs.writeFile('anime.json', JSON.stringify(animeData, null, 2));
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Anime actualizado exitosamente');
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Anime no encontrado');
    }
  }

  // Eliminar un anime
  if (parsedUrl.pathname === '/anime' && req.method === 'DELETE') {
    if (id && animeData[id]) {
      delete animeData[id];

      await fs.writeFile('anime.json', JSON.stringify(animeData, null, 2));
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Anime eliminado exitosamente');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Anime no encontrado');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
