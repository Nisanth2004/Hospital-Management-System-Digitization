package com.nisanth.removebg.controller;

import com.nisanth.removebg.entity.BedNotification;
import com.nisanth.removebg.repository.BedNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class BedNotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyBedAvailable(Long bedId) {
        messagingTemplate.convertAndSend(
                "/topic/bed/" + bedId,
                "Bed is now AVAILABLE"
        );
    }
}

