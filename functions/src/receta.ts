import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = 'recetas';

interface Prescription {
    fecha: Date,
    idpaciente: string,
    idmedico: string
};

interface Detalle {
    medicamento: string,
    componente: string,
    posologia: string,

}

routes.post('/recetas', async(req, res)=>{
    try{
        const newprescription : Prescription = {
            fecha: new Date(),
            idpaciente: req.body['idpaciente'],
            idmedico: req.body['idmedico']
        };
        const prescriptionAdded = await firebaseHelper.firestore.createNewDocument(db, collection, newprescription);
        res.status(201).send(`Receta ha sido aniadido exitosamente con id: ${prescriptionAdded.id}`);
    }catch(err){
        res.status(404).send(`Un error ha ocurrido ${err}`);
    }
});

routes.get('/recetas/:id', async(req, res)=>{    
    let varId = req.params.id;
    firebaseHelper.firestore.getDocument(db, collection, varId)
    .then(idpacient => res.status(200).send(idpacient))
    .catch(err => res.status(400).send(`Un error ha ocurrido ${err}`))

});

routes.get('/recetas', async(req, res)=>{
    firebaseHelper.firestore.backup(db, collection)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(`Un error ha ocurrido ${err}`))
});

////recetas details

routes.post('/recetas/:id/detalles', async(req, res)=>{
    const newDetail : Detalle ={
        medicamento: req.body['medicamento'],
        componente: req.body['componente'],
        posologia: req.body['posologia'],

    };
    let docPrescription = db.collection(collection).doc(req.params.id);

    docPrescription.collection('detalles').add(newDetail).then(detailAdded =>{
        res.status(200).send(`Detalle ha sido aniadido exitosamente con id ${docPrescription.id}`);
    }).catch(err => {
        res.status(400).send(`Un error ha ocurrido ${err}`);
    })
});

export {  routes  }

