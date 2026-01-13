package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.Doctor;
import com.nisanth.removebg.enumeration.DoctorStatus;
import com.nisanth.removebg.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
@CrossOrigin("*")
public class DoctorAdminController {

    private final DoctorRepository repo;

    public DoctorAdminController(DoctorRepository repo) {
        this.repo = repo;
    }

    // ➕ ADD DOCTOR
    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        doctor.setStatus(DoctorStatus.AVAILABLE); // default
        doctor.setLastUpdated(LocalDateTime.now());
        return repo.save(doctor);
    }

    // 📋 VIEW DOCTORS BY DISTRICT (ADMIN READ-ONLY STATUS)
    @GetMapping("/{districtId}")
    public List<Doctor> getDoctors(@PathVariable String districtId) {
        return repo.findByDistrictId(districtId);
    }
    @GetMapping("/id/{id}")
    public Doctor getDoctorById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // ✏️ UPDATE DOCTOR DETAILS (NO STATUS)
    @PutMapping("/{id}")
    public Doctor updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor updated
    ) {
        Doctor d = repo.findById(id).orElseThrow();

        d.setName(updated.getName());
        d.setDepartment(updated.getDepartment());
        d.setHospitalName(updated.getHospitalName());
        d.setWardType(updated.getWardType());
        d.setShift(updated.getShift());
        d.setShiftStartTime(updated.getShiftStartTime());
        d.setShiftEndTime(updated.getShiftEndTime());

        d.setLastUpdated(LocalDateTime.now());
        return repo.save(d);
    }

    // 🔑 RESET PASSWORD (ADMIN)
    @PutMapping("/{id}/reset-password")
    public Doctor resetPassword(
            @PathVariable Long id,
            @RequestParam String newPassword
    ) {
        Doctor d = repo.findById(id).orElseThrow();
        d.setPassword(newPassword);
        d.setLastUpdated(LocalDateTime.now());
        return repo.save(d);
    }

    // 🗑 DELETE DOCTOR
    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // 🌍 PUBLIC – DOCTOR AVAILABILITY (PATIENT VIEW)
    @GetMapping("/public/district/{districtId}")
    public List<Doctor> getDoctorsForPublic(@PathVariable String districtId) {
        return repo.findByDistrictId(districtId);
    }
    // 🌍 PUBLIC – GET ALL DEPARTMENTS (for filters)
    @GetMapping("/public/departments")
    public List<String> getAllDepartments() {
        // fetch all doctors
        List<Doctor> doctors = repo.findAll();

        // extract unique departments
        return doctors.stream()
                .map(Doctor::getDepartment)
                .distinct()
                .toList();
    }


}
