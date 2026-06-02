package com.jh.app.stock;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="tb_stock_histories")
public class StockHistoryDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double price; // 기록된 주가

    @Column(nullable = false)
    private Long timestamp; // 기록 시각 밀리초

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symbol", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private StockDTO stock; // 대상 종목
}
