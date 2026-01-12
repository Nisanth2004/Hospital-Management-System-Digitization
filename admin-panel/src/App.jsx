import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DistrictSelection from "./pages/DistrictSelection";
import DistrictDashboard from "./pages/DistrictDashboard";
import MedicalStock from "./pages/MedicalStock";
import BedManagementAdmin from "./pages/BedManagementAdmin";

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

      </Routes>
    </BrowserRouter>
  );
};

export default App;
