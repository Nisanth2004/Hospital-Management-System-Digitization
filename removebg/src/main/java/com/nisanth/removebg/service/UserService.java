package com.nisanth.removebg.service;

import com.nisanth.removebg.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    UserDto saveUser(UserDto userDto);

    UserDto getUserByClerkId(String clerkId);


    void deleteUserByClerkId(String clerkId);
}
