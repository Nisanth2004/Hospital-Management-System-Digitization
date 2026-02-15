package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.*;
import com.nisanth.removebg.repository.*;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/admin/navigation")
@RequiredArgsConstructor
@CrossOrigin
public class NavigationController {

    private final FloorRepository floorRepository;
    private final EquipmentRepository equipmentRepository;
    private final DistrictRepository districtRepository;
    private final TalukRepository talukRepository;


    @Value("${file.upload-dir}")
    private String uploadDir;

    // ==========================================
    // ✅ ADMIN APIs
    // ==========================================

    @PostMapping("/admin/floor")
    public Floor createFloor(
            @RequestParam String floorName,
            @RequestParam Long districtId,
            @RequestParam Long talukId,
            @RequestParam MultipartFile image
    ) throws Exception {

        District district = districtRepository.findById(districtId).orElseThrow();
        Taluk taluk = talukRepository.findById(talukId).orElseThrow();
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Files.copy(
                image.getInputStream(),
                uploadPath.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING
        );
        Floor floor = new Floor();
        floor.setImageUrl("uploads/" + fileName);



        floor.setFloorName(floorName);

        floor.setDistrict(district);
        floor.setTaluk(taluk);

        return floorRepository.save(floor);
    }

    @PostMapping("/admin/equipment")
    public Equipment addEquipment(@RequestBody Equipment equipment) {
        Floor floor = floorRepository.findById(
                equipment.getFloor().getId()).orElseThrow();

        equipment.setFloor(floor);
        return equipmentRepository.save(equipment);
    }

    @DeleteMapping("/admin/equipment/{id}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentRepository.deleteById(id);
    }

    // ==========================================
    // ✅ PATIENT APIs
    // ==========================================

    @GetMapping("/floors")
    public List<Floor> getFloors(
            @RequestParam Long districtId,
            @RequestParam Long talukId) {

        return floorRepository.findByDistrictIdAndTalukId(districtId, talukId);
    }

    // 🔥 GET ALL EQUIPMENTS (NO FLOOR FILTER)
    @GetMapping("/equipments")
    public List<Equipment> getAllEquipments(
            @RequestParam Long districtId,
            @RequestParam Long talukId) {

        return equipmentRepository
                .findByFloor_District_IdAndFloor_Taluk_Id(districtId, talukId);
    }

    // 🔥 GLOBAL SMART SEARCH
    @GetMapping("/search")
    public List<Equipment> search(
            @RequestParam Long districtId,
            @RequestParam Long talukId,
            @RequestParam String query) {

        return equipmentRepository
                .findByFloor_District_IdAndFloor_Taluk_IdAndNameContainingIgnoreCase(
                        districtId,
                        talukId,
                        query
                );
    }

    // 🔥 GET EQUIPMENT BY FLOOR
    @GetMapping("/equipments/{floorId}")
    public List<Equipment> getEquipments(@PathVariable Long floorId) {
        return equipmentRepository.findByFloorId(floorId);
    }

    @DeleteMapping("/admin/floor/{id}")
    public String deleteFloor(@PathVariable Long id) throws Exception {

        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Floor not found"));

        // ✅ Delete related equipments first (if cascade not enabled)
        equipmentRepository.deleteByFloorId(id);

        // ✅ Delete image file from uploads folder
        if (floor.getImageUrl() != null) {
            Path filePath = Paths.get(uploadDir)
                    .resolve(floor.getImageUrl().replace("uploads/", ""));

            Files.deleteIfExists(filePath);
        }

        // ✅ Delete floor
        floorRepository.deleteById(id);

        return "Floor deleted successfully";
    }

}
