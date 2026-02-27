import { expect } from 'chai';

describe('Tests de base', function() {
  it('devrait additionner correctement', function() {
    const result = 2 + 2;
    expect(result).to.equal(4);
  });

  it('devrait vérifier les types', function() {
    const message = 'Party Hoster';
    expect(message).to.be.a('string');
    expect(message.length).to.be.a('number');
  });

  it('devrait vérifier les tableaux', function() {
    const salles = ['Salle A', 'Salle B', 'Salle C'];
    expect(salles).to.be.an('array');
    expect(salles).to.have.lengthOf(3);
    expect(salles).to.include('Salle A');
  });
});
