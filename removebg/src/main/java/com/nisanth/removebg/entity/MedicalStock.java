package com.nisanth.removebg.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "medical_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    private String medicineName;
    private String category;
    private Integer quantity;
    private String unit;
    private LocalDate expiryDate;
    private String manufacturer;
}
