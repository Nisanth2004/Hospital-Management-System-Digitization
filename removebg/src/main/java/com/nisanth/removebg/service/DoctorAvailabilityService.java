package com.nisanth.removebg.service;

import com.nisanth.removebg.entity.Doctor;
import com.nisanth.removebg.enumeration.DoctorStatus;
import com.nisanth.removebg.enumeration.Shift;
import com.nisanth.removebg.enumeration.WardType;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
public class DoctorAvailabilityService {

    public boolean isAvailable(Doctor doctor) {

        if (doctor.isOnLeave()) return false;

        if (doctor.getWardType() == WardType.ICU) return true; // emergency override

        if (!isWithinShift(doctor.getShift())) return false;

        return doctor.getStatus() == DoctorStatus.AVAILABLE;
    }

    private boolean isWithinShift(Shift shift) {
        int hour = LocalTime.now().getHour();

        return switch (shift) {
            case MORNING -> hour >= 8 && hour < 14;
            case EVENING -> hour >= 14 && hour < 20;
            case NIGHT -> hour >= 20 || hour < 8;
        };
    }
}
