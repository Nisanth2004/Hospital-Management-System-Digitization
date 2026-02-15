package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.Taluk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TalukRepository extends JpaRepository<Taluk, Long> {

    List<Taluk> findByDistrictId(Long districtId);

}
