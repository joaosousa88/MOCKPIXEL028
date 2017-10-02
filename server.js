const fs = require('fs')
const path = require('path')
const express = require('express')
const got = require('got');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', function (req, res) {
    res.send('Hello world');
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

app.get(['/car/:endpoint', '/car/:endpoint/:action?'], (req, res, next) => {
    /* toy car */
    const VIN = 'MOCKPIXEL028';
    const url = `https://api.prod.smartservices.car2go.com/vega/vehicles/${VIN}/${req.params.endpoint}/${req.params.action || ''}`;
    var options = {
        key: fs.readFileSync(`${__dirname}/ssl/private.key`),
        cert: fs.readFileSync(`${__dirname}/ssl/pixelcamp.pem`),
        ca: fs.readFileSync(`${__dirname}/ssl/pixelcamp.pem`),
        passphrase: 'smartcode'
    };

    if(req.params.endpoint === 'status') {
        const statusUrl = `https://api.prod.smartservices.car2go.com/vega/vehicles/${VIN}/?fields=batteryLevel,connection.connected,connection.since,doors.allClosed,doors.leftOpen,doors.locked,doors.rightOpen,doors.trunkOpen,engineOn,fuelLevel,geo.latitude,geo.longitude,ignitionOn,immobilizerEngaged,mileage,powerState,vin`;
        got.get(statusUrl, options)
        .then((resp) => {
          console.log('response from mercedes', resp.body);
          res.send(resp.body);
        })
        .catch((err)=>console.log(err))
    } else {
        got.put(url, options)
        .then((resp) => {
          console.log('response from mercedes', resp.body);
          res.send(resp.body);
        })
        .catch((err)=>console.log(err))
    }


});

app.get('*', (req, res) => {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")

  const errorHandler = err => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).end('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
  }
  //
  // renderer.renderToStream({ url: req.url })
  //   .on('error', errorHandler)
  //   .on('end', () => console.log(`whole request: ${Date.now() - s}ms`))
  //   .pipe(res)
})

app.listen(3002, function() {
    console.log('Listening');
});
