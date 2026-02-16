package com.nisanth.removebg.controller;

import com.nisanth.removebg.dto.TokenBookingRequest;
import com.nisanth.removebg.dto.TokenResponseDTO;
import com.nisanth.removebg.entity.Doctor;
import com.nisanth.removebg.entity.Token;
import com.nisanth.removebg.repository.DoctorRepository;
import com.nisanth.removebg.repository.TokenRepository;
import com.nisanth.removebg.repository.DoctorRepository;
import com.nisanth.removebg.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.nio.file.*;
import java.io.IOException;


import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/token")
@CrossOrigin
public class TokenController {

    private final TokenRepository tokenRepo;
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;

    public TokenController(TokenRepository tokenRepo,
                           DoctorRepository doctorRepo,
                           UserRepository userRepo) {
        this.tokenRepo = tokenRepo;
        this.doctorRepo = doctorRepo;
        this.userRepo = userRepo;
    }

    // 🔹 Get doctors by department
    @GetMapping("/doctors/{department}")
    public List<Doctor> getDoctorsByDepartment(@PathVariable String department) {
        return doctorRepo.findAll()
                .stream()
                .filter(d -> d.getDepartment().equalsIgnoreCase(department))
                .toList();
    }

    // 🔹 Get available slots for a doctor
    @GetMapping("/slots/{doctorId}")
    public List<LocalDateTime> getAvailableSlots(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepo.findById(doctorId).orElseThrow();

        LocalDateTime shiftStart = LocalDateTime.now()
                .withHour(doctor.getShiftStartTime().getHour())
                .withMinute(doctor.getShiftStartTime().getMinute())
                .withSecond(0)
                .withNano(0);

        LocalDateTime shiftEnd = LocalDateTime.now()
                .withHour(doctor.getShiftEndTime().getHour())
                .withMinute(doctor.getShiftEndTime().getMinute())
                .withSecond(0)
                .withNano(0);

        List<Token> existingTokens = tokenRepo.findByDoctorIdAndTokenTimeBetween(doctorId, shiftStart, shiftEnd);

        // Build available slots (15 min intervals)
        List<LocalDateTime> slots = new java.util.ArrayList<>();
        LocalDateTime time = shiftStart;

        while(time.isBefore(shiftEnd)) {
            LocalDateTime finalTime = time;
            boolean taken = existingTokens.stream().anyMatch(t -> t.getTokenTime().equals(finalTime));
            if(!taken) slots.add(time);
            time = time.plusMinutes(15);
        }

        return slots;
    }

    // 🔹 Book a token
    @PostMapping("/book")
    public ResponseEntity<Token> bookToken(
            @RequestBody TokenBookingRequest request
    ) {
        Token token = new Token();
        token.setDistrictId(request.getDistrictId());
        token.setDoctorId(request.getDoctorId());
        token.setPatientId(request.getPatientId());
        token.setTokenTime(request.getTokenTime());
        token.setBookedAt(LocalDateTime.now());
        token.setReason(request.getReason());
        token.setStatus("BOOKED");

        return ResponseEntity.ok(tokenRepo.save(token));
    }

    // 🔹 Get all tokens for a particular patient
    @GetMapping("/my-tokens/{patientId}")
    public List<TokenResponseDTO> getTokensForPatient(@PathVariable Long patientId) {

        List<Token> tokens = tokenRepo.findByPatientId(patientId);

        return tokens.stream().map(token -> {
            Doctor doctor = doctorRepo.findById(token.getDoctorId()).orElse(null);

            TokenResponseDTO dto = new TokenResponseDTO();
            dto.setId(token.getId());
            dto.setPatientId(token.getPatientId());
            dto.setTokenTime(token.getTokenTime());
            dto.setStatus(token.getStatus());
            dto.setReason(token.getReason());

            if (doctor != null) {
                dto.setDoctorId(doctor.getId());
                dto.setDoctorName(doctor.getName());
                dto.setDepartment(doctor.getDepartment());
                dto.setHospitalName(doctor.getHospitalName());
            }

            return dto;
        }).toList();
    }
    // 🔹 Get all tokens for a particular doctor
    @GetMapping("/doctor/{doctorId}")
    public List<TokenResponseDTO> getTokensForDoctor(@PathVariable Long doctorId) {

        List<Token> tokens = tokenRepo.findByDoctorId(doctorId);

        return tokens.stream().map(token -> {
            TokenResponseDTO dto = new TokenResponseDTO();

            dto.setId(token.getId());
            dto.setPatientId(token.getPatientId());
            dto.setTokenTime(token.getTokenTime());
            dto.setStatus(token.getStatus());
            dto.setReason(token.getReason());

            // 👤 Patient
            userRepo.findById(token.getPatientId()).ifPresent(user -> {
                dto.setPatientName(user.getFirstName() + " " + user.getLastName());
            });

            // 👨‍⚕️ Doctor
            Doctor doctor = doctorRepo.findById(token.getDoctorId()).orElse(null);
            if (doctor != null) {
                dto.setDoctorId(doctor.getId());
                dto.setDoctorName(doctor.getName());
                dto.setDepartment(doctor.getDepartment());
                dto.setHospitalName(doctor.getHospitalName());
            }

            return dto;
        }).toList();
    }

    // 🔹 Update status of a token (doctor can mark as COMPLETED or CANCELLED)
    @PutMapping("/doctor/update-status/{tokenId}")
    public ResponseEntity<TokenResponseDTO> updateTokenStatus(
            @PathVariable Long tokenId,
            @RequestParam String status
    ) {
        Token token = tokenRepo.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        token.setStatus(status.toUpperCase()); // BOOKED / COMPLETED / CANCELLED
        tokenRepo.save(token);

        // Return updated DTO
        Doctor doctor = doctorRepo.findById(token.getDoctorId()).orElse(null);
        TokenResponseDTO dto = new TokenResponseDTO();
        dto.setId(token.getId());
        dto.setPatientId(token.getPatientId());
        dto.setTokenTime(token.getTokenTime());
        dto.setStatus(token.getStatus());
        dto.setReason(token.getReason());

        if (doctor != null) {
            dto.setDoctorId(doctor.getId());
            dto.setDoctorName(doctor.getName());
            dto.setDepartment(doctor.getDepartment());
            dto.setHospitalName(doctor.getHospitalName());
        }

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/doctor/upload-report/{tokenId}")
    public ResponseEntity<?> uploadReport(
            @PathVariable Long tokenId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        Token token = tokenRepo.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (!token.getStatus().equals("COMPLETED")) {
            return ResponseEntity.badRequest().body("Token must be COMPLETED first");
        }

        // Create uploads folder if not exists
        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));

        // Unique file name
        String fileName = "report_patient_" + token.getPatientId() +
                "_token_" + token.getId() + ".pdf";

        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, file.getBytes());

        token.setReportFileName(fileName);
        tokenRepo.save(token);

        return ResponseEntity.ok("Report uploaded successfully");
    }
    @GetMapping("/download-report/{tokenId}")
    public ResponseEntity<Resource> downloadReport(@PathVariable Long tokenId) throws IOException {

        Token token = tokenRepo.findById(tokenId)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (token.getReportFileName() == null) {
            throw new RuntimeException("Report not uploaded yet");
        }

        Path path = Paths.get("uploads/").resolve(token.getReportFileName());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + token.getReportFileName() + "\"")
                .body(resource);
    }



}
