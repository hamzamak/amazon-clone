import Banner from "@/src/components/Banner";
import Header from "@/src/components/Header";
import ProductFeed from "@/src/components/ProductFeed";
import Head from "next/head";

export default function Home({products}) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>
      
      <Header/>

      <main className="max-w-screen-xl  mx-auto">
        {/* Banner */}
        <Banner/>
        {/* ProductFeed */}
        <ProductFeed products={products}/>
      </main>
      
  
    </div>
  )
}

//this component is no longer a static page it needs to have that middle server
// step so we saying please calculate or do something on the server first then
// deliver to user (browser) rather that just sending the entire site to user (browser)
export async function getServerSideProps (context){
  const products = await fetch('https://fakestoreapi.com/products').then(
    (response) => response.json()
  )
  return {
    props: {
      products
    }, // will be passed to the page component as props
  }

}
