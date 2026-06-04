package com.jh.app.stock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service("mockStockService")
@Transactional
public class MockStockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockHistoryRepository stockHistoryRepository;

    private final Random random = new Random();

    @PostConstruct
    public void init() {
        // 애플리케이션 시작 시 데이터 자동 시딩 검사
        seedInitialStocks();
    }

    private synchronized void seedInitialStocks() {
        if (stockRepository.count() > 0) {
            return;
        }

        List<StockDTO> defaultStocks = new ArrayList<>();
        defaultStocks.add(StockDTO.builder().symbol("005930").name("삼성전자").currentPrice(72800.0).changePrice(1200.0).changeRate(1.68).category("KOSPI").theme("반도체").sector("IT/기술").build());
        defaultStocks.add(StockDTO.builder().symbol("000660").name("SK하이닉스").currentPrice(185400.0).changePrice(6200.0).changeRate(3.46).category("KOSPI").theme("반도체").sector("IT/기술").build());
        defaultStocks.add(StockDTO.builder().symbol("AAPL").name("애플").currentPrice(182.5).changePrice(-2.3).changeRate(-1.24).category("NASDAQ").theme("스마트폰/AI").sector("빅테크").build());
        defaultStocks.add(StockDTO.builder().symbol("TSLA").name("테슬라").currentPrice(179.8).changePrice(5.4).changeRate(3.10).category("NASDAQ").theme("전기차/자율주행").sector("자동차").build());
        defaultStocks.add(StockDTO.builder().symbol("NVDA").name("엔비디아").currentPrice(910.2).changePrice(18.5).changeRate(2.07).category("NASDAQ").theme("AI반도체").sector("빅테크").build());
        defaultStocks.add(StockDTO.builder().symbol("MSFT").name("마이크로소프트").currentPrice(420.5).changePrice(2.1).changeRate(0.50).category("NASDAQ").theme("클라우드/AI").sector("빅테크").build());

        stockRepository.saveAll(defaultStocks);

        // 각 주식마다 과거 30일치 모방 히스토리 데이터 생성
        long now = System.currentTimeMillis();
        long dayInMs = 24 * 60 * 60 * 1000L;

        for (StockDTO stock : defaultStocks) {
            double basePrice = stock.getCurrentPrice();
            for (int i = 0; i < 30; i++) {
                // 과거로 갈수록 가격이 누적 변동하여 거꾸로 내려가게 계산
                double randomShift = (random.nextDouble() - 0.46) * (basePrice * 0.015);
                double historicPrice = basePrice - (30 - i) * randomShift;

                // 스케일에 따른 소수점 처리
                if (stock.getCategory().equals("KOSPI")) {
                    historicPrice = Math.round(historicPrice);
                } else {
                    historicPrice = Math.round(historicPrice * 10.0) / 10.0;
                }

                StockHistoryDTO history = StockHistoryDTO.builder()
                        .stock(stock)
                        .price(historicPrice)
                        .timestamp(now - (30 - i) * dayInMs)
                        .build();

                stockHistoryRepository.save(history);
            }
        }
    }

    @Override
    public List<StockDTO> getStockList() {
        seedInitialStocks(); // 안전가드 시딩

        List<StockDTO> stocks = stockRepository.findAll();

        // 60% 확률로 가격 무작위 변동(시뮬레이션) 트리거
        if (random.nextDouble() < 0.60) {
            long now = System.currentTimeMillis();
            for (StockDTO stock : stocks) {
                double percent = (random.nextDouble() - 0.48) * 0.035; // ±1.75% 내외 가격 변동
                double oldPrice = stock.getCurrentPrice();
                double newPrice = oldPrice * (1 + percent);

                if (stock.getCategory().equals("KOSPI")) {
                    newPrice = Math.round(newPrice);
                } else {
                    newPrice = Math.round(newPrice * 10.0) / 10.0;
                }

                double changePrice = newPrice - oldPrice;
                double changeRate = (changePrice / oldPrice) * 100.0;

                stock.setCurrentPrice(newPrice);
                stock.setChangePrice(Math.round(changePrice * 10.0) / 10.0);
                stock.setChangeRate(Math.round(changeRate * 100.0) / 100.0);

                // DB에 변경된 가격 갱신 저장
                stockRepository.save(stock);

                // 변동 가격 히스토리에 동적 추가 적재
                StockHistoryDTO history = StockHistoryDTO.builder()
                        .stock(stock)
                        .price(newPrice)
                        .timestamp(now)
                        .build();
                stockHistoryRepository.save(history);
            }
        }

        return stocks;
    }

    @Override
    public StockDTO getStockDetail(String symbol) {
        seedInitialStocks();
        return stockRepository.findById(symbol.toUpperCase()).orElse(null);
    }

    @Override
    public List<StockHistoryDTO> getStockHistory(String symbol) {
        seedInitialStocks();
        // 특정 종목의 타임스탬프 오름차순 최근 50개 제한
        List<StockHistoryDTO> histories = stockHistoryRepository.findByStock_SymbolOrderByTimestampAsc(symbol.toUpperCase());
        if (histories.size() > 50) {
            return histories.subList(histories.size() - 50, histories.size());
        }
        return histories;
    }

    @Override
    public List<StockDTO> searchStocks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new java.util.ArrayList<>();
        }
        return stockRepository.searchStocks(query.trim());
    }
}
