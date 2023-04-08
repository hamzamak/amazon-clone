/**
 * In Stripe payment, a webhook is a mechanism for sending real-time notifications to your server about events that occur within your Stripe account.
 *  These events can include new charges, refunds, disputes, and many other things.
 */

import {buffer} from 'micro'
import * as admin from "firebase-admin"

// secure connection to firebase from backend
const serviceAccount = require("../../permissions.json");
const Mustache = require('mustache');
//const fs = require('fs');

// Read the JSON file
//const jsonFile = fs.readFileSync('../../permissions.json', 'utf8');
//const jsonData = JSON.parse(jsonFile);

// Define the Mustache template
const template = JSON.stringify(serviceAccount);

// Replace the placeholders with actual values
const replacements = {
    
  CLIENT_ID: process.env.CLIENT_ID,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  PRIVATE_KEY_ID: process.env.PRIVATE_KEY_ID,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  };
  
const renderedConfig = Mustache.render(template, replacements);


//console.log(JSON.parse(renderedConfig))

const app = !admin.apps.length ? admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(renderedConfig))
}) : admin.app();


const fulfilOrder = async (session)=> {
     console.log("fulfillment order : " + session.id);
    
    return app.firestore().
     collection('users').doc(session.metadata.email)
    .collection("orders").doc(session.id).set({
        amount: session.amount_total /100 ,
        amount_shipping : session.total_details.amount_shipping / 100 ,
        images : JSON.parse(session.metadata.images),
        timestamp : admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(()=> { console.log("success order : " + session.id + "added to db")})
    .catch(error => { console.log(`db Error: ${error.message}`)})
}

// establish connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_SIGNING_SECRET

export default async (req, res) => {
    if(req.method === "POST") {
        const requestBuffer = await buffer(req);
        const payload = requestBuffer.toString();
        const sig = req.headers['stripe-signature'];
        let event ;
        try {
            //verify that event posted from stripe
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (error) {
            console.log(error.message)
            res.status(400).send(`Webhook Error: ${error.message}`);
        }

        //handle the checkout.session.completed event
        if(event.type === 'checkout.session.completed'){
            const session = event.data.object;

            // fulfill the order ..

            return fulfilOrder(session)
            .then(()=> { res.status(200)})
            .catch(error => { res.status(400).send(`Webhook Error: ${error.message}`)})
        }
    }
}

export const config = {
    api : {
        bodyParser : false ,
        externalResolver : true
    }
}