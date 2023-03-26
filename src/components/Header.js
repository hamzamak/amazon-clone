import React from 'react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import { signIn , signOut, useSession  } from 'next-auth/react'
import {Bars3Icon ,MagnifyingGlassIcon  , ShoppingCartIcon} from '@heroicons/react/24/outline'

import { useSelector } from 'react-redux'
import { selectItems } from '../slices/basketSlice'
function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const items= useSelector(selectItems)

  return (
    <header>
        {/* Top nav */}
        <div className='flex items-center bg-amazon_blue p-1 flex-grow py-2'>
            <div className='mt-2 flex items-center flex-grow sm:flex-grow-0'>
                <Image src='https://links.papareact.com/f90' width={150} height={40} style={{objectFit:"contain",width :150, height :40}} alt='logo amazon' className='cursor-pointer' onClick={()=> router.push('/')} priority />
            </div>
            {/* Search Bar  */}
            <div className='hidden sm:flex h-10 items-center rounded-md bg-yellow-400 hover:bg-yellow-500 flex-grow cursor-pointer'>
                <input type='text' className='flex-grow h-full p-2 w-6 flex-shrink rounded-l-md focus:outline-none px-4'/>
                <MagnifyingGlassIcon color='white' className='h-12 p-4' />
            </div>

            {/* Right  */}
           <div className='text-white flex items-center text-xs space-x-6 mx-6'> 
           <div className='link' onClick={!session ? signIn : signOut}>
              <p> 
                {
                  session ? 'Hello '  + session.user.name : "Sign In"
                }
              </p>
              <p className='font-extrabold md:text-sm' >Account & Lists</p>
            </div>
            <div className='link'>  
              <p>Return</p>
              <p className='font-extrabold md:text-sm'>& Orders</p>
            </div>
            <div className='relative link flex items-center' onClick={()=> router.push('/checkout')}>
              <span className='bg-yellow-400 w-4 h-4 rounded-full text-center text-black absolute top-0 right-0 md:right-10'>
                {
                  items.length
                }
              </span>
              <ShoppingCartIcon className='h-10'/>
              <p className='hidden md:inline font-extrabold md:text-sm mt-2'>Baskets</p>
            </div>
           </div>
        </div>

        {/* Bottom nav */}
        <div className='flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-white text-sm'>
          <p className='link flex items-center'>
            <Bars3Icon className='h-6 mr-1'/>
            All </p>
            <p className='link' >Prime Video</p>
            <p className='link' >Amazon Business</p>
            <p className='link' >Today&apos;s Deals</p>
            <p className='link hidden lg:inline-flex' >Electronics</p>
            <p className='link hidden lg:inline-flex' >Food & Grocery</p>
            <p className='link hidden lg:inline-flex' >Prime</p>
            <p className='link hidden lg:inline-flex' >Buy Again</p>
            <p className='link hidden lg:inline-flex' >Health & Personal Care</p>
          

        </div>
    </header>
  )
}

export default Header