import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

//=========================CONFIG===========================//

admin.initializeApp({
    credential: admin.credential.cert(require("../../serviceAccountKey.json")),
    databaseURL: "https://proyecto3-d38fa.firebaseio.com"
  });

const db = admin.firestore();
db.settings({ignoreUndefinedProperties : true});

const main = express();
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
main.use('/api', require('./medico').routes);
main.use('/api', require('./paciente').routes);
main.use('/api', require('./receta').routes);



export const api = functions.https.onRequest(main);
export { db };