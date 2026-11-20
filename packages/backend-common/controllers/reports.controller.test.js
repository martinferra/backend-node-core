const assert = require('node:assert/strict');
const test = require('node:test');
const { BSON } = require('bson');
const JSZip = require('jszip');
const { preBSONSerialization, postBSONDeserialization } = require('../../common/commonFunctions');
const reports = require('./reports.controller');

test('named ZIP responses are opt-in and survive the WebSocket BSON serialization', async () => {
  const user = { name: 'user' };
  const parameter = { value: 'data' };
  reports.setReportSpec('named-zip-test', {
    fileBaseName: 'reporte',
    specArray: [{
      reportType: 'pdf', fileBaseName: 'prueba', fileExt: 'pdf',
      getData: async (receivedUser, receivedParameter) => {
        assert.equal(receivedUser, user);
        assert.equal(receivedParameter, parameter);
        return Buffer.from('PDF content');
      }
    }]
  });
  const request = { reportId: 'named-zip-test', reportParams: [parameter], user };

  const legacy = await reports.getReport(request);
  assert.ok(legacy instanceof ArrayBuffer);
  assert.equal(Object.values((await JSZip.loadAsync(legacy)).files).filter(file => file.dir).length, 1);

  const named = await reports.getReport({ ...request, responseFormat: 'named' });
  assert.equal(named.format, 'named-report');
  assert.match(named.filename, /^reporte_\d{17}\.zip$/);
  const message = { type: 'object', payload: named };
  const decoded = postBSONDeserialization(BSON.deserialize(BSON.serialize(preBSONSerialization(message))));
  assert.equal(decoded.payload.filename, named.filename);
  assert.ok(decoded.payload.content instanceof ArrayBuffer);
  const zip = await JSZip.loadAsync(decoded.payload.content);
  const directories = Object.values(zip.files).filter(file => file.dir).map(file => file.name);
  assert.deepEqual(directories, [`${named.filename.slice(0, -4)}/`]);
  const files = Object.values(zip.files).filter(file => !file.dir);
  assert.equal(files.length, 1);
  assert.equal(await files[0].async('string'), 'PDF content');
});
