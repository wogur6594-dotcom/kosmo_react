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

    @Test
    public void testStockSearch() {
        // Given
        // 테스트 격리를 위해 기존 DB 데이터 청소 후 재시딩 유도
        stockHistoryRepository.deleteAll();
        stockRepository.deleteAll();
        stockService.getStockList(); // clean seeding trigger

        // When & Then
        // 1. 테마 검색 ("반도체") -> 삼성전자, SK하이닉스 매칭 확인
        List<StockDTO> semiconductorStocks = stockService.searchStocks("반도체");
        assertThat(semiconductorStocks).isNotEmpty();
        assertThat(semiconductorStocks.stream().anyMatch(s -> s.getSymbol().equals("005930"))).isTrue();
        assertThat(semiconductorStocks.stream().anyMatch(s -> s.getSymbol().equals("000660"))).isTrue();

        // 2. 섹터 검색 ("빅테크") -> 애플, 엔비디아, 마이크로소프트 매칭 확인
        List<StockDTO> bigtechStocks = stockService.searchStocks("빅테크");
        assertThat(bigtechStocks).isNotEmpty();
        assertThat(bigtechStocks.stream().anyMatch(s -> s.getSymbol().equals("AAPL"))).isTrue();
        assertThat(bigtechStocks.stream().anyMatch(s -> s.getSymbol().equals("NVDA"))).isTrue();
        assertThat(bigtechStocks.stream().anyMatch(s -> s.getSymbol().equals("MSFT"))).isTrue();

        // 3. 대소문자 무시 종목코드 검색 ("aapl") -> 애플 매칭 확인
        List<StockDTO> aaplResult = stockService.searchStocks("aapl");
        assertThat(aaplResult).isNotEmpty();
        assertThat(aaplResult.get(0).getSymbol()).isEqualTo("AAPL");

        // 4. 종목명 검색 ("삼성") -> 삼성전자 매칭 확인
        List<StockDTO> samsungResult = stockService.searchStocks("삼성");
        assertThat(samsungResult).isNotEmpty();
        assertThat(samsungResult.get(0).getSymbol()).isEqualTo("005930");

        // 5. 빈 검색어 또는 null 검색어 -> 빈 리스트 반환 확인
        List<StockDTO> emptyResult = stockService.searchStocks("");
        assertThat(emptyResult).isEmpty();
    }
}
