package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    // Get tokens of a doctor on a particular day
    List<Token> findByPatientId(Long patientId);
    List<Token> findByDoctorIdAndTokenTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

    List<Token> findByDoctorId(Long doctorId);


    List<Token> findByDistrictId(Long districtId);

    List<Token> findByDoctorIdAndStatus(Long doctorId, String status);

    @Query("""
       SELECT HOUR(t.createdAt), COUNT(t)
       FROM Token t
       WHERE t.districtId = :districtId
       GROUP BY HOUR(t.createdAt)
    """)
    List<Object[]> getHourlyTokenStats(@Param("districtId") Long districtId);
}
