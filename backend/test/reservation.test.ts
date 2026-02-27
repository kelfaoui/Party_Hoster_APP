import { expect } from 'chai';
import sinon from 'sinon';

describe('Reservation Tests', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Calcul du prix', () => {
    it('devrait calculer le prix correctement pour 1 heure', () => {
      const prixParHeure = 50;
      const dureeHeures = 1;
      const prixTotal = prixParHeure * dureeHeures;
      
      expect(prixTotal).to.equal(50);
    });

    it('devrait calculer le prix avec des décimales', () => {
      const prixParHeure = 35.50;
      const dureeHeures = 3;
      const prixTotal = prixParHeure * dureeHeures;
      
      expect(prixTotal).to.equal(106.50);
    });
  });

  describe('Validation des dates', () => {
    it('devrait valider une date de début correcte', () => {
      const dateDebut = new Date('2024-06-15T14:00:00');
      const dateFin = new Date('2024-06-15T16:00:00');
      
      expect(dateDebut < dateFin).to.be.true;
    });

    it('devrait calculer la durée en heures', () => {
      const dateDebut = new Date('2024-06-15T14:00:00');
      const dateFin = new Date('2024-06-15T16:30:00');
      
      const dureeMs = dateFin.getTime() - dateDebut.getTime();
      const dureeHeures = dureeMs / (1000 * 60 * 60);
      
      expect(dureeHeures).to.equal(2.5);
    });

    it('devrait gérer les réservations sur plusieurs jours', () => {
      const dateDebut = new Date('2024-06-15T22:00:00');
      const dateFin = new Date('2024-06-16T02:00:00');
      
      // Ajouter un jour si la date de fin est avant la date de début
      let dateFinCalculee = new Date(dateFin);
      if (dateFinCalculee <= dateDebut) {
        dateFinCalculee.setDate(dateFinCalculee.getDate() + 1);
      }
      
      const dureeMs = dateFinCalculee.getTime() - dateDebut.getTime();
      const dureeHeures = dureeMs / (1000 * 60 * 60);
      
      expect(dureeHeures).to.equal(4);
    });
  });

  describe('Disponibilité', () => {
    interface Reservation {
      heure_debut: string;
      heure_fin: string;
    }

    it('devrait vérifier la disponibilité d\'une salle', () => {
      const reservationsExist: Reservation[] = [
        { heure_debut: '2024-06-15T14:00:00', heure_fin: '2024-06-15T16:00:00' },
        { heure_debut: '2024-06-15T17:00:00', heure_fin: '2024-06-15T19:00:00' }
      ];
      
      const nouvelleReservation: Reservation = {
        heure_debut: '2024-06-15T16:00:00',
        heure_fin: '2024-06-15T17:00:00'
      };
      
      // Simulation de vérification de disponibilité
      const estDisponible = !reservationsExist.some(reservation => {
        return (nouvelleReservation.heure_debut < reservation.heure_fin && 
                nouvelleReservation.heure_fin > reservation.heure_debut);
      });
      
      expect(estDisponible).to.be.true;
    });

    it('devrait détecter un conflit de réservation', () => {
      const reservationsExist: Reservation[] = [
        { heure_debut: '2024-06-15T14:00:00', heure_fin: '2024-06-15T16:00:00' }
      ];
      
      const nouvelleReservation: Reservation = {
        heure_debut: '2024-06-15T15:00:00',
        heure_fin: '2024-06-15T17:00:00'
      };
      
      // Simulation de détection de conflit
      const aConflit = reservationsExist.some(reservation => {
        return (nouvelleReservation.heure_debut < reservation.heure_fin && 
                nouvelleReservation.heure_fin > reservation.heure_debut);
      });
      
      expect(aConflit).to.be.true;
    });
  });
});
