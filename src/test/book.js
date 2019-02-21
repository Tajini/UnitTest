import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiNock from 'chai-nock';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import nock from 'nock';

import server from '../server';
import resetDatabase from '../utils/resetDatabase';

chai.use(chaiHttp);
chai.use(chaiNock);
chai.use(chaiAsPromised);


// TEST D'INTEGRATIOOOOOOOON
// tout les packages et fonction nescessaire au test sont importé ici, bon courage

// fait les Tests d'integration en premier
//POUR LA ROUTE GET : 
//Il devront  s’assurer que le body de la réponse soit un objet Que la réponse ait un status 200 
//Que la clé books soit un tableau 
//Que la taille du tableau books soit de zero pour la route 

// POUR LA ROUTE POST : 
//Que la réponse ait un status 200 
//Que la clé message dans l’objet body contiennent : “book successfully added” 


// TEST UNITAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIRE 
// TEST UNITAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIRE 
describe('localStorage', () => {
    beforeEach(() => localStorage.clear())

    chai
    .request(server)
    .get('/book')
    .end((err, res) => {
      if (err) console.log(err);
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body.books).to.be.a('array');
      expect(res.body.books.length).to.equal(0);
      done();
    
    
})});
   /* Chai
    .request(server) 
    .get("/book")
    Apibookinterceptor = nock(http://localhost:8080) 
    Expect(rest).to.havestatus(200) */




