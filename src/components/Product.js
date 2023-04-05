import { StarIcon } from "@heroicons/react/24/solid"
import React from 'react'
import Image from "next/image"
import { useDispatch } from "react-redux"
import { addToBasket } from "../slices/basketSlice"
function Product({id , title, description,category,image,price,rating,hasPrime }) {

    const dispatch = useDispatch()
    const addItemToBasket = ()=>{
        const product = {
            id, title , description, category, image, price, rating,hasPrime
        }
        //sending the product as an action to redux store... the basket slice
        dispatch(addToBasket(product))
    }
  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
        <p className="absolute top-2 right-2 text-xs italic text-gray-400" >{category} </p>
        <Image src={image} width={120} height={120} className="mx-auto"  style={{objectFit:"contain",width:120,height:120}} alt="product"/>
        <h4 className="my-3">{title} </h4>
        <div className="flex">
            {
                Array(Math.floor(rating.rate)).fill().map((_,i)=>(
                    <StarIcon className="h-5 text-yellow-500" key={i} />
                    
                ) )
            }
        </div>
        <p className="text-xs my-2 line-clamp-2">{description} </p>
        <div className="mb-5">
        £{price}
        </div>
        {
            hasPrime && (
                <div className="flex items-center -mt-5 space-x-2">
                    <img  className="w-12" src="https://links.papareact.com/fdw" alt=""/>
                    <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
                </div>
            )
        }
        <button className="mt-auto button" onClick={addItemToBasket}>
            Add to Basket
        </button>


    </div>
  )
}

export default Product