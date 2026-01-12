package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.MedicalStock;
import com.nisanth.removebg.service.MedicalStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/medical-stock")
@RequiredArgsConstructor
public class MedicalStockController {

    private final MedicalStockService stockService;

    @PostMapping("/{districtId}")
    public MedicalStock addStock(
            @PathVariable Long districtId,
            @RequestBody MedicalStock stock) {
        return stockService.addStock(districtId, stock);
    }

    @GetMapping("/{districtId}")
    public List<MedicalStock> getStocks(@PathVariable Long districtId) {
        return stockService.getStocksByDistrict(districtId);
    }

    @GetMapping("/single/{id}")
    public MedicalStock getSingle(@PathVariable Long id) {
        return stockService.getStockById(id);
    }

    @PutMapping("/{id}")
    public MedicalStock update(@PathVariable Long id,
                               @RequestBody MedicalStock stock) {
        return stockService.updateStock(id, stock);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        stockService.deleteStock(id);
    }
}
