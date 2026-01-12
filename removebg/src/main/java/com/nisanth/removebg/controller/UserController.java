package com.nisanth.removebg.controller;

import com.nisanth.removebg.dto.UserDto;
import com.nisanth.removebg.response.RemoveBgResponse;
import com.nisanth.removebg.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createOrUpdateUser(@RequestBody UserDto userDto, Authentication authentication)
    {

        RemoveBgResponse response=null;
       try{

           // check the authentication object is present or not

           if(!authentication.getName().equals(userDto.getClerkId())){
               response= RemoveBgResponse.builder()
                       .success(false)
                       .data("User does not have permission to access the resource")
                       .statusCode(HttpStatus.FORBIDDEN)
                       .build();

              return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
           }
           UserDto user=userService.saveUser(userDto);
           // user builder pattern
           response= RemoveBgResponse.builder()
                   .success(true)
                   .data(user)
                   .statusCode(HttpStatus.OK)
                   .build();


           return ResponseEntity.status(HttpStatus.OK).body(response);
       }
       catch(Exception e)
       {
           response= RemoveBgResponse.builder()
                   .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                   .data(e.getMessage())
                   .success(false)
                   .build();

           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
       }
    }


    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(Authentication authentication) {
        RemoveBgResponse bgResponse = null;

        try {
            if (authentication.getName().isEmpty() || authentication.getName() == null) {
                bgResponse = RemoveBgResponse.builder()
                        .statusCode(HttpStatus.FORBIDDEN)
                        .data("User does not have permission/access to this resource")
                        .success(false)
                        .build();

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(bgResponse);
            }

            String clerkId = authentication.getName();
            UserDto existingUser = userService.getUserByClerkId(clerkId);
            Map<String, Integer> map = new HashMap<>();
            map.put("credits", existingUser.getCredits());
            bgResponse = RemoveBgResponse.builder()
                    .statusCode(HttpStatus.OK)
                    .data(map)
                    .success(true)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(bgResponse);

        } catch (Exception e) {
            bgResponse = RemoveBgResponse.builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Something went wrong.")
                    .success(false)
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(bgResponse);
        }
    }
        }
