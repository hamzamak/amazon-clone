import db from '@/firebase'
import Header from '@/src/components/Header'
import Order from '@/src/components/Order'
import { collection, doc, getDocs, orderBy, query } from 'firebase/firestore'
import moment from 'moment/moment'
import { getSession, useSession } from 'next-auth/react'
import React from 'react'

function Orders({orders}) {
    const { data: session } = useSession()
  return (
    <div>
        <Header/>

        <main className='max-w-screen-lg mx-auto p-10'>
            <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">Your Orders</h1>
            {
                session ? (
                    <h2>x Orders</h2>
                ) : (
                    <h2>Please sign to see you orders</h2>
                )
            }
            <div className='mt-5 space-y-4'>
                {
                    orders?.map(({id ,amount , amountShipping,items,timestamp,images}) =>(
                        <Order key={id} id={id} amount={amount} amountShipping ={amountShipping} items={items} timestamp={timestamp} images={images}  />
                    ))
                }
            </div>
        </main>
    </div>
  )
}

export default Orders

// in getServerSideProps  we write a server code think like you are work with node
export async function getServerSideProps (context){
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    //Get the users logged in credentials ;

    // for server side to getSession in  next/auth we use getSession
    const session = await getSession(context) // context contain the request , response , all the other stuff

    
    if(!session) {
        return {
            props : {

            }
        }
    }

   // const userRef =  doc(db,'users' , (await session).user)
   const userCollection = collection(db, "users");
   const userRef = doc(userCollection, session.user.email); 
   //const q = query(collection(userRef, "messages"), orderBy('timestamp', 'desc'))
  //  const stripeOrders =   doc(db,'users' , (await session).user.email, 'orders')
    const q = query(collection(userRef,'orders'), orderBy('timestamp', 'desc'))

    //each request asynchronous so we need to do Promise.all
    const orders = await Promise.all(
        (await getDocs(q)).docs.map(async (order)=> ({
            id : order.id ,
            amount : order.data().amount ,
            amountShipping : order.data().amount_shipping ,
            images : order.data().images ,
            timestamp : moment(order.data().timestamp.toDate()).unix(),
            //we get the data from the async method and assign it to items key
            items : (
                await stripe.checkout.sessions.listLineItems(order.id , {
                    limit : 100 
                })
            ).data ,
        }))
    )

    return {
        props : {
            orders 
        }
    }
  }