

import { Routes,Route } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import MenuBar from './components/MenuBar'
import Home from './Pages/Home'
import { Toaster } from 'react-hot-toast'
import UserSyncHandler from './components/UserSyncHandler'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import Result from './Pages/Result'
import BuyCredits from './Pages/BuyCredits'
import DistrictListUser from './Pages/user/DistrictListUser'
import DistrictDashboardUser from './Pages/user/DistrictDashboardUser'
import MedicalStockUser from './Pages/user/MedicalStockUser'
import PublicHome from './Pages/PublicHome'
import BedAvailabilityUser from './Pages/user/BedAvailabilityUser'
import GovtMedicalSchemes from './Pages/GovtMedicalSchemes'
import SchemeDetails from './Pages/SchemeDetails'
import DistrictDoctorListUser from './Pages/user/DistrictDoctorListUser'
import TokenBooking from './Pages/user/TokenBooking'
import TokenDetails from './Pages/user/TokenDetails'
import TokenList from './Pages/user/TokenList'
import TalukListUser from './Pages/user/TalukListUser'
import RaiseComplaint from './Pages/user/RaiseComplaint'
import UserComplaintHistory from './Pages/user/UserComplaintHistory'
import NavigationPage from './Pages/user/NavigationPage'
import AdvancedNavigationPage from './Pages/AdvancedNavigationPage'



function App() {
  return (
    <div>
      <UserSyncHandler/>
      <MenuBar/>
      <Toaster/>
      <Routes>
              {/* PUBLIC HOME */}
        <Route
          path="/"
          element={
            <>
              <SignedOut>
                <PublicHome />
              </SignedOut>

              <SignedIn>
                <Home />
              </SignedIn>
            </>
          }
        />
         <Route path="/districts" element={<DistrictListUser />} />
         <Route path="/" element={<GovtMedicalSchemes />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />
<Route
  path="/districts/:districtId/taluk/:talukId"
  element={<DistrictDashboardUser />}
/>

<Route
  path="/district/:districtId/taluk/:talukId/medical-stock"
  element={<MedicalStockUser />}
/>
<Route
  path="/district/:districtId/taluk/:talukId/beds"
  element={<BedAvailabilityUser />}
/>
<Route
  path="/district/:districtId/taluk/:talukId/navigation"
  element={<AdvancedNavigationPage />}
/>

<Route
  path="/user/complaints/:talukId"
  element={<UserComplaintHistory />}
/>

<Route
  path="/district/:districtId/taluk/:talukId/complaint"
  element={<RaiseComplaint />}
/>
<Route
  path="/districts/:districtId/taluks"
  element={<TalukListUser />}
/>
<Route
  path="/district/:districtId/taluk/:talukId/doctors"
  element={<DistrictDoctorListUser />}
/>
  <Route path="/token-details" element={<TokenDetails />} />
<Route path="/:districtId/token-booking" element={<TokenBooking />} />
<Route path="/my-tokens" element={<TokenList patientId={1} />} /> 

            <Route path='/pricing' element={<BuyCredits/>}></Route>
        <Route path='/result' element={
          <>
          <SignedIn>
            <Result/>
          </SignedIn>

          <SignedOut>
            <RedirectToSignIn/>
          </SignedOut>
          </>
        }  />
      </Routes>
      <Footer/>

    </div>
  )
}

export default App
