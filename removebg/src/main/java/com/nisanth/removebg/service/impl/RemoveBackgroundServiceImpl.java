package com.nisanth.removebg.service.impl;

import com.nisanth.removebg.client.ClipDropClient;
import com.nisanth.removebg.service.RemoveBackgroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class RemoveBackgroundServiceImpl implements RemoveBackgroundService {

    @Value("${clipdrop.api.key}")
    private String apiKey;

    private final ClipDropClient client;
    @Override
    public byte[] removeBackground(MultipartFile file) {
        return client.removeBackground(file,apiKey);

    }
}
