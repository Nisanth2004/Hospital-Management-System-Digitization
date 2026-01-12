package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.*;
import com.nisanth.removebg.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/beds")
@RequiredArgsConstructor
public class BedAdminController {

    private final BedRepository bedRepo;
    private final DistrictRepository districtRepo;

    // ➕ Add Bed
    @PostMapping("/{districtId}")
    public Bed addBed(@PathVariable Long districtId, @RequestBody Bed bed) {
        District district = districtRepo.findById(districtId).orElseThrow();
        bed.setDistrict(district);
        bed.setLastUpdated(LocalDateTime.now());
        return bedRepo.save(bed);
    }

    // ✏ Update Bed
    @PutMapping("/{bedId}")
    public Bed updateBed(@PathVariable Long bedId, @RequestBody Bed updatedBed) {
        Bed bed = bedRepo.findById(bedId).orElseThrow();

        bed.setOccupied(updatedBed.getOccupied());

        // ✔ Only set discharge if occupied
        if (Boolean.TRUE.equals(updatedBed.getOccupied())) {
            bed.setExpectedDischarge(updatedBed.getExpectedDischarge());
        } else {
            bed.setExpectedDischarge(null); // auto clear
        }

        bed.setLastUpdated(LocalDateTime.now());
        return bedRepo.save(bed);
    }



    // ❌ Delete Bed
    @DeleteMapping("/{bedId}")
    public void deleteBed(@PathVariable Long bedId) {
        bedRepo.deleteById(bedId);
    }

    // 📋 List Beds
    @GetMapping("/{districtId}")
    public List<Bed> getBeds(@PathVariable Long districtId) {
        District district = districtRepo.findById(districtId).orElseThrow();
        return bedRepo.findByDistrict(district);
    }
}
