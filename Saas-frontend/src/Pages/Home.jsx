import React from 'react'
import Header from '../components/Header'


import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import TryNow from '../components/TryNow'
import PatientUsageSteps from '../components/PatientUsageSteps'

import SchemeUsageGuide from '../components/SchemeUsageGuide'
import GovtMedicalSchemes from './GovtMedicalSchemes'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-['Outfit']">
        {/* Hero section */}
        <Header/>

        {/* Background Removal steps section  */}
        <PatientUsageSteps/>

        {/*  Background Removal slider section sm */}
          <GovtMedicalSchemes/>
  <SchemeUsageGuide />

         {/*  Buy credit plan section  */}
         <Pricing/>

          {/*  User Testimonial section  */}
          <Testimonials/>

           {/*  Try Now section  */}
           <TryNow/>

        
      
    </div>
  )
}

export default Home
