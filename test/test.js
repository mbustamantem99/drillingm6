const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../index.js'); // Cambiar '../server' a '../index' si el archivo principal se llama index.js
chai.use(chaiHttp);

describe('Pruebas API Anime', () => {
    
    // Prueba del endpoint GET /animes
    describe('GET /animes', () => {
        it('debería devolver una lista de animes', (done) => {
            chai.request(server)
                .get('/animes')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    // Prueba del endpoint POST /animes
    describe('POST /animes', () => {
        it('debería agregar un nuevo anime', (done) => {
            const nuevoAnime = {
                nombre: 'One Piece',
                genero: 'Aventura',
                episodios: 1000
            };

            chai.request(server)
                .post('/animes')
                .send(nuevoAnime)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('animes');
                    expect(res.body.animes.some(anime => anime.nombre === 'One Piece')).to.be.true;
                    done();
                });
        });
    });

});
