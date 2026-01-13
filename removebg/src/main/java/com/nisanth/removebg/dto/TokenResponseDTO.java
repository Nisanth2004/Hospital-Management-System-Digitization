package com.nisanth.removebg.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TokenResponseDTO {

    private Long id;

    // Patient info
    private Long patientId;
    private String patientName;

    private LocalDateTime tokenTime;
    private String status;
    private String reason;

    // Doctor info
    private Long doctorId;
    private String doctorName;
    private String department;
    private String hospitalName;
}
