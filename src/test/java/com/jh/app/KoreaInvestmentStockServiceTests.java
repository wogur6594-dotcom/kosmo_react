package com.jh.app;

import com.jh.app.stock.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class KoreaInvestmentStockServiceTests {

    @Autowired
    private StockService stockService; // KoreaInvestmentStockServiceImpl가 @Primary이므로 주입됨

    @Autowired
    @Qualifier("mockStockService")
    private StockService mockStockService;

    @Autowired(required = false)
    private KisAuthService kisAuthService;

    @Test
    public void testPrimaryBeanMapping() {
        // Given & When
        // Then
        assertThat(stockService).isNotNull();
        assertThat(stockService).isInstanceOf(KoreaInvestmentStockServiceImpl.class);
        assertThat(mockStockService).isNotNull();
        assertThat(mockStockService).isInstanceOf(MockStockServiceImpl.class);
    }

    @Test
    public void testFallbackFallbackTrigger() {
        // Given
        // KIS API Key가 설정되지 않았거나 예외 상황일 때 getStockList() 호출 시,
        // 예외가 외부로 전파되지 않고 최종적으로 안전 데이터(Mock/DB)를 반환해야 함.

        // When
        List<StockDTO> list = stockService.getStockList();

        // Then
        assertThat(list).isNotEmpty();
        // 초기 6종 종목이 완전히 조회되는지 확인
        assertThat(list.size()).isEqualTo(6);
    }

    @Test
    public void testStockDetailFallback() {
        // Given
        stockService.getStockList(); // 시딩 유도

        // When
        StockDTO stock = stockService.getStockDetail("AAPL");

        // Then
        assertThat(stock).isNotNull();
        assertThat(stock.getSymbol()).isEqualTo("AAPL");
        assertThat(stock.getName()).isEqualTo("애플");
    }
}
