import { expect } from 'chai';
import sinon from 'sinon';

describe('Utilisateur Tests', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Validation email', () => {
    it('devrait valider un email correct', () => {
      const email = 'test@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test(email)).to.be.true;
    });

    it('devrait rejeter un email incorrect', () => {
      const email = 'email.invalide';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test(email)).to.be.false;
    });
  });

  describe('Validation mot de passe', () => {
    it('devrait valider un mot de passe fort', () => {
      const motDePasse = 'Password123!';
      const minLength = 8;
      const hasNumber = /\d/.test(motDePasse);
      const hasSpecialChar = /[!@#$%^&*]/.test(motDePasse);
      
      expect(motDePasse.length).to.be.at.least(minLength);
      expect(hasNumber).to.be.true;
      expect(hasSpecialChar).to.be.true;
    });

    it('devrait rejeter un mot de passe faible', () => {
      const motDePasse = '123';
      const minLength = 8;
      
      expect(motDePasse.length).to.be.lessThan(minLength);
    });
  });

  describe('Validation téléphone', () => {
    it('devrait valider un numéro français', () => {
      const telephone = '0123456789';
      const phoneRegex = /^0[1-9]\d{8}$/;
      
      expect(phoneRegex.test(telephone)).to.be.true;
    });

    it('devrait rejeter un numéro invalide', () => {
      const telephone = '123456';
      const phoneRegex = /^0[1-9]\d{8}$/;
      
      expect(phoneRegex.test(telephone)).to.be.false;
    });
  });

  describe('Gestion des rôles', () => {
    it('devrait avoir les rôles valides', () => {
      const rolesValidos = ['Client', 'Proprietaire', 'Administrateur'];
      const role = 'Client';
      
      expect(rolesValidos).to.include(role);
    });

    it('devrait rejeter un rôle invalide', () => {
      const rolesValidos = ['Client', 'Proprietaire', 'Administrateur'];
      const role = 'RoleInvalide';
      
      expect(rolesValidos).to.not.include(role);
    });
  });
});
