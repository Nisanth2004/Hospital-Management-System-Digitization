package com.nisanth.removebg.controller;

import com.nisanth.removebg.dto.RazorpayOrderDTO;
import com.nisanth.removebg.response.RemoveBgResponse;
import com.nisanth.removebg.service.OrderService;
import com.nisanth.removebg.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final RazorpayService razorpayService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestParam String planId, Authentication authentication) throws RazorpayException
    {
        Map<String, Object> responseMap=new HashMap<>();
        RemoveBgResponse bgResponse=null;


        if(authentication.getName().isEmpty() || authentication.getName()==null)
        {
            bgResponse= RemoveBgResponse.builder()
                    .success(false)
                    .statusCode(HttpStatus.FORBIDDEN)
                    .data("User does not have permission/access to this resource")
                    .build();

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(bgResponse);
        }

        try
        {
            Order order=orderService.createOrder(planId, authentication.getName());
           RazorpayOrderDTO responseDto= convertToDto(order);
          bgResponse= RemoveBgResponse.builder()
                   .success(true)
                   .statusCode(HttpStatus.CREATED)
                   .data(responseDto)
                  .build();

          return ResponseEntity.ok(bgResponse);

        }
        catch(Exception e)
        {
            bgResponse= RemoveBgResponse.builder()
                    .success(false)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Something went wrong")
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(bgResponse);

        }

    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOrder(@RequestBody Map<String,Object> request)throws RazorpayException
    {
      try
      {
          String razorpayOrderid=request.get("razorpay_order_id").toString();
          Map<String,Object> returnValue=razorpayService.verifyPayment(razorpayOrderid);
        return ResponseEntity.ok(returnValue);
      }
      catch(RazorpayException e)
      {
          Map<String,Object> errorResponse=new HashMap<>();
          errorResponse.put("success","false");
          errorResponse.put("message",e.getMessage());
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);

      }
    }
    private RazorpayOrderDTO convertToDto(Order order) {

       return  RazorpayOrderDTO.builder()
                .id(order.get("id"))
                .amount(order.get("amount"))
                .entity(order.get("entity"))
                .currency(order.get("currency"))
                .status(order.get("status"))
                .created_at(order.get("created_at"))
                .receipt(order.get("receipt"))
                .build();
    }
}
