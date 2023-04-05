import moment from 'moment'
import React from 'react'

function Order({id ,amount , amountShipping,items,timestamp,images}) {
  return (
    <div className='relative border rounded-md'>
        <div className='flex items-center space-x-10 p-5 bg-gray-100 text-sm'>
            <div>
                <p className="font-bold text-xs">ORDER PLACED</p>
                <p>{moment.unix(timestamp).format('DD MMM YYYY')} </p>
            </div>

            <div>
                <p className="font-bold text-xs">Total</p>
                <p>£{amount} - Next Day Delivery {" "} £{amountShipping} </p>
            </div>

            <p className="whitespace-nowrap text-sm sm:text-xl self-end flex-1 text-right text-blue-500">
                {items.length} items
            </p>

            <p className='absolute top-2 right-2 w-40 lg:w-72 truncate text-xs whitespace-nowrap'>
                ORDERS #  {id}
            </p>

        </div>

        <div className='p-5 sm:p-10'>
            <div className='flex space-x-6 overflow-x-auto'>
                {
                    images.map((image,index) => (
                        <img key={Math.random() + index} src={image} alt="" className=' sm:h-32 h-20 object-contain '/>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Order