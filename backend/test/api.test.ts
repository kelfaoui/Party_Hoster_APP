import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';
import UtilisateurController from '../controllers/utilisateurController.js';
import ReservationController from '../controllers/reservationController.js';
import SalleController from '../controllers/salleController.js';

describe('API Tests', () => {
  let app: express.Application;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    app = express();
    app.use(express.json());
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Utilisateur API', () => {
    describe('POST /api/utilisateurs/register', () => {
      it('devrait créer un nouvel utilisateur avec des données valides', async () => {
        const userData = {
          email: 'test@example.com',
          mot_de_passe: 'Password123!',
          nom: 'Test',
          prenom: 'User',
          numero_telephone: '0612345678',
          type: 'Client'
        };

        // Mock des méthodes du modèle
        const findByEmailStub = sandbox.stub(Utilisateur, 'findByEmail').resolves(null);
        const createStub = sandbox.stub(Utilisateur, 'create').resolves(1);

        const response = await request(app)
          .post('/api/utilisateurs/register')
          .send(userData);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message', 'Utilisateur créé avec succès');
        expect(response.body).to.have.property('utilisateur_id', 1);
        expect(findByEmailStub).to.have.been.calledWith('test@example.com');
        expect(createStub).to.have.been.calledOnce;
      });

      it('devrait retourner une erreur si email déjà utilisé', async () => {
        const userData = {
          email: 'existing@example.com',
          mot_de_passe: 'Password123!',
          nom: 'Test',
          prenom: 'User'
        };

        const existingUser = { id: 1, email: 'existing@example.com' };
        const findByEmailStub = sandbox.stub(Utilisateur, 'findByEmail').resolves(existingUser);

        const response = await request(app)
          .post('/api/utilisateurs/register')
          .send(userData);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Cet email est déjà utilisé');
        expect(findByEmailStub).to.have.been.calledWith('existing@example.com');
      });

      it('devrait retourner une erreur si mot de passe trop court', async () => {
        const userData = {
          email: 'test@example.com',
          mot_de_passe: '123',
          nom: 'Test',
          prenom: 'User'
        };

        const findByEmailStub = sandbox.stub(Utilisateur, 'findByEmail').resolves(null);
        const hashStub = sandbox.stub(require('bcryptjs'), 'hash').resolves('hashedpassword');

        const response = await request(app)
          .post('/api/utilisateurs/register')
          .send(userData);

        expect(response.status).to.equal(500);
      });
    });

    describe('POST /api/utilisateurs/login', () => {
      it('devrait connecter un utilisateur avec des identifiants valides', async () => {
        const loginData = {
          email: 'test@example.com',
          mot_de_passe: 'Password123!'
        };

        const user = {
          id: 1,
          email: 'test@example.com',
          mot_de_passe_hash: 'hashedpassword',
          type: 'Client',
          actif: 1
        };

        const findByEmailStub = sandbox.stub(Utilisateur, 'findByEmail').resolves(user);
        const compareStub = sandbox.stub(require('bcryptjs'), 'compare').resolves(true);
        const signStub = sandbox.stub(require('jsonwebtoken'), 'sign').returns('fake-jwt-token');

        const response = await request(app)
          .post('/api/utilisateurs/login')
          .send(loginData);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Connexion réussie');
        expect(response.body).to.have.property('token', 'fake-jwt-token');
        expect(findByEmailStub).to.have.been.calledWith('test@example.com');
        expect(compareStub).to.have.been.calledWith('Password123!', 'hashedpassword');
      });

      it('devrait retourner une erreur si identifiants incorrects', async () => {
        const loginData = {
          email: 'test@example.com',
          mot_de_passe: 'wrongpassword'
        };

        const user = {
          id: 1,
          email: 'test@example.com',
          mot_de_passe_hash: 'hashedpassword',
          type: 'Client',
          actif: 1
        };

        const findByEmailStub = sandbox.stub(Utilisateur, 'findByEmail').resolves(user);
        const compareStub = sandbox.stub(require('bcryptjs'), 'compare').resolves(false);

        const response = await request(app)
          .post('/api/utilisateurs/login')
          .send(loginData);

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Identifiants incorrects');
      });

      it('devrait retourner une erreur si compte désactivé', async () => {
        const loginData = {
          email: 'test@example.com',
          mot_de_passe: 'Password123!'
        };

        const user = {
          id: 1,
          email: 'test@example.com',
          mot_de_passe_hash: 'hashedpassword',
          type: 'Client',
          actif: 0 // compte désactivé
        };

        const findByEmailStub = sandbox.stub(Utilisateur, 'findByEmail').resolves(user);

        const response = await request(app)
          .post('/api/utilisateurs/login')
          .send(loginData);

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Votre compte a été désactivé');
      });
    });
  });

  describe('Salle API', () => {
    describe('POST /api/salles', () => {
      it('devrait créer une nouvelle salle avec des données valides', async () => {
        const salleData = {
          nom: 'Salle Test',
          description: 'Description de test',
          capacite: 50,
          prix_par_heure: 30,
          adresse: '123 Rue Test',
          ville: 'Paris',
          code_postal: '75001',
          equipements: ['WiFi', 'Projecteur']
        };

        // Mock utilisateur authentifié
        const mockUser = { utilisateur_id: 1 };
        const createStub = sandbox.stub(Salle, 'create').resolves(1);

        const response = await request(app)
          .post('/api/salles')
          .set('Authorization', 'Bearer fake-token')
          .send(salleData);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message', 'Salle créée avec succès');
        expect(response.body).to.have.property('salle_id', 1);
        expect(createStub).to.have.been.calledOnce;
      });

      it('devrait retourner une erreur sans authentification', async () => {
        const salleData = {
          nom: 'Salle Test',
          description: 'Description de test',
          capacite: 50,
          prix_par_heure: 30
        };

        const response = await request(app)
          .post('/api/salles')
          .send(salleData);

        expect(response.status).to.equal(401);
      });

      it('devrait retourner une erreur si données invalides', async () => {
        const invalidData = {
          nom: '', // nom vide
          capacite: -10, // capacité négative
          prix_par_heure: -5 // prix négatif
        };

        const response = await request(app)
          .post('/api/salles')
          .set('Authorization', 'Bearer fake-token')
          .send(invalidData);

        expect(response.status).to.equal(500);
      });
    });

    describe('GET /api/salles', () => {
      it('devrait retourner la liste des salles', async () => {
        const salles = [
          { id: 1, nom: 'Salle A', capacite: 30, prix_par_heure: 25 },
          { id: 2, nom: 'Salle B', capacite: 50, prix_par_heure: 40 }
        ];

        const findAllStub = sandbox.stub(Salle, 'findAll').resolves(salles);

        const response = await request(app)
          .get('/api/salles');

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf(2);
        expect(findAllStub).to.have.been.calledOnce;
      });
    });
  });

  describe('Réservation API', () => {
    describe('POST /api/reservations', () => {
      it('devrait créer une réservation avec des données valides', async () => {
        const reservationData = {
          salle_id: 1,
          heure_debut: '2024-06-15T14:00:00',
          heure_fin: '2024-06-15T16:00:00'
        };

        // Mock utilisateur authentifié
        const mockUser = { utilisateur_id: 1 };
        const mockSalle = { id: 1, prix_par_heure: 30 };
        
        const checkDisponibiliteStub = sandbox.stub(Reservation, 'checkDisponibilite').resolves(true);
        const findByIdStub = sandbox.stub(Salle, 'findById').resolves(mockSalle);
        const createReservationStub = sandbox.stub(Reservation, 'create').resolves(1);

        const response = await request(app)
          .post('/api/reservations')
          .set('Authorization', 'Bearer fake-token')
          .send(reservationData);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message', 'Réservation créée avec succès');
        expect(response.body).to.have.property('reservation_id', 1);
        expect(checkDisponibiliteStub).to.have.been.calledWith(1, '2024-06-15T14:00:00', '2024-06-15T16:00:00');
      });

      it('devrait retourner une erreur si salle non disponible', async () => {
        const reservationData = {
          salle_id: 1,
          heure_debut: '2024-06-15T14:00:00',
          heure_fin: '2024-06-15T16:00:00'
        };

        const checkDisponibiliteStub = sandbox.stub(Reservation, 'checkDisponibilite').resolves(false);

        const response = await request(app)
          .post('/api/reservations')
          .set('Authorization', 'Bearer fake-token')
          .send(reservationData);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Salle non disponible pour ces horaires');
      });

      it('devrait retourner une erreur si salle non trouvée', async () => {
        const reservationData = {
          salle_id: 999,
          heure_debut: '2024-06-15T14:00:00',
          heure_fin: '2024-06-15T16:00:00'
        };

        const checkDisponibiliteStub = sandbox.stub(Reservation, 'checkDisponibilite').resolves(true);
        const findByIdStub = sandbox.stub(Salle, 'findById').resolves(null);

        const response = await request(app)
          .post('/api/reservations')
          .set('Authorization', 'Bearer fake-token')
          .send(reservationData);

        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('message', 'Salle non trouvée');
      });

      it('devrait calculer correctement le prix total', async () => {
        const reservationData = {
          salle_id: 1,
          heure_debut: '2024-06-15T14:00:00',
          heure_fin: '2024-06-15T16:00:00'
        };

        const mockSalle = { id: 1, prix_par_heure: 30 };
        const checkDisponibiliteStub = sandbox.stub(Reservation, 'checkDisponibilite').resolves(true);
        const findByIdStub = sandbox.stub(Salle, 'findById').resolves(mockSalle);
        const createReservationStub = sandbox.stub(Reservation, 'create').resolves(1);

        const response = await request(app)
          .post('/api/reservations')
          .set('Authorization', 'Bearer fake-token')
          .send(reservationData);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('prix_total', 60); // 2 heures × 30€
      });
    });

    describe('GET /api/reservations', () => {
      it('devrait retourner les réservations de l\'utilisateur', async () => {
        const reservations = [
          { id: 1, utilisateur_id: 1, salle_id: 1, statut: 'Confirmee' },
          { id: 2, utilisateur_id: 1, salle_id: 2, statut: 'EnAttente' }
        ];

        const findByUserIdStub = sandbox.stub(Reservation, 'findByUserId').resolves(reservations);

        const response = await request(app)
          .get('/api/reservations')
          .set('Authorization', 'Bearer fake-token')
          .send();

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf(2);
        expect(findByUserIdStub).to.have.been.calledWith(1);
      });
    });
  });

  describe('Middleware d\'authentification', () => {
    it('devrait bloquer l\'accès sans token', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .send();

      expect(response.status).to.equal(401);
    });

    it('devrait bloquer l\'accès avec token invalide', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', 'Bearer invalid-token')
        .send();

      expect(response.status).to.equal(401);
    });

    it('devrait autoriser l\'accès avec token valide', async () => {
      // Mock du middleware d'authentification
      const mockUser = { utilisateur_id: 1, email: 'test@example.com' };
      const verifyStub = sandbox.stub(require('jsonwebtoken'), 'verify').returns(mockUser);

      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', 'Bearer valid-token')
        .send();

      expect(verifyStub).to.have.been.calledWith('valid-token');
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les formats d\'email', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'contact+test@company.org'
      ];

      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com'
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).to.be.true;
      });

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).to.be.false;
      });
    });

    it('devrait valider les numéros de téléphone français', () => {
      const validPhones = [
        '0612345678',
        '0723456789',
        '0123456789'
      ];

      const invalidPhones = [
        '123456789',
        '061234567', // trop court
        '06123456789', // trop long
        '0812345678' // 08 n\'est pas un indicatif mobile français
      ];

      const phoneRegex = /^0[1-7]\d{8}$/;

      validPhones.forEach(phone => {
        expect(phoneRegex.test(phone)).to.be.true;
      });

      invalidPhones.forEach(phone => {
        expect(phoneRegex.test(phone)).to.be.false;
      });
    });

    it('devrait valider les prix', () => {
      const validPrices = [10, 25.50, 100, 500];
      const invalidPrices = [0, -10, -5.5];

      validPrices.forEach(price => {
        expect(price).to.be.a('number');
        expect(price).to.be.above(0);
      });

      invalidPrices.forEach(price => {
        expect(price).to.be.a('number');
        expect(price).to.be.at.most(0);
      });
    });
  });
});
