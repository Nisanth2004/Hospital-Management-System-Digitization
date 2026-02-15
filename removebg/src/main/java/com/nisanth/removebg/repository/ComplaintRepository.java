package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByDistrictId(Long districtId);
    List<Complaint> findByTalukId(Long talukId);
}
