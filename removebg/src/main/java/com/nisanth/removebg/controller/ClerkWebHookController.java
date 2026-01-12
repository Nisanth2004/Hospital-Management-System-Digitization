package com.nisanth.removebg.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nisanth.removebg.dto.UserDto;
import com.nisanth.removebg.entity.UserEntity;
import com.nisanth.removebg.response.RemoveBgResponse;
import com.nisanth.removebg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/webhooks")
public class ClerkWebHookController {

    @Value("${clerk.webhook.secret}")
    private String webHookSecret;

    private final UserService userService;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(
            @RequestHeader("svix-id") String svixId,
            @RequestHeader("svix-timestamp") String svixTimestamp,
            @RequestHeader("svix-signature") String svixSignature,
            @RequestBody String payload
    )
    {
        RemoveBgResponse response=null;
        try
        {
            boolean isValid=verifyWebhookSignature(svixId,svixTimestamp,svixSignature,payload);
            if(!isValid)
            {
                response= RemoveBgResponse.builder()
                        .statusCode(HttpStatus.UNAUTHORIZED)
                        .success(false)
                        .data("Invalid wehbook signature")
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            ObjectMapper objectMapper=new ObjectMapper();
            JsonNode rootNode=objectMapper.readTree(payload);
            String eventType=rootNode.path("type").asText();

            switch (eventType)
            {
                case "user.created":
                    handleUserCreated(rootNode.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdated(rootNode.path("data"));
                    break;
                case "user.deleted":
                    handleUserDeleted(rootNode.path("data"));
                    break;

            }
            return ResponseEntity.ok().build();

        }
        catch(Exception e)
        {
            response=RemoveBgResponse.builder()
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .success(false)
                    .data("Somethin went wrong")
                                    .build();
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        }

    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId=data.path("id").asText();
       UserDto existingUser= userService.getUserByClerkId(clerkId);
       existingUser.setEmail(data.path("email_addresses").path(0).path("email_address").asText());
       existingUser.setFirstName(data.path("first_name").asText());
       existingUser.setLastName(data.path("last_name").asText());
       existingUser.setPhotoUrl(data.path("image_url").asText());
       userService.saveUser(existingUser);
    }

    private void handleUserDeleted(JsonNode data) {

        String clerkId=data.path("id").asText();
        userService.deleteUserByClerkId(clerkId);

    }

    private void handleUserCreated(JsonNode data) {
       UserDto newUser= UserDto.builder()
                .clerkId(data.path("id").asText())
                .email(data.path("email_addresses").path(0).path("email_address").asText())
                .firstName(data.path("first_name").asText())
                .lastName(data.path("last_name").asText())
                .build();
       userService.saveUser(newUser);

    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {

        return true;
    }
}
