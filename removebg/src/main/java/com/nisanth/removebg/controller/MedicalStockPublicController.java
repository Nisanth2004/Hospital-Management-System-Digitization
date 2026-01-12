package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.MedicalStock;
import com.nisanth.removebg.service.MedicalStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/medical-stock")
@RequiredArgsConstructor
public class MedicalStockPublicController {

    private final MedicalStockService stockService;

    @GetMapping("/{districtId}")
    public List<MedicalStock> getAll(@PathVariable Long districtId) {
        return stockService.getStocksByDistrict(districtId);
    }

    @GetMapping("/{districtId}/search")
    public List<MedicalStock> search(
            @PathVariable Long districtId,
            @RequestParam String keyword) {

        return stockService.searchByMedicine(districtId, keyword);
    }
}
