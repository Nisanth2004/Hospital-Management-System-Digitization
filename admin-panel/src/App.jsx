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
          path="/district/:districtId/medical-stock"
          element={<MedicalStock />}
        />
        <Route
  path="/district/:districtId/bed-management"
  element={<BedManagementAdmin />}
/>
<Route
  path="/district/:districtId/doctor-management--2"
  element={<DoctorManagementAdmin />}


  
/>

<Route path="/district/:districtId/doctor-management" element={<DoctorListAdmin />} />
<Route path="/admin/add-doctor/:districtId" element={<AddDoctorAdmin />} />

<Route path="/doctor/login" element={<DoctorLogin />} />
<Route path="/doctor/dashboard" element={<DoctorDashboard />} />
<Route path="/admin/edit-doctor/:doctorId" element={<EditDoctorAdmin />} />



      </Routes>
    </BrowserRouter>
  );
};

export default App;
