package com.nisanth.removebg.service;

import com.nisanth.removebg.entity.District;
import com.nisanth.removebg.entity.MedicalStock;
import com.nisanth.removebg.repository.DistrictRepository;
import com.nisanth.removebg.repository.MedicalStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalStockService {

    private final MedicalStockRepository stockRepo;
    private final DistrictRepository districtRepo;

    public MedicalStock addStock(Long districtId, MedicalStock stock) {
        District district = districtRepo.findById(districtId)
                .orElseThrow(() -> new RuntimeException("District not found"));

        stock.setDistrict(district);
        return stockRepo.save(stock);
    }

    public List<MedicalStock> getStocksByDistrict(Long districtId) {
        return stockRepo.findByDistrictId(districtId);
    }

    public List<MedicalStock> searchByMedicine(Long districtId, String keyword) {
        return stockRepo.findByDistrictIdAndMedicineNameContainingIgnoreCase(
                districtId, keyword);
    }

    public List<MedicalStock> searchByCategory(Long districtId, String category) {
        return stockRepo.findByDistrictIdAndCategoryContainingIgnoreCase(
                districtId, category);
    }

    public MedicalStock getStockById(Long id) {
        return stockRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found"));
    }

    public MedicalStock updateStock(Long id, MedicalStock stock) {
        MedicalStock existing = getStockById(id);
        existing.setMedicineName(stock.getMedicineName());
        existing.setCategory(stock.getCategory());
        existing.setQuantity(stock.getQuantity());
        existing.setUnit(stock.getUnit());
        existing.setExpiryDate(stock.getExpiryDate());
        existing.setManufacturer(stock.getManufacturer());
        return stockRepo.save(existing);
    }

    public void deleteStock(Long id) {
        stockRepo.deleteById(id);
    }
}
