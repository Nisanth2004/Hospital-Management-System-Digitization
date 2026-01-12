package com.nisanth.removebg.service;

import com.nisanth.removebg.entity.Bed;
import com.nisanth.removebg.repository.BedNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BedStatusService {

    private final BedNotificationRepository notifyRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public void notifyIfFree(Bed bed) {
        if (!bed.getOccupied()) {
            notifyRepo.findByBedIdAndNotifiedFalse(bed.getId())
                .forEach(n -> {
                    messagingTemplate.convertAndSend(
                        "/topic/bed/" + bed.getId(),
                        "Bed " + bed.getBedNumber() + " is now AVAILABLE"
                    );
                    n.setNotified(true);
                    notifyRepo.save(n);
                });
        }
    }
}
