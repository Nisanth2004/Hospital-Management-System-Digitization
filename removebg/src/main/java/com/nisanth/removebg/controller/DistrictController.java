package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.District;
import com.nisanth.removebg.repository.DistrictRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/districts")
@RequiredArgsConstructor
public class DistrictController {

    private final DistrictRepository districtRepo;

    @GetMapping
    public List<District> getAllDistricts() {
        return districtRepo.findAll();
    }

    @GetMapping("/{id}")
    public District getDistrict(@PathVariable Long id) {
        return districtRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("District not found"));
    }
}
