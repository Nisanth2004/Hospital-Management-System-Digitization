package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.Bed;
import com.nisanth.removebg.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BedRepository extends JpaRepository<Bed, Long> {

    List<Bed> findByDistrict(District district);

    List<Bed> findByDistrictAndOccupiedFalse(District district);
}
