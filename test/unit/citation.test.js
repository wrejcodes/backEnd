process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const citation = require('../../models').citation;

// Set up different chai methods
const assert = chai.assert;
const expect = chai.expect;

// This number may exist in test data this const is only defined for
// reuse sake
const TRASH_ID = 21321;

const testData = require('../../data/citation_test_data');

chai.use(chaiHttp);

describe('citation', () => {
  // Preformed before each test (clears the data in the table)
  beforeEach(async () => {
    await citation.destroy({truncate: true});
  });

  describe('/citation GET', () => {
    it('Should return empty array when there is no citations', async () => {
      try {
        const res = await chai.request(server).get('/citation');
        // Test the headers
        expect(res.status).to.equal(200);

        // Test the response to have the appropriate structure
        expect(res.body.success).to.be.true;
        expect(res.body.err).to.be.null;
        expect(res.body.payload).to.be.an('array');
        expect(res.body.payload).to.be.empty;
      } catch (err) {
        assert.fail(true, false, err);
      }
    });

    it('Should return all citations', async () => {
      // NOTE: This test does not test mutations of given data
      try {
        await citation.bulkCreate(testData);

        const res = await chai.request(server).get('/citation');
        // Test the headers
        expect(res.status).to.equal(200);

        expect(res.body.payload).to.have.lengthOf(testData.length);
      } catch (err) {
        assert.fail(true, false, err);
      }
    });

    it('Should allow the user set a limit on entries returned', async () => {
      let res;
      try {
        await citation.bulkCreate(testData);
        res = await chai.request(server).get('/citation?limit=2');
        expect(res.body.payload.length).to.equal(2);
      } catch (err) {
        assert.fail(true, false, err);
      }

      try {
        res = await chai.request(server).get('/citation?limit=ohno');
      } catch (err) {
        expect(err.response.body.success).to.equal(false);
        expect(err.response.body.payload).to.be.null;
        expect(err.response.body.err).to.be.a('string');
      }
    });
  });

  describe('/citation POST', () => {
    it('Should have have appropriate headers', async () => {
      const testDataElem = testData[0];
      const res = await chai.request(server)
      .post('/citation')
      .send(testDataElem);

      expect(res.headers.location, 'Should have location header set')
            .to.match(new RegExp('/citation/*[0-9]'));
      expect(res.status).to.equal(201);
    });

    it('Should filter out extra fields', async () => {
      try {
        let testDataElem = testData[0];
        testDataElem['notValidProp'] = 'Please go away';
        const res = await chai.request(server)
        .post('/citation')
        .send(testDataElem);

        delete testDataElem.notValidProp;
        expect(res.body.payload).to.be.an('object');
        expect(res.body.payload).to.include(testDataElem);
        expect(res.body.payload).to.not.have.key('notValidProp');
      } catch (err) {
        assert.fail(true, false, err);
      }
    });
  });

  describe('/citation PUT', () => {
    it('Should return a 405', async () => {
      try {
        await chai.request(server)
        .put(`/citation`);
        assert.fail(true, false, 'Request should throw error');
      } catch (err) {
        expect(err.response.status).to.equal(405);
        expect(err.response.body.success).to.equal(false);
        expect(err.response.body.err).to.be.a('string');
        expect(err.response.body.payload).to.be.null;
      }
    });
  });

  describe('/citation PATCH', () => {
    it('Should return a 405', async () => {
      try {
        await chai.request(server)
        .patch(`/citation`);
        assert.fail(true, false, 'Request should throw error');
      } catch (err) {
        expect(err.response.status).to.equal(405);
        expect(err.response.body.success).to.equal(false);
        expect(err.response.body.err).to.be.a('string');
        expect(err.response.body.payload).to.be.null;
      }
    });
  });

  describe('/citation DELETE', () => {
    it('Should return a 405', async () => {
      try {
        await chai.request(server)
        .delete(`/citation`);
        assert.fail(true, false, 'Request should throw error');
      } catch (err) {
        expect(err.response.status).to.equal(405);
        expect(err.response.body.success).to.equal(false);
        expect(err.response.body.err).to.be.a('string');
        expect(err.response.body.payload).to.be.null;
      }
    });
  });

  describe('/citation/:id GET', () => {
    it('Should return one citation matching the id', async () => {
      try {
        const testDataElem = testData[0];
        const writeResult = await citation.create(testDataElem);

        const res = await chai.request(server)
        .get(`/citation/${writeResult.dataValues.id}`);

        expect(res.status).to.equal(200);
        expect(res.body.payload).to.be.an('object');
        expect(res.body.payload).to.include(testDataElem);
      } catch (err) {
        assert.fail(true, false, err);
      }
    });

    it('Should return 404 if non existant', async () => {
      try {
        await chai.request(server).get(`/citation/${TRASH_ID}`);
        assert.fail(true, false, 'GET request should have failed with 404');
      } catch (err) {
        expect(err.status).to.equal(404);
      }
    });
  });

  describe('/citation/:id POST', () => {
    it('Should reutrn a 404 when resource does not exist', async () => {
      try {
        await chai.request(server).post(`/citation/${TRASH_ID}`);
      } catch (err) {
        expect(err.response.status).to.equal(404);
      }
    });

    it('Should return a 409 if the resource exists', async () => {
      let writeResult;
      try {
        writeResult = await citation.create(testData[0]);
      } catch (err) {
        console.error(err);
        return;
      }

      try {
        await chai.request(server).post(
          `/citation/${writeResult.dataValues.id}`
        );
      } catch (err) {
        expect(err.response.status).to.equal(409);
      }
    });
  });

  describe('/citation/:id PUT', () => {
    it('Should return a 404 when non existant', async () => {
      try {
        await chai.request(server).put('/citation/12');
        assert.fail(true, false, 'PUT request should have failed with 404');
      } catch (err) {
          expect(err.response.status).to.equal(404);
      }
    });

    it('Should add the new data in body', async () => {
      const writeResult = await citation.create({});
      const res = await chai.request(server)
                  .put(`/citation/${writeResult.dataValues.id}`)
                  .send(testData[0]);
      expect(res.status).to.equal(200);
      expect(res.body.payload).to.include(testData[0]);
    });

    it('Should clear other values', async () => {
      const writeResult = await citation.create(testData[0]);
      const dataKeys = Object.keys(testData[0]);
      const updatedKey = dataKeys[0];
      const updatedValue = testData[1][updatedKey];
      let jsonToSend = {};
      jsonToSend[updatedKey] = updatedValue;
      const uncheckedFields = [updatedKey];
      try {
        const res = await chai.request(server)
                    .put(`/citation/${writeResult.dataValues.id}`)
                    .send(jsonToSend);
        expect(res.status).to.equal(200);
        expect(res.body.payload[updatedKey]).to.equal(updatedValue);
        dataKeys.forEach((val, idx) => {
          if (uncheckedFields.find((meta)=>meta===val) !== undefined) {
            return;
          }
          expect(res.body.payload[val]).to.be.null;
        });
      } catch (err) {
        assert.fail(true, false, err);
      }
    });
  });

  describe('/citation/:id PATCH', () => {
    it('Should return a 404 if non existent', async () => {
      try {
        await chai.request(server).patch(`/citation/${TRASH_ID}`);
      } catch (err) {
        expect(err.response.status).to.equal(404);
      }
    });

    it('Should return a 400 if the id is incorrect or unspecified',
    async () => {
      try {
        await chai.request(server).patch(`/citation/ohnoooo`);
      } catch (err) {
        console.log(err.response.err);
        expect(err.response.status).to.equal(400);
      }
    });

    it('Should update the values in body and not change others', async () => {
      let writeResult;
      try {
        writeResult = await citation.create(testData[0]);
      } catch (err) {
        console.error(err);
        return;
      }

      try {
        const res = await chai.request(server)
          .patch(`/citation/${writeResult.dataValues.id}`)
          .send(testData[1][1]);

        const keys = testData[0].keys();
        for (let i = 0; i < keys.length; i+=1) {
          if (i === 1) {
            expect(res.body.payload[keys[i]]).to.equal(testData[1][1]);
          } else {
            expect(res.body.payload[keys[i]]).to.equal(testData[0][keys[i]]);
          }
        }
      } catch (err) {

      }
    });
  });

  describe('/citation/:id DELETE', () => {
    it('Should remove the citation matching id', async () => {
      const writeResult = await citation.bulkCreate(testData);
      const indexToRemove = 1;
      const expectedIds = writeResult.filter(
        (val, idx) => (idx !== indexToRemove)
      ).map((elm) => elm.dataValues.id);

      const res = await chai.request(server)
            .delete(`/citation/${writeResult[indexToRemove].dataValues.id}`);
      expect(res.status).to.equal(200);
      const allcitations = (await citation.findAll()).map(
        (elm) => elm.dataValues.id
      );
      expect(allcitations).to.include.members(expectedIds);
      expect(allcitations).to.not.include(
        writeResult[indexToRemove].dataValues.id
      );
    });
  });
}); // End of citation describe
