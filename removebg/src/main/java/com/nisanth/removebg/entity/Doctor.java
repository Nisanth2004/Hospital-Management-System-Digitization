package com.nisanth.removebg.entity;

import com.nisanth.removebg.enumeration.*;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👨‍⚕️ Basic Info
    private String name;
    private String email;
    private String password;

    private String department;
    private String hospitalName;
    private String districtId;

    // 🏥 Work Info
    @Enumerated(EnumType.STRING)
    private WardType wardType;

    @Enumerated(EnumType.STRING)
    private Shift shift;

    @Enumerated(EnumType.STRING)
    private DoctorStatus status;

    private boolean onLeave;

    // ⏰ TIMING
    private LocalTime shiftStartTime;
    private LocalTime shiftEndTime;

    private LocalDateTime lastUpdated;
}
