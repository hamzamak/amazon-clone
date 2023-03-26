import Product from './Product'
import React from 'react'
function ProductFeed({products}) {
    const hasPrime = true
  return (
    <div className='grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto'>
        {
            products.slice(0,4).map(({id , title, description,category,image,price,rating})=> (
                <Product key={id} id ={id} title={title} description={description} category={category} 
                image={image} price={price} rating={rating} hasPrime={hasPrime} />
            ))
        }
        <img className="md:col-span-full" src='https://links.papareact.com/dyz' alt='ad'/>
        <div className='md:col-span-2'>
        {
            products.slice(4,5).map(({id , title, description,category,image,price,rating})=> (
                <Product key={id} id ={id} title={title} description={description} category={category} 
                image={image} price={price} rating={rating} hasPrime={hasPrime}/>
            ))
        }
        </div>

        {
            products.slice(5,products.length).map(({id , title, description,category,image,price,rating})=> (
                <Product key={id} id ={id} title={title} description={description} category={category} 
                image={image} price={price} rating={rating} hasPrime={hasPrime} />
            ))
        }
    </div>
  )
}

export default ProductFeed