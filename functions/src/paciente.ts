import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express'; 

const routes = Router();
const db = main.db;
const collection = 'pacientes';

interface Paciente {
    nombre: string,
    cedula: string,
    fecha_nacimiento: Date
}

routes.post('/pacientes', async(req, res)=>{
    try{
        const newpaciente : Paciente = {
            nombre: req.body['nombre'],
            cedula: req.body['cedula'],
            fecha_nacimiento: req.body['fecha_nacimiento']
        };
        const pacienteAdded = await firebaseHelper.firestore.createNewDocument(db, collection, newpaciente);
        res.status(201).send(`Un paciente ha sido aniadido con el id: ${pacienteAdded.id}`);
    }catch(err){
        res.status(404).send(`Un error ha ocurrido ${err}`);
    }
});

routes.get('/pacientes/:id', async(req, res)=>{    
    let varId = req.params.id;
    firebaseHelper.firestore.getDocument(db, collection, varId)
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(400).send(`Un error ha ocurrido ${err}`))

});

routes.get('/pacientes', async(req, res)=>{
    firebaseHelper.firestore.backup(db, collection)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(`Un error ha ocurrido ${err}`))
});

export {  routes  }


