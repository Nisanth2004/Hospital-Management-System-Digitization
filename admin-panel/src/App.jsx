import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DistrictSelection from "./pages/DistrictSelection";
import DistrictDashboard from "./pages/DistrictDashboard";
import MedicalStock from "./pages/MedicalStock";
import BedManagementAdmin from "./pages/BedManagementAdmin";
import DoctorManagementAdmin from "./pages/DoctorManagementAdmin";
import DoctorListAdmin from "./pages/DoctorListAdmin";
import AddDoctorAdmin from "./pages/admin/AddDoctorAdmin";
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import EditDoctorAdmin from "./pages/admin/EditDoctorAdmin";
import ComplaintList from "./pages/ComplaintList";
import AdminNavigationPage from "./pages/AdminNavigationPage";

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>

        {/* Home → District Selection */}
        <Route path="/" element={<DistrictSelection />} />

        {/* District Dashboard */}
        <Route path="/district/:districtId" element={<DistrictDashboard />} />

        {/* Medical Stock Management */}
       <Route
  path="/district/:districtId/taluk/:talukId/medical-stock"
  element={<MedicalStock />}
/>
  <Route
  path="/district/:districtId/taluk/:talukId/bed-management"
  element={<BedManagementAdmin />}
/>

<Route
  path="/district/:districtId/taluk/:talukId/complaints"
  element={<ComplaintList />}
/>
<Route
  path="/district/:districtId/taluk/:talukId/admin-navigation"
  element={<AdminNavigationPage />}
/>

<Route
  path="/district/:districtId/taluk/:talukId/doctor-management"
  element={<DoctorListAdmin />}
/>
<Route path="/admin/add-doctor/:districtId" element={<AddDoctorAdmin />} />

<Route path="/doctor/login" element={<DoctorLogin />} />
<Route path="/doctor/dashboard" element={<DoctorDashboard />} />
<Route path="/admin/edit-doctor/:doctorId" element={<EditDoctorAdmin />} />



      </Routes>
    </BrowserRouter>
  );
};

export default App;
