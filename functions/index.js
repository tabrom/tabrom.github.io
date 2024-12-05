// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });


// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// // Cloud Function to handle leaderboard updates
// exports.addScore = functions.https.onRequest((req, res) => {
//     const referer = req.headers.referer || '';
    
//     // Allow requests only from your GitHub Pages domain
//     if (referer.startsWith('https://tabrom.github.io')) {
//         const { name, score } = req.body;

//         // Validate input data
//         if (typeof name === 'string' && typeof score === 'number') {
//             admin.database().ref('leaderboard').push({ name, score })
//                 .then(() => res.status(200).send('Score added successfully'))
//                 .catch(error => res.status(500).send(error.message));
//         } else {
//             res.status(400).send('Invalid input');
//         }
//     } else {
//         res.status(403).send('Unauthorized');
//     }
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// functions.setGlobalOptions({ region: 'us-central1', runtime: 'nodejs18' });

exports.helloWorld = functions.https.onRequest((req, res) => {
    res.send("Hello, World!");
});


// Cloud Function to handle leaderboard updates
exports.addScore = functions.https.onRequest((req, res) => {
    const referer = req.headers.referer || '';
    
    // Allow requests only from your GitHub Pages domain
    if (referer.startsWith('https://tabrom.github.io')) {
        const { name, score } = req.body;

        // Validate input data
        if (typeof name === 'string' && typeof score === 'number') {
            admin.database().ref('leaderboard').push({ name, score })
                .then(() => res.status(200).send('Score added successfully'))
                .catch(error => res.status(500).send(error.message));
        } else {
            res.status(400).send('Invalid input');
        }
    } else {
        res.status(403).send('Unauthorized');
    }
});
