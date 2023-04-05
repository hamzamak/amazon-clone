import Image from 'next/image'
import { StarIcon } from "@heroicons/react/24/solid"
import { useDispatch } from 'react-redux'
import { addToBasket, removeFromBasket } from '../slices/basketSlice'
function CheckoutProduct({ id, title, description, category, image, price, rating, hasPrime }) {
    const dispatch = useDispatch()
    const addItemToBasket = ()=>{
        const product = {
            id, title , description, category, image, price, rating,hasPrime
        }
        //sending the product as an action to redux store... the basket slice
        dispatch(addToBasket(product))
    }

    const removeItemFromBasket = ()=>{
        dispatch(removeFromBasket({id}))
    }
    return (
        <div className='grid grid-cols-5'>
            <Image src={image} width={200} height={200} style={{objectFit:"contain"}} alt='image product' />
            {/* Middle */}
            <div className='col-span-3 mx-5'>
                <p>{title} </p>
                <div className='flex'>
                    {
                        Array(Math.floor(rating.rate)).fill().map((_, i) => (
                            <StarIcon className="h-5 text-yellow-500 " key={Math.random() + i} />

                        ))
                    }
                </div>
                <p className='text-xs my-2 line-clamp-3'>{description} </p>
                <div className="mb-5">
                    £{price}
                </div>
                {
                    hasPrime && (
                        <div className="flex items-center -mt-5 space-x-2">
                            <img loading='lazy' className="w-12" src="https://links.papareact.com/fdw" alt="has prime" />
                            <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
                        </div>
                    )
                }

            </div>
            {/* right add/remove button */}
            <div className='flex flex-col space-y-2 my-auto justify-items-end '>
                <button className="mt-auto button" title='Add to Basket'  onClick={addItemToBasket} >
                    Add to Basket
                </button>
                <button className="mt-auto button" onClick={removeItemFromBasket}>
                    Remove from Basket
                </button>
            </div>
        </div>
    )
}

export default CheckoutProduct