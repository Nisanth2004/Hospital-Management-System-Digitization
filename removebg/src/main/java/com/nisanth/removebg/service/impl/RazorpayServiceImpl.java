package com.nisanth.removebg.service.impl;

import com.nisanth.removebg.dto.UserDto;
import com.nisanth.removebg.entity.OrderEntity;
import com.nisanth.removebg.repository.OrderRepository;
import com.nisanth.removebg.service.RazorpayService;
import com.nisanth.removebg.service.UserService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final OrderRepository orderRepository;
    private final UserService userService;

    @Override
    public Order createOrder(Double amount, String currency) throws RazorpayException {
        try
        {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Razorpay expects amount in paise
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);

            return razorpayClient.orders.create(orderRequest);
        } catch (RazorpayException e) {
            e.printStackTrace();
            throw new RazorpayException("Razorpay error: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> verifyPayment(String razorpayOrderId) throws RazorpayException {
        Map<String,Object> returnvalue=new HashMap<>();
       try
       {
           RazorpayClient razorpayClient=new RazorpayClient(razorpayKeyId,razorpayKeySecret);
           Order orderInfo=razorpayClient.orders.fetch(razorpayOrderId);
           if(orderInfo.get("status").toString().equalsIgnoreCase("paid"))
           {
               OrderEntity existingOrder=orderRepository.findByOrderId(razorpayOrderId)
                       .orElseThrow(()->new RuntimeException("Order not found"));
               if(existingOrder.getPayment())
               {
                   returnvalue.put("success",false);
                   returnvalue.put("message","Payment failed");
                   return returnvalue;
               }

              UserDto userDto= userService.getUserByClerkId(existingOrder.getClerkId());

               // update the credits
               userDto.setCredits(userDto.getCredits()+existingOrder.getCredits());

               // save in db
               userService.saveUser(userDto);
               existingOrder.setPayment(true);
               orderRepository.save(existingOrder);
               returnvalue.put("success",true);
               returnvalue.put("message","Credits Added");
               return returnvalue;
           }
       }
       catch(Exception e)
       {
           e.printStackTrace();
           throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Something went wrong,while verifyig the paymnt");
       }

       return returnvalue;
    }


}
