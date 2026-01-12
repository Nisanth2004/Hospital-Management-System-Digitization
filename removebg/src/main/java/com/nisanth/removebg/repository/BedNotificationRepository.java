package com.nisanth.removebg.repository;

import com.nisanth.removebg.entity.BedNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BedNotificationRepository extends JpaRepository<BedNotification, Long> {
    List<BedNotification> findByBedIdAndNotifiedFalse(Long bedId);
}
