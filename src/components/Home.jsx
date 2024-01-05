
import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Map from './Map'
import Footer from './Footer'
import "./styles.css" 

const Home = () => {
    return (
        <div>
           <Navbar/>
           <Hero/>
           <Map onLocationSelect={null} mapType={"admin"}/>
           <Footer/>
        </div>
      )
}

export default Home