import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = 'medics';

interface Medic {
    name: string,
    doc: string,
    speciality: string
};

routes.post('/medics', async(req, res)=>{
    try{
        const newmedic : Medic = {
            name: req.body['name'],
            doc: req.body['doc'],
            speciality: req.body['speciality']
        };
        const medicAdded = await firebaseHelper.firestore.createNewDocument(db, collection, newmedic);
        res.status(201).send(`A medic has been added id: ${medicAdded.id}`);
    }catch(err){
        res.status(404).send(`An error has ocurred ${err}`);
    }
});

routes.get('/medics/:id', async(req, res)=>{    
    let varId = req.params.id;
    firebaseHelper.firestore.getDocument(db, collection, varId)
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(`An error has ocurred ${err}`))

});

routes.get('/medics', async(req, res)=>{
    firebaseHelper.firestore.backup(db, collection)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(`An error has ocurred ${err}`))
});

export {  routes  }