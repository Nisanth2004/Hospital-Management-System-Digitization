package com.nisanth.removebg.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long districtId;
    private Long talukId;

    private String citizenName;
    private String mobileNumber;
    private String hospitalName;

    private String category;

    @Column(length = 2000)
    private String description;

    private String imagePath;

    private String priority; // LOW, MEDIUM, HIGH
    private String status;   // PENDING, IN_PROGRESS, RESOLVED, REJECTED

    private String adminRemark;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
