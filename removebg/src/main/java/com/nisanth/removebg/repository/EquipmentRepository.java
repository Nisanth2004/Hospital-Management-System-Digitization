package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByNameContainingIgnoreCase(String name);

    List<Equipment> findByFloorId(Long floorId);

    // 🔥 GLOBAL SEARCH (district + taluk)
    List<Equipment> findByFloor_District_IdAndFloor_Taluk_IdAndNameContainingIgnoreCase(
            Long districtId,
            Long talukId,
            String name
    );

    // 🔥 GET ALL EQUIPMENTS FOR HOSPITAL
    List<Equipment> findByFloor_District_IdAndFloor_Taluk_Id(
            Long districtId,
            Long talukId
    );

    void deleteByFloorId(Long floorId);

}
