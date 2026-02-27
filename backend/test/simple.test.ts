import { expect } from 'chai';

describe('Test Simple', () => {
  it('devrait passer un test basique', () => {
    expect(2 + 2).to.equal(4);
  });

  it('devrait vérifier une chaîne', () => {
    const message = 'Party Hoster';
    expect(message).to.be.a('string');
    expect(message).to.equal('Party Hoster');
  });
});
