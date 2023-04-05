const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req,res) => {
    const{items , email} = req.body ;
   
    const transformedItems = items.map((item)=> ({
      
        price_data : {
            currency: 'gbp',
            product_data: {
              name: item.title,
              description : item.description,
              images : [item.image]
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
    }))

    const session = await stripe.checkout.sessions.create({
     // payment_method_types : ['card'],
      line_items: transformedItems,
      shipping_address_collection : {
        allowed_countries : ['US', 'CA', 'GB']
      },
      shipping_options: [{shipping_rate: 'shr_1MqegaJQz3T6QzXtI5Kr6qUO'}],
      mode: 'payment',
      success_url: `${process.env.HOST}/success`,
      cancel_url: `${process.env.HOST}/checkout`,
      metadata : { //additional information
        email ,
        images : JSON.stringify(items.map(item => item.image))
      }
    });
  
    res.status(200).json({id : session.id });

}