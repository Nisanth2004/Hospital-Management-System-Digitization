package com.nisanth.removebg.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "floor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String floorName;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne
    @JoinColumn(name = "taluk_id")
    private Taluk taluk;
}
