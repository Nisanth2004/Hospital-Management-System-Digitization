package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.Taluk;
import com.nisanth.removebg.repository.TalukRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/taluks")
@RequiredArgsConstructor
@CrossOrigin
public class TalukController {

    private final TalukRepository talukRepo;

    // Get Taluks by District
    @GetMapping("/district/{districtId}")
    public List<Taluk> getTaluksByDistrict(@PathVariable Long districtId) {
        return talukRepo.findByDistrictId(districtId);
    }
}
