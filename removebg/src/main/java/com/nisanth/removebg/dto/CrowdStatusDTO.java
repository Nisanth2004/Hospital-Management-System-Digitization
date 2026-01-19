package com.nisanth.removebg.dto;

import lombok.Data;

@Data
public class CrowdStatusDTO {

    private String districtId;

    private int totalDoctors;
    private int availableDoctors;

    private int totalTokens;
    private int waitingTokens;

    private int totalBeds;
    private int availableBeds;

    private String crowdLevel;       // LOW, MODERATE, HIGH
    private int estimatedWaitTime;   // minutes
    private BestVisitTimeDTO bestVisitTime;

}
