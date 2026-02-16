package com.nisanth.removebg.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tokens")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="district_id")
    private Long districtId;

    private Long doctorId;
    private Long patientId;

    private LocalDateTime bookedAt;    // when patient booked
    private LocalDateTime tokenTime;   // assigned visit time

    private String status; // BOOKED, COMPLETED, CANCELLED
    private String reason; // reason for visit
    private String reportFileName;
}
