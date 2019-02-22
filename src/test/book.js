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
/* GET
Que la réponse ait un status 200 
Que la clé books de la réponse simulé soit un array 
Que la réponse soi la bonne IDBCursor

/POST
Que la réponse ait un status 200 
Que la clé message de la réponse simulé soit :  ‘book successfully added’ 
/PUT 
Que la réponse ait un status 200 
Que la clé message de la réponse simulé soit :  ‘book successfully updated’ 
/DELETE

Que la réponse ait un status 200 
Que la clé message de la réponse simulé soit :  ‘book successfully deleted’
  */

 //Test d'intégration : Tests qui se lancent en même temps que le code et qui testent l'intégralité du code : On appelle un environnement externe

 describe('Test intégration (Empty database)', () => {
  let emptyBooks = {
      books : []
  }
  beforeEach(done => {
      resetDatabase(
          path.join(__dirname, '../data/books.json'),emptyBooks);
          done();
  })
  it('Beng clear the database ', done => {
      chai
          .request(server)
          .get('/book')
          .end((err, res) => {
              if (err) console.log(err);
              expect(res).to.have.status(200);
              console.log(res.body)
              expect(res.body).to.be.a('object');
              expect(res.body.books).to.be.a('array');
              expect(res.body.books.length).to.equal(0);
              done();
          });
  })

  it('Beng add book', done => {
      chai
          .request(server)
          .post('/book')
          .send({
              "id" :"55b7d315-1a5f-4b13-a665-c382a6c71756",
              "title" : "Oui-oui contre Islem",
              "years" : "1940",
              "pages": "667"
          })
          .end((err, res) => {
              if(err) console.log(err);
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body.message).to.equal('book successfully added');
              done();
          })
  })

});

