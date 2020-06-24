import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = 'precriptions';

interface Prescription {
    date: Date,
    idpacient: string,
    idmedic: string
};

interface Detail {
    medicament: string,
    components: string,
    posology: string,
    idpres: string
}

routes.post('/prescriptions', async(req, res)=>{
    try{
        const newprescription : Prescription = {
            date: new Date(),
            idpacient: req.body['idpacient'],
            idmedic: req.body['idmedic']
        };
        const prescriptionAdded = await firebaseHelper.firestore.createNewDocument(db, collection, newprescription);
        res.status(201).send(`A prescription has been added id: ${prescriptionAdded.id}`);
    }catch(err){
        res.status(404).send(`An error has ocurred ${err}`);
    }
});

routes.get('/prescriptions/:id', async(req, res)=>{    
    let varId = req.params.id;
    firebaseHelper.firestore.getDocument(db, collection, varId)
    .then(idpacient => res.status(200).send(idpacient))
    .catch(err => res.status(400).send(`An error has ocurred ${err}`))

});

routes.get('/prescriptions', async(req, res)=>{
    firebaseHelper.firestore.backup(db, collection)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(`An error has ocurred ${err}`))
});

////Prescriptions details

routes.post('/prescriptions/:id/details', async(req, res)=>{
    const newDetail : Detail ={
        medicament: req.body['medicament'],
        components: req.body['components'],
        posology: req.body['posology'],
        idpres: req.body['idpres']
    };
    let docPrescription = db.collection(collection).doc(req.params.id);

    docPrescription.collection('details').add(newDetail).then(detailAdded =>{
        res.status(200).send(`Detail was added successful with id ${docPrescription.id}`);
    }).catch(err => {
        res.status(400).send(`An error has ocurred ${err}`);
    })
});

export {  routes  }

