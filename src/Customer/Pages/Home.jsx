import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import cafeAmbience from "../../assets/Carousel Image.png"
import Footer from '..//Components/Footer.jsx'
import { Link } from 'react-router-dom'

const  Home = () => {
  return (
    <div>
    <Navbar />  
    <div>
    <h1 className='text-6xl font-bold text-center mt-10'>Welcome to Iman Cafe</h1>
    <p className='text-2xl text-center mt-4 text-gray-600'>Experience the <span className='text-red-500 font-bold'>Best of the Best</span> with us</p>
    <div className='flex justify-center mt-10'>
      <img src={cafeAmbience} alt="Cafe Ambience" className='w-3/4 rounded-lg shadow-lg '/>
    </div>
    <section id='About' className='max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>About Iman Cafe</h2>
      <p className='text-gray-700 leading-relaxed text-center'>
        At Iman Cafe, we believe in serving more than just food and drinks. We offer an experience that delights all your senses. From the aroma of freshly brewed coffee to the cozy ambiance, every detail is crafted to make you feel at home. Our menu features a variety of gourmet dishes and artisanal beverages made from the finest ingredients. Whether you're here for a quick bite or a leisurely meal, we promise to make your visit memorable.
      </p>
    </section>
    <div className='text-center mt-10 mb-10'>
      <Link to="/Menu" className='bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-all shadow-md font-semibold'>Explore Our Menu</Link>      
    </div>
    </div>
    <div className='max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>Customer Reviews</h2>
      <div className='space-y-4'>
        <div className='border-b pb-4'>
          <p className='text-gray-700'><strong>John Doe:</strong> "The ambiance is amazing and the coffee is the best I've ever had!"</p>
        </div>
        </div>
        </div>
    <Footer />
    </div>
  )
}
export default Home;
