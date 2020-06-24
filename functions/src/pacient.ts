import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express'; 

const routes = Router();
const db = main.db;
const collection = 'pacients';

interface Pacient {
    name: string,
    doc: string,
    borndate: Date
}

routes.post('/pacients', async(req, res)=>{
    try{
        const newpacient : Pacient = {
            name: req.body['name'],
            doc: req.body['doc'],
            borndate: req.body['borndate']
        };
        const pacientAdded = await firebaseHelper.firestore.createNewDocument(db, collection, newpacient);
        res.status(201).send(`A pacient has been added id: ${pacientAdded.id}`);
    }catch(err){
        res.status(404).send(`An error has ocurred ${err}`);
    }
});

routes.get('/pacients/:id', async(req, res)=>{    
    let varId = req.params.id;
    firebaseHelper.firestore.getDocument(db, collection, varId)
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(`An error has ocurred ${err}`))

});

routes.get('/pacients', async(req, res)=>{
    firebaseHelper.firestore.backup(db, collection)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(`An error has ocurred ${err}`))
});

export {  routes  }


