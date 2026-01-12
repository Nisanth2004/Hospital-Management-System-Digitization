package com.nisanth.removebg.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "hospital_beds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 District Mapping
    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    private String hospitalName;

    private String wardType;   // ICU, General, Emergency

    private String bedNumber;  // ICU-01

    private String bedType;    // Oxygen, Ventilator, Normal

    private Boolean occupied;  // true / false

    private LocalDateTime expectedDischarge;

    private LocalDateTime lastUpdated;
}
