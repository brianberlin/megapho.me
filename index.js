const app = require('express')()
  , http = require('http').Server(app)
  , uuid = require('uuid').v4
  , multer  = require('multer')
  , _find = require('lodash.find')
  , audios = [];

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/app/index.html`);
});

app.get('/build/:path', (req, res) => {
  res.sendFile(`${__dirname}/build/${req.params.path}`);
});

app.post('/audio', upload.single('data'), (req, res) => {
  if (audios.length > 2) audios.shift();

  audios.push({
    id: req.body.id,
    file: req.file
  });

  io.sockets.emit('audio', req.body.id);

  res.sendStatus(200);
});

app.get('/audio/:id', (req, res) => {
  var audio = _find(audios, { id: req.params.id });

  if (!audio) return res.sendStatus(404);

  res.writeHead(200, {
    'Content-Type': 'audio/mp3',
    'Content-disposition': `attachment;filename=${req.params.id}.mp3`
  });

  res.end(audio.file.buffer);
});

var io = require('socket.io').listen(app.listen(3000));
