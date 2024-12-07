const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: 'https://tabrom.github.io' });

admin.initializeApp();

const db = admin.database();

exports.helloWorld = functions.https.onRequest((req, res) => {
    res.send("Hello, World!");
});

exports.addScore = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const referer = req.get('Referer');
        if (!referer || !referer.startsWith('https://tabrom.github.io')) {
            return res.status(403).send('Forbidden: Invalid Referer');
        }

        const { name, score, competition, timestamp } = req.body;
        const newScoreRef = db.ref('leaderboard').push();
        newScoreRef.set({ name, score, competition, timestamp })
            .then(() => res.status(200).send('Score added successfully'))
            .catch(error => res.status(500).send('Error adding score: ' + error.message));
    });
});

exports.getLeaderboard = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(405).send('Method Not Allowed');
        }

        const referer = req.get('Referer');
        if (!referer || !referer.startsWith('https://tabrom.github.io')) {
            return res.status(403).send('Forbidden: Invalid Referer');
        }

        const competition = req.query.competition;
        if (!competition) {
            return res.status(400).send('Bad Request: Missing competition parameter');
        }

        db.ref('leaderboard').orderByChild('competition').equalTo(competition).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const leaderboard = Object.keys(data).map(key => data[key]);
                    res.status(200).json(leaderboard);
                } else {
                    res.status(404).send('No data available');
                }
            })
            .catch(error => res.status(500).send('Error fetching leaderboard: ' + error.message));
    });
});
