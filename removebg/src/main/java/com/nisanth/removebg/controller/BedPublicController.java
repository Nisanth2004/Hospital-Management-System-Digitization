package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.Bed;
import com.nisanth.removebg.entity.District;
import com.nisanth.removebg.repository.BedRepository;
import com.nisanth.removebg.repository.DistrictRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/beds")
@RequiredArgsConstructor
public class BedPublicController {

    private final BedRepository bedRepo;
    private final DistrictRepository districtRepo;

    @GetMapping("/{districtId}")
    public List<Bed> viewBeds(@PathVariable Long districtId) {
        District district = districtRepo.findById(districtId).orElseThrow();
        return bedRepo.findByDistrict(district);
    }
}
