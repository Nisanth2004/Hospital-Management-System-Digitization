package com.nisanth.removebg.controller;

import com.nisanth.removebg.dto.UserDto;
import com.nisanth.removebg.response.RemoveBgResponse;
import com.nisanth.removebg.service.RemoveBackgroundService;
import com.nisanth.removebg.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final RemoveBackgroundService removeBackgroundService;
    private final UserService userService;

    @PostMapping("/remove-background")

    public ResponseEntity<?> removeBackground(@RequestParam("file")MultipartFile file, Authentication authentication)
    {
        RemoveBgResponse bgResponse=null;
        Map<String,Object> responseMap=new HashMap<>();

        // validation
        try{
            if(authentication.getName().isEmpty() || authentication.getName()==null)
            {
               bgResponse= RemoveBgResponse.builder()
                        .success(false)
                        .statusCode(HttpStatus.FORBIDDEN)
                        .data("User does not have permission/access to this resource")
                        .build();

               return ResponseEntity.status(HttpStatus.FORBIDDEN).body(bgResponse);
            }

            // validation
           UserDto userDto= userService.getUserByClerkId(authentication.getName());
            if(userDto.getCredits()==0)
            {
                responseMap.put("message","No Credit balance");
                responseMap.put("creditBalance",userDto.getCredits());
               bgResponse= RemoveBgResponse.builder()
                        .success(false)
                        .data(responseMap)
                        .statusCode(HttpStatus.OK)
                        .build();

               return ResponseEntity.ok(bgResponse);
            }

            // remove background
            byte[] imageBytes= removeBackgroundService.removeBackground(file);
            String base64Image= Base64.getEncoder().encodeToString(imageBytes);
            userDto.setCredits(userDto.getCredits()-1);
            userService.saveUser(userDto);
           return ResponseEntity.ok()
                   .contentType(MediaType.TEXT_PLAIN)
                   .body(base64Image);

        }
        catch(Exception e) {
            bgResponse= RemoveBgResponse.builder()
                    .success(false)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Something went wrond")
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(bgResponse);

        }

    }
}
