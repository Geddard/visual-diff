const firebase = require('firebase');
const bodyParser = require('body-parser');
require('firebase/database');

const firebaseConfig = {
  apiKey: 'AIzaSyCIVB0g51AzDFcgeOvx7dpQeKKPUqoDbSs',
  authDomain: 'visual-diff.firebaseapp.com',
  databaseURL: 'https://visual-diff.firebaseio.com',
  projectId: 'visual-diff',
  storageBucket: '',
  messagingSenderId: '586736836008',
  appId: '1:586736836008:web:9f12fe0ae660eabf'
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const save = (config) => {
  firebaseApp.database().ref("/tests").push({
    name: config.testName,
    url: config.testUrl,
    scenarios: config.steps
  });
};

exports.firebaseApp = firebaseApp;
exports.setFirebaseEndpoint = (app) => {
  app.post('/api/save', bodyParser.json(), (req, res) => {
    save(req.body);
    res.json("Saved");
  });
};
