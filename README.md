# ServerOT: A server IoT boilerplate 

[]([![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid))

[![Build Status](https://travis-ci.org/jhersonharyson/iot-central-server-dev.svg?branch=master)](https://travis-ci.org/jhersonharyson/iot-central-server-dev)


ServerOT is a Express based server, with a mongoDB storage hosted on mLab.
  - Express.js
  - MongoDB
  

### Installation

Boilerplate requires [Node.js](https://nodejs.org/) v8+ to run.

Install the dependencies and devDependencies.
```sh
// inside the folder execute the commands bellow
$ npm install
    // or
$ yarn install
```
To start the server in development mode
```sh
// to start the server (development mode):
$ npm run run 
    // or
$ yarn run run 
```
this command will start `server` on port `3000` and can be access by `localhost:3000` 

For production mode ...
```sh
$ npm start 
    // or
$ yarn start 
```


### Testing

The test was developed with mochaJS.

Open your favorite Terminal and run these commands.
First Tab:
```sh
$ npm run start-test
```

#### Building for source
Generating pre-built:
```sh
$ npm build 
```
Start server with builded files:
```sh
$ npm start-build 
```





