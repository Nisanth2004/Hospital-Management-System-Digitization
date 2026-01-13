package com.nisanth.removebg.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TokenBookingRequest {
    private Long districtId;
    private Long doctorId;
    private Long patientId;
    private LocalDateTime tokenTime;
    private String reason;
}
