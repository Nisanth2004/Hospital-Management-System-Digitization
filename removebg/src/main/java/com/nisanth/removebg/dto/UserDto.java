package com.nisanth.removebg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class UserDto {


    private String clerkId;


    private String email;
    private String firstName;
    private String lastName;
    private String photoUrl;
    private Integer credits;
}
