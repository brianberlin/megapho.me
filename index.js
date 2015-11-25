const express = require('express')
  , app = express();

app.use(express.static('public'));
app.use('/jspm_packages', express.static('jspm_packages'));
app.get('/config.js', (req, res) => res.sendFile(`${__dirname}/config.js`));

app.listen(3000);