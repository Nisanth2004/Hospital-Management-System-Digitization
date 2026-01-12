package com.nisanth.removebg.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String clerkId;

    @Column(unique = true,nullable = false)
    private String email;
    private String firstName;
    private String lastName;
    private Integer credits;
    private String photoUrl;

    // provide the default value
    @PrePersist
    public void prePersist()
    {
        if(credits==null){
            credits=5;
        }

    }

}
