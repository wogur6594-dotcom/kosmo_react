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
@Table(name="tb_stocks")
public class StockDTO {

    @Id
    private String symbol; // 종목코드 (예: "005930", "TSLA")

    @Column(nullable = false)
    private String name; // 종목명

    @Column(nullable = false)
    private Double currentPrice; // 현재가

    @Column(nullable = false)
    private Double changePrice; // 전일대비 등락금액

    @Column(nullable = false)
    private Double changeRate; // 전일대비 등락률

    @Column(nullable = false)
    private String category; // 분류 (KOSPI, NASDAQ 등)

    @Column(nullable = true)
    private String theme; // 투자 테마 (반도체, AI 등)

    @Column(nullable = true)
    private String sector; // 산업 섹터 (IT/기술, 자동차 등)
}
