package com.nisanth.removebg.controller;

import com.nisanth.removebg.dto.BestVisitTimeDTO;
import com.nisanth.removebg.dto.CrowdStatusDTO;
import com.nisanth.removebg.entity.Bed;
import com.nisanth.removebg.entity.District;
import com.nisanth.removebg.entity.Doctor;
import com.nisanth.removebg.entity.Token;
import com.nisanth.removebg.enumeration.DoctorStatus;
import com.nisanth.removebg.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/crowd-status")
@RequiredArgsConstructor
@CrossOrigin
public class CrowdStatusController {

    private final TokenRepository tokenRepo;
    private final DoctorRepository doctorRepo;
    private final BedRepository bedRepo;
    private final DistrictRepository districtRepo;

    @GetMapping("/{districtId}")
    public CrowdStatusDTO getCrowdStatus(@PathVariable Long districtId) {

        District district = districtRepo.findById(districtId).orElseThrow();

        // 🔹 Doctors
        List<Doctor> doctors = doctorRepo.findByDistrictId(String.valueOf(districtId));
        int totalDoctors = doctors.size();
        int availableDoctors = (int) doctors.stream()
                .filter(d -> d.getStatus() == DoctorStatus.AVAILABLE && !d.isOnLeave())
                .count();

        // 🔹 Tokens
        List<Token> tokens = tokenRepo.findByDistrictId(districtId);
        int totalTokens = tokens.size();
        int waitingTokens = (int) tokens.stream()
                .filter(t -> t.getStatus().equalsIgnoreCase("BOOKED"))
                .count();

        // 🔹 Beds
        List<Bed> beds = bedRepo.findByDistrict(district);
        int totalBeds = beds.size();
        int availableBeds = (int) beds.stream()
                .filter(b -> !Boolean.TRUE.equals(b.getOccupied()))
                .count();



        // 🔹 Crowd Level Logic
        String crowdLevel;
        if (waitingTokens <= 10) {
            crowdLevel = "LOW";
        } else if (waitingTokens <= 25) {
            crowdLevel = "MODERATE";
        } else {
            crowdLevel = "HIGH";
        }

        // 🔹 Estimated Waiting Time (15 min per token)
        int estimatedWaitTime = waitingTokens * 15;

        // 🔹 Response
        CrowdStatusDTO dto = new CrowdStatusDTO();
        dto.setDistrictId(String.valueOf(districtId));
        dto.setTotalDoctors(totalDoctors);
        dto.setAvailableDoctors(availableDoctors);
        dto.setTotalTokens(totalTokens);
        dto.setWaitingTokens(waitingTokens);
        dto.setTotalBeds(totalBeds);
        dto.setAvailableBeds(availableBeds);
        dto.setCrowdLevel(crowdLevel);
        dto.setEstimatedWaitTime(estimatedWaitTime);

        List<Object[]> hourlyStats = tokenRepo.getHourlyTokenStats(districtId);

        BestVisitTimeDTO bestVisitTime =
                calculateBestVisitTime(hourlyStats, availableDoctors);

        dto.setBestVisitTime(bestVisitTime);


        return dto;
    }

    private BestVisitTimeDTO calculateBestVisitTime(
            List<Object[]> hourlyTokens,
            int availableDoctors
    ) {
        int minTokens = Integer.MAX_VALUE;
        int bestHour = -1;

        for (Object[] row : hourlyTokens) {
            int hour = (int) row[0];
            int tokenCount = ((Long) row[1]).intValue();

            if (tokenCount < minTokens) {
                minTokens = tokenCount;
                bestHour = hour;
            }
        }

        BestVisitTimeDTO dto = new BestVisitTimeDTO();

        if (bestHour == -1 || availableDoctors == 0) {
            dto.setReason("Currently high load. Please check later.");
            return dto;
        }

        dto.setStartTime(String.format("%02d:00", bestHour));
        dto.setEndTime(String.format("%02d:00", bestHour + 2));
        dto.setReason("Low token load and good doctor availability");

        return dto;
    }

}
