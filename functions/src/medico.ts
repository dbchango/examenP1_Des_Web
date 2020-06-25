import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = 'medicos';

interface Medico {
    nombre: string,
    cedula: string,
    especialidad: string
};

routes.post('/medicos', async(req, res)=>{
    try{
        const newmedico : Medico = {
            nombre: req.body['nombre'],
            cedula: req.body['cedula'],
            especialidad: req.body['especialidad']
        };
        const medicoAdded = await firebaseHelper.firestore.createNewDocument(db, collection, newmedico);
        res.status(201).send(`Un medico ha sido aniadido id: ${medicoAdded.id}`);
    }catch(err){
        res.status(404).send(`Un error ha ocurrido ${err}`);
    }
});

routes.get('/medicos/:id', async(req, res)=>{    
    let varId = req.params.id;
    firebaseHelper.firestore.getDocument(db, collection, varId)
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(`Un error ha ocurrido ${err}`))

});

routes.get('/medicos', async(req, res)=>{
    firebaseHelper.firestore.backup(db, collection)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(`Un error ha ocurrido ${err}`))
});

export {  routes  }