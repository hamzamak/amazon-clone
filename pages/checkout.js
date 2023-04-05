
import Image from 'next/image'
import { useSelector } from "react-redux"
import { useSession } from "next-auth/react"
import { selectItems, selectTotal } from "@/src/slices/basketSlice"
import CheckoutProduct from "@/src/components/CheckoutProduct"
import Header from '@/src/components/Header'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
function Checkout() {
    const items= useSelector(selectItems)
    const { data: session } = useSession()
    const total = useSelector(selectTotal)
    const stripePromise =  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

    const createCheckoutSession = async () => {
      const stripe = await stripePromise;
      //Call the backend to create a checkout session ...
      const checkoutSession = await axios.post("/api/create-checkout-session", {
        items , 
        email : session.user.email
      })

      //Redirect user/customer to stripe checkout 
      const result =  await stripe.redirectToCheckout({
        sessionId : checkoutSession.data.id
      })
      if(result.error) alert(result.error.message) 
    }
  return (
    <div className="bg-gray-100">
        <Header/>

        <main className="lg:flex max-w-screen-xl mx-auto" >
           {/* left */}
           <div className="flex-grow m-5 shadow-sm">
             <Image src='https://links.papareact.com/ikj' width={1020} height={250} style={{objectFit:"contain"}} alt="annonce" priority={true} />
           
           <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
                {
                    items.length ===0 ? "Your Shopping Cart is Empty !"
                    : "Shopping Basket"
                }
            </h1>
            {
                items.map((item, i)=>{
                    return (
                        <CheckoutProduct key={i} id={item.id} title ={item.title} 
                        description={item.description} 
                        category={item.category} image={item.image}
                         price={item.price} rating ={item.rating}
                         hasPrime={item.hasPrime} />
                    )
                })
            }
           </div>
           </div>

            {/* right */}
          
              {
                items.length  > 0 && (
                  <div className="flex flex-col bg-white p-10 shadow-md">
                      <h2 className="whitespace-nowrap">Subtotal ( {items.length} items):
                      <span className="font-bold"> £{total.toFixed(2)} </span>
                       </h2>

                       <button onClick={createCheckoutSession} disabled={!session} className={`button mt-2 ${!session && 'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'}`}  >
                        {!session ? "Sign in to checkout" : "Proceed to checkout"}
                       </button>
                    </div>
                )
              }
       
        </main>
        
    </div>
  )
}

export default Checkout