package com.nisanth.removebg.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "equipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // CT Scan
    private String roomNumber;

    private Double positionX;   // percentage
    private Double positionY;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    private Floor floor;
}
