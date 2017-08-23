# soundbridge
John Morton's Sound Bridge

Installation in Van der Donck Park, Yonkers, NY
https://hudsonrivermuseum.culturalspot.org/asset-viewer/sound-bridge/iQENSSDZ7di0XA?hl=en

Web version to be released soon.

# Installation Version

Requires [PD](https://puredata.info/)

The installation runs this on a:
* Raspberry Pi 2b+
* 6 Channel USB audio interface
* Arduino
* 4 IR Distance sensors
* And a custom startup script (to be included here soon)

# Web Version

Requires [node](https://nodejs.org) and [npm](https://npmjs.com)

## Set up for Development

I recently added Webpack and didn't check to see if that changed anything I documented here.  I hope not, but just an FYI this section may be out of date.

```sh
cd web && npm install
cd ..
cd server && npm install
cd ..
cp config.bak config.js
```
and change your config host, port, etc... if necessary (if you're not using the server, it won't be)

## Run server
`npm run server`

## Building in /web

Development:
```sh
gulp dev
```
or to also start the development server
```sh
gulp dev-server
```

## Testing
```sh
gulp test
```
Using the [mocha](http://mochajs.org/) testing framework, along with the [chai](http://chaijs.com/) assertion library.  This runs all tests in the /test folder.

## Watches
#### everything
```sh
gulp watch
```
#### assets
`gulp watch:static`
css, js, html

#### test
`gulp watch:test`

## Server

The server works based on a correct Server setup, instructions not provided here right now.

