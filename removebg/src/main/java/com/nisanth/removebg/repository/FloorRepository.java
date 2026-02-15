package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FloorRepository extends JpaRepository<Floor, Long> {
    List<Floor> findByDistrictIdAndTalukId(Long districtId, Long talukId);
}
