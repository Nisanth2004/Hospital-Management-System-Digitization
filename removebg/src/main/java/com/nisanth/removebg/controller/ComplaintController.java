package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.Complaint;
import com.nisanth.removebg.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/complaints")
@RequiredArgsConstructor
@CrossOrigin
public class ComplaintController {

    private final ComplaintRepository complaintRepo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // =========================
    // SUBMIT COMPLAINT
    // =========================
    @PostMapping("/submit")
    public Complaint submitComplaint(
            @RequestParam Long districtId,
            @RequestParam Long talukId,
            @RequestParam String citizenName,
            @RequestParam String mobileNumber,
            @RequestParam(required = false) String hospitalName,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        Complaint complaint = new Complaint();

        complaint.setDistrictId(districtId);
        complaint.setTalukId(talukId);
        complaint.setCitizenName(citizenName);
        complaint.setMobileNumber(mobileNumber);
        complaint.setHospitalName(hospitalName);
        complaint.setCategory(category);
        complaint.setDescription(description);
        complaint.setStatus("PENDING");
        complaint.setPriority("MEDIUM");
        complaint.setCreatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {

            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File file = new File(dir, fileName);
            image.transferTo(file);

            complaint.setImagePath(fileName);
        }

        return complaintRepo.save(complaint);
    }

    // =========================
    // GET BY DISTRICT
    // =========================
    @GetMapping("/district/{districtId}")
    public List<Complaint> getDistrictComplaints(@PathVariable Long districtId) {
        return complaintRepo.findByDistrictId(districtId);
    }

    // =========================
    // GET BY TALUK  (ADDED)
    // =========================
    @GetMapping("/taluk/{talukId}")
    public List<Complaint> getTalukComplaints(@PathVariable Long talukId) {
        return complaintRepo.findByTalukId(talukId);
    }

    // =========================
    // UPDATE STATUS (ADDED)
    // =========================
    @PutMapping("/{id}/status")
    public Complaint updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Complaint complaint = complaintRepo.findById(id).orElseThrow();
        complaint.setStatus(status);

        if (status.equals("RESOLVED")) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        return complaintRepo.save(complaint);
    }

    // =========================
    // UPDATE PRIORITY (ADDED)
    // =========================
    @PutMapping("/{id}/priority")
    public Complaint updatePriority(
            @PathVariable Long id,
            @RequestParam String priority
    ) {
        Complaint complaint = complaintRepo.findById(id).orElseThrow();
        complaint.setPriority(priority);
        return complaintRepo.save(complaint);
    }

    // =========================
    // ADD ADMIN REMARK (ADDED)
    // =========================
    @PutMapping("/{id}/remark")
    public Complaint addRemark(
            @PathVariable Long id,
            @RequestParam String remark
    ) {
        Complaint complaint = complaintRepo.findById(id).orElseThrow();
        complaint.setAdminRemark(remark);
        return complaintRepo.save(complaint);
    }



}