describe('Test intégration (Mocked Database)', () => {
let book = {
      books: [{
          id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9', 
          title: 'Oui-oui contre Islem',
          years: 1940,
          pages: 667
      } ]
}

beforeEach(done => {
  resetDatabase(
      path.join(__dirname, '../data/books.json'),book);
      done();
})

it('Beng put something U_u', done => {
  chai
      .request(server)
      .put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
      .send({
          "title" : "Ali et les 40 Islem "
      })
      .end((err, res) => {
          if(err) console.log(err);
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('book successfully updated');
          done();
      })
      
})

it('Beng get something 😮', done => {
  chai
      .request(server)
      .get('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
      .end((err, res) => {
          if(err) console.log(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('book fetched');
          expect(res.body.book).to.be.a('object');
          expect(res.body.book.years).to.be.a('number');
          expect(res.body.book.years).to.equal(1940);
          expect(res.body.book.pages).to.be.a('number');
          expect(res.body.book.pages).to.equal(667);
          expect(res.body.book.title).to.be.a('string');
          expect(res.body.book.title).to.equal('Oui-oui contre Islem');
          done();
      })
})

it('Beng delete something U_u', done => {
  chai
      .request(server)
      .delete('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
      .end((err, res) => {
          if(err) console.log(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('book successfully deleted');
          done();
      })
      
})


})



describe('Test unity(Totu va bene)', () => {

  beforeEach(()=>{ //Avant chaque test on clean tout ce qui a été intercepté par nock
      nock.cleanAll()
})

it('Devrait envoyer le status 200 et un tableau si le tableau de livres est vide',done=>{
let emptyBooks = { //On instancie un tableau de livres
  books: []
}

nock("http://localhost:8080") 
.get('/book') //Interception des données du Get
.reply(200,emptyBooks) //Envoie d'un statut de la liste de livres
chai
.request("http://localhost:8080") //Récupération des infos avec Chai
.get('/book')
.end((err, res) => { //Fin de la fonction, on s'attend à récupérer : Statut 200, un objet, un tableau et une liste de livres vide  
  if (err) console.log(err);
  expect(res).to.have.status(200);
  expect(res.body).to.be.a('object');
  expect(res.body.books).to.be.a('array');
expect(res.body.books.length).to.equal(0);
done();
});
}) 

it('Devrait envoyer status 200 et un message si le livre passe',done=>{
  let message = {
      message: 'Je crois ton livre il est passé' //Instanciation du message
  }
  nock("http://localhost:8080")
  .post('/book')
  .reply(200,message) //On envoie le status et le message
      chai
      .request('http://localhost:8080')
      .post('/book') //On récupère le POST
      .send({ //On envoie un livre 
          "id": "49657845666",
          "title": "Si un poney rencontre un chien que se passe t'il ?",
          "years": "2012",
          "pages": "21"
      })
      .end((err, res) => {
          if (err) console.log(err);
          expect(res).to.have.status(200); //On vérifie le statue ok, l'objet , que le message soi bien une ficelle et que le message est le même 
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Je crois ton livre il est passé');
          done();
});
})


it('Devrait envoyer un status 200 et un message si la mise à jour fonctionne',done=>{
  let message = {
      message: 'Livre mis à jour' //Message : Mise à jour du livre 
  }
  nock("http://localhost:8080")
  .put('/book/49657845666') //On intercepte le livre avec l'ID correspondante 
  .reply(200,message)
     
  chai
      .request('http://localhost:8080')
      .put('/book/49657845666') //On récupère les données du livre pour les modifier
      .send({
          "pages": "666" //On renvoie une modification apportée au livre
      })
      .end((err, res) => {
          if (err) console.log(err);
          expect(res).to.have.status(200); //On s'attend au status 200, un objet et que la ficelle soi exacte
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Livre mis à jour');
          done();
      });
})

it('Devrait si le delete a fonctionné envoyer un status 200 et un message',done=>{
  let message = {
      message: 'Le livre est bien supprimé' //Instanciation message
  }
  nock("http://localhost:8080")
  .delete('/book/49657845666') //On intercepte la fonction delete et on renvoie le status et le message
  .reply(200,message)
     
  chai
      .request('http://localhost:8080')
      .delete('/book/49657845666') 
      .end((err, res) => { // On vérifie que cela a bien fonctionné avec le status envoyé, et la bonne ficelle 
          if (err) console.log(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Le livre est bien supprimé');
          done();
      });
})

it('Devrait pour le get envoyer un status 200 et un message',done=>{
  let data = {
      message: 'Livre récupéré',
      book : {
          'id': '5488619',
          'title': '5 poneys sur une île arrivent ils a construire à radeau pour s enfuir ?',
          'years': 2018,
          'pages': 900
      }
  }
  nock("http://localhost:8080")
  .delete('/book/5488619')
  .reply(200,data)
      chai
      .request('http://localhost:8080')
      .delete('/book/5488619')
      .end((err, res) => {
          if (err) console.log(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Livre récupéré');
          expect(res.body.book).to.be.a('object');
          expect(res.body.book.years).to.equal(2018);
          expect(res.body.book.pages).to.equal(900);
          expect(res.body.book.title).to.equal('5 poneys sur une île arrivent ils a construire à radeau pour s enfuir ?');
          done();
      });
})
})



//Test unitaire : On exécute nous mêmes les fonctions une par unes pour les tester unes par unes : On contrôle nous même l'environnement
describe('Test unity (oups c kassé)', () => {

  beforeEach(()=>{
      nock.cleanAll() //On clean tout avant le test 
  })
  it('Devrait envoyer un status 400 et un message sur le get du tableau de livres',done=>{
      let message = {
          message : 'Erreur en récupérant les bouquins, dur'
      }
      nock("http://localhost:8080")
      .get('/book')
      .reply(400,message) //On intercepte et on envoie notre status et notre message
          chai
          .request('http://localhost:8080')
          .get('/book')
          .end((err, res) => {
              if (err) console.log(err);
              expect(res).to.have.status(400); //On s'attend à 400 un objet une ficelle et que le message soi le même
              expect(res.body).to.be.a('object');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.equal('Erreur en récupérant les bouquins, dur');
              done();
          });
  })

  it('devrait si le post se casse la gueule envoyer une erreur 400 et un message',done=>{
      let message = {
          message: 'Erreur en rajoutant le livre'
      }
      nock("http://localhost:8080")
      .post('/book')
      .reply(400,message)
          chai
          .request('http://localhost:8080')
          .post('/book')
          .send({
              "id": "121518796598983",
              "title": "Si 145 poneys se retrouvent dans le mordor peuvent-ils battre Sauron ?",
              "years": "3459",
              "pages": "7893"
          })
          .end((err, res) => {
              if (err) console.log(err); //On s'attend à un status 400 et un texte exact
              expect(res).to.have.status(400);
              expect(res.body).to.be.a('object');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.equal('Erreur en rajoutant le livre');
              done();
          });
  })

  it('devrait pour la modif ratée envoyer un 400 et un message',done=>{
      let message = {
          message: 'Erreur en essayant de mettre à jour le livre' //Le message 
      }
      nock("http://localhost:8080")
      .put('/book/121518796598983')
      .reply(400,message) //On envoie le status et le message
          chai
          .request('http://localhost:8080')
          .put('/book/121518796598983')
          .send({ 
              "pages": "459" //On envoie la modif
          })
          .end((err, res) => {
              if (err) console.log(err);
              expect(res).to.have.status(400); 
              expect(res.body).to.be.a('object'); //Rien ne passe tout est bon
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.equal('Erreur en essayant de mettre à jour le livre');
              done();
          });
  })

  it('devrait pour le delete raté envoyer un 400 et le message',done=>{
      let message = {
          message: 'Erreur en supprimant le livre'
      }
      nock("http://localhost:8080")
      .delete('/book/121518796598983') //On récupère la fonction pour delete le livre
      .reply(400,message)
          chai
          .request('http://localhost:8080')
          .delete('/book/121518796598983')
          .end((err, res) => {
              if (err) console.log(err);
              expect(res).to.have.status(400); //On s'attend a un 400 et le message
              expect(res.body).to.be.a('object');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.equal('Erreur en supprimant le livre');
              done();
          });
  })

  it('Devrait pour le get raté envoyer un 400 et le message',done=>{
      let message = {
          message: 'Le livre existe pas cousin', //Le message comme d'hab
      }
      nock("http://localhost:8080")
      .delete('/book/121518796598983') //On récupère la fonction delete
      .reply(400,message) //On lui dit que ça foire direct
          chai
          .request('http://localhost:8080')
          .delete('/book/121518796598983')
          .end((err, res) => { //Oulala on observe que ça marche pas parce que c'est le même message et status qu'on lui a nous même envoyés
              if (err) console.log(err)
              expect(res).to.have.status(400)
              expect(res.body).to.be.a('object')
              expect(res.body.message).to.be.a('string')
              expect(res.body.message).to.equal('Le livre existe pas cousin')
              done()
          });
  })
})





