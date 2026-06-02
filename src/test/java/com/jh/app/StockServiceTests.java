package com.jh.app;

import com.jh.app.stock.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class StockServiceTests {

    @Autowired
    private StockService stockService;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockHistoryRepository stockHistoryRepository;

    @Test
    public void testInitialSeeding() {
        // Given & When
        List<StockDTO> list = stockService.getStockList();

        // Then
        assertThat(list).isNotEmpty();
        assertThat(list.size()).isEqualTo(6);

        // Check if AAPL exists
        Optional<StockDTO> aapl = stockRepository.findById("AAPL");
        assertThat(aapl).isPresent();
        assertThat(aapl.get().getName()).isEqualTo("애플");

        // Check history seeding (should have 30 history points for each)
        List<StockHistoryDTO> history = stockService.getStockHistory("AAPL");
        assertThat(history).isNotEmpty();
        assertThat(history.size()).isGreaterThanOrEqualTo(30);
    }

    @Test
    public void testStockDetail() {
        // Given
        stockService.getStockList(); // seeding trigger

        // When
        StockDTO stock = stockService.getStockDetail("005930");

        // Then
        assertThat(stock).isNotNull();
        assertThat(stock.getName()).isEqualTo("삼성전자");
        assertThat(stock.getCategory()).isEqualTo("KOSPI");
    }

    @Test
    public void testPriceSimulation() {
        // Given
        List<StockDTO> list1 = stockService.getStockList();
        double priceBefore = list1.stream()
                .filter(s -> s.getSymbol().equals("005930"))
                .findFirst()
                .orElseThrow()
                .getCurrentPrice();

        // When
        // 여러 번 호출하여 시뮬레이터 가격 변동 트리거
        for (int i = 0; i < 10; i++) {
            stockService.getStockList();
        }

        double priceAfter = stockService.getStockDetail("005930").getCurrentPrice();

        // Then
        System.out.println("Price Before: " + priceBefore + ", Price After: " + priceAfter);
    }
}
