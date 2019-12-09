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

#### Building for source
Generating pre-built:
```sh
$ npm build 
```
Start server with builded files:
```sh
$ npm start-build 
```

#### Security Routes

All routes with "/auth/" or routes exactly like "/api/v1/ws/" dont need security JWT token
```javascript
export default (req, res, next) => {
  // all routes */auth/* dont have jwt security
  if (req.url.split("/").indexOf("auth") >= 0 || req.url === "/api/v1/ws/") {
    return next();
  }
  // {....}
  }
```
it can be change the code above inside `src/bin/middleware/index.js`   


To start the frontend in development mode
```sh
// to start the frontend (development mode):
$ cd frontend 
    // and
$ yarn install 
    // and
$ yarn start 
```
## To run a backend production mode 
```sh
// to build the backend (production mode):
$ yarn install 
    // and
$ yarn start
```

## To run a frontend production mode 
```sh
// to build the frontend (production mode):
$ cd frontend
     //and
$ yarn install 
    // and
$ yarn build
```
##### copy the generated files in `build/static`
##### Obs: this are static files, so you need put then inside a NGINX server, or another server


## To run a production mode in  Cloud Based Server
#### The backend 
##### The backend is so easy to run, just you have a nodeJS container and put code files in there. Then you have to install dependencies with `yarn install` or `npm install`, after you have run `yarn start` or `npm start`

#### The frontend 
##### The easiest way to upload the frontend on cloud is using a boilerplate to deploy. 
##### The react boilerplate can be find in https://buildpack-registry.s3.amazonaws.com/buildpacks/mars/create-react-app.tgz
##### You must pass to your frontend  the environments variables with the server location, you can create a .ENV file like: 
```sh
REACT_APP_API_URL=http://localhost:3001/api/v1/ws/
REACT_APP_API_URL_BASE=http://localhost:3001
```
#####or pass directly in your cloud server environment variables

#### The mongoDB
###### You can create a mongoDB sandbox and get the string connection url. So you have open  `src/config/constants.js` and change constant mongoDB to your string url connection. Otherwise you can create a environments variable named MONGO_URL and pass your string directly in you server cloud.



