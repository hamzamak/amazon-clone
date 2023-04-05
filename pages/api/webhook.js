/**
 * In Stripe payment, a webhook is a mechanism for sending real-time notifications to your server about events that occur within your Stripe account.
 *  These events can include new charges, refunds, disputes, and many other things.
 */

import {buffer} from 'micro'
import * as admin from "firebase-admin"

// secure connection to firebase from backend
const serviceAccount = require("../../permissions.json");

const app = !admin.apps.length ? admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}) : admin.app();


const fulfilOrder = async (session)=> {
  //   console.log("fulfillment order : " + session.id);
    
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