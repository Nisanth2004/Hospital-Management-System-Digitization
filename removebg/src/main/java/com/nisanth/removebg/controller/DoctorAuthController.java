package com.nisanth.removebg.controller;

import com.nisanth.removebg.dto.LoginRequest;
import com.nisanth.removebg.entity.Doctor;
import com.nisanth.removebg.enumeration.DoctorStatus;
import com.nisanth.removebg.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class DoctorAuthController {

    private final DoctorRepository repo;

    public DoctorAuthController(DoctorRepository repo) {
        this.repo = repo;
    }

    // ============================
    // 🔐 DOCTOR LOGIN
    // ============================
    @PostMapping("/doctor/login")
    public Doctor login(@RequestBody LoginRequest req) {

        Doctor doctor = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getPassword().equals(req.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return doctor;
    }

    // ============================
    // 🟢 UPDATE STATUS
    // ============================
    @PutMapping("/doctor/status")
    public Doctor updateStatus(
            @RequestParam String email,
            @RequestParam DoctorStatus status
    ) {
        Doctor doctor = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setStatus(status);
        doctor.setLastUpdated(LocalDateTime.now());

        return repo.save(doctor);
    }

    // ============================
    // ⏰ UPDATE SHIFT TIMING
    // ============================
    @PutMapping("/doctor/timing")
    public Doctor updateTiming(
            @RequestParam String email,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime
    ) {
        Doctor doctor = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setShiftStartTime(startTime);
        doctor.setShiftEndTime(endTime);
        doctor.setLastUpdated(LocalDateTime.now());

        return repo.save(doctor);
    }

    // ============================
    // 🏖 APPLY / REMOVE LEAVE
    // ============================
    @PutMapping("/doctor/leave")
    public Doctor updateLeave(
            @RequestParam String email,
            @RequestParam boolean onLeave
    ) {
        Doctor doctor = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setOnLeave(onLeave);

        if (onLeave) {
            doctor.setStatus(DoctorStatus.OFF_DUTY);
        } else {
            doctor.setStatus(DoctorStatus.AVAILABLE);
        }

        doctor.setLastUpdated(LocalDateTime.now());

        return repo.save(doctor);
    }

    // ============================
    // 🔑 CHANGE PASSWORD
    // ============================
    @PutMapping("/doctor/password")
    public String changePassword(
            @RequestParam String email,
            @RequestParam String newPassword
    ) {
        Doctor doctor = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setPassword(newPassword);
        doctor.setLastUpdated(LocalDateTime.now());

        repo.save(doctor);
        return "Password updated successfully";
    }

    // ============================
    // 📝 UPDATE BASIC PROFILE
    // ============================
    @PutMapping("/doctor/profile")
    public Doctor updateProfile(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String department
    ) {
        Doctor doctor = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setName(name);
        doctor.setDepartment(department);
        doctor.setLastUpdated(LocalDateTime.now());

        return repo.save(doctor);
    }
}
