package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.MedicalStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalStockRepository extends JpaRepository<MedicalStock, Long> {

    List<MedicalStock> findByDistrictId(Long districtId);
    List<MedicalStock> findByDistrictIdAndMedicineNameContainingIgnoreCase(
            Long districtId, String medicineName);

    List<MedicalStock> findByDistrictIdAndCategoryContainingIgnoreCase(
            Long districtId, String category);
}
