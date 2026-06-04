package com.jh.app.stock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Primary
@Transactional
public class KoreaInvestmentStockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockHistoryRepository stockHistoryRepository;

    @Autowired
    private KisAuthService kisAuthService;

    @Autowired
    @Qualifier("mockStockService")
    private StockService mockStockService;

    @Value("${kis.api.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public List<StockDTO> getStockList() {
        List<StockDTO> stocks = stockRepository.findAll();
        if (stocks.isEmpty()) {
            // 아직 시딩이 안 되었다면 mock 서비스의 초기 데이터 시딩 기능을 차용
            return mockStockService.getStockList();
        }

        List<StockDTO> updatedStocks = new ArrayList<>();
        long now = System.currentTimeMillis();

        for (StockDTO stock : stocks) {
            try {
                StockDTO updated = fetchStockPriceFromKis(stock);
                if (updated != null) {
                    stockRepository.save(updated);
                    
                    // 성공했을 때 이력 저장
                    StockHistoryDTO history = StockHistoryDTO.builder()
                            .stock(updated)
                            .price(updated.getCurrentPrice())
                            .timestamp(now)
                            .build();
                    stockHistoryRepository.save(history);
                    
                    updatedStocks.add(updated);
                } else {
                    // API 응답 실패 시 mock 갱신값 또는 기존 DB 데이터 폴백 반환
                    updatedStocks.add(stock);
                }
            } catch (Exception e) {
                System.err.println("[KIS API] Error updating stock symbol: " + stock.getSymbol() + ". Message: " + e.getMessage() + ". Fallback active.");
                // 개별 호출 오류 시 해당 종목만 기존 가격 유지 혹은 Mock 데이터 폴백
                updatedStocks.add(stock);
            }
        }
        return updatedStocks;
    }

    @Override
    public StockDTO getStockDetail(String symbol) {
        StockDTO stock = stockRepository.findById(symbol.toUpperCase()).orElse(null);
        if (stock == null) {
            return mockStockService.getStockDetail(symbol);
        }
        try {
            StockDTO updated = fetchStockPriceFromKis(stock);
            if (updated != null) {
                stockRepository.save(updated);
                return updated;
            }
        } catch (Exception e) {
            System.err.println("[KIS API] Detail fetch failed for: " + symbol + ". Falling back to DB.");
        }
        return stock;
    }

    @Override
    public List<StockHistoryDTO> getStockHistory(String symbol) {
        // 이력 데이터는 KIS API가 실시간만 제공하므로, 로컬 DB(tb_stock_histories)에 쌓인 이력을 반환합니다.
        List<StockHistoryDTO> histories = stockHistoryRepository.findByStock_SymbolOrderByTimestampAsc(symbol.toUpperCase());
        if (histories.isEmpty()) {
            return mockStockService.getStockHistory(symbol);
        }
        if (histories.size() > 50) {
            return histories.subList(histories.size() - 50, histories.size());
        }
        return histories;
    }

    private StockDTO fetchStockPriceFromKis(StockDTO stock) {
        if (stock.getCategory().equalsIgnoreCase("KOSPI")) {
            return fetchKoreanStockPrice(stock);
        } else {
            return fetchNasdaqStockPrice(stock);
        }
    }

    private StockDTO fetchKoreanStockPrice(StockDTO stock) {
        // 국내 주식 현재가 조회 (tr_id: FNSW10110000)
        String path = "/uapi/domestic-stock/v1/quotations/inquire-price";
        String trId = "FNSW10110000";

        HttpHeaders headers = kisAuthService.buildHttpHeaders(trId);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + path)
                .queryParam("FID_COND_MRKT_DIV_CODE", "J")
                .queryParam("FID_INPUT_ISCD", stock.getSymbol())
                .build()
                .toUriString();

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> output = (Map<String, Object>) response.getBody().get("output");
            if (output != null) {
                double currentPrice = Double.parseDouble((String) output.get("stck_prpr"));
                double changePrice = Double.parseDouble((String) output.get("prdy_vrss"));
                double changeRate = Double.parseDouble((String) output.get("prdy_ctrt"));

                stock.setCurrentPrice(currentPrice);
                stock.setChangePrice(changePrice);
                stock.setChangeRate(changeRate);
                return stock;
            }
        }
        return null;
    }

    private StockDTO fetchNasdaqStockPrice(StockDTO stock) {
        // 해외 주식 지연 시세 조회 (tr_id: VTTF3007R)
        String path = "/uapi/overseas-price/v1/quotations/price";
        String trId = "VTTF3007R"; // 모의투자 나스닥 TR ID

        HttpHeaders headers = kisAuthService.buildHttpHeaders(trId);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + path)
                .queryParam("AUTH", "")
                .queryParam("EXCD", "NAS")
                .queryParam("SYMB", stock.getSymbol())
                .build()
                .toUriString();

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> output = (Map<String, Object>) response.getBody().get("output");
            if (output != null) {
                double currentPrice = Double.parseDouble((String) output.get("last"));
                double changePrice = Double.parseDouble((String) output.get("diff"));
                double changeRate = Double.parseDouble((String) output.get("rate"));

                stock.setCurrentPrice(currentPrice);
                stock.setChangePrice(changePrice);
                stock.setChangeRate(changeRate);
                return stock;
            }
        }
        return null;
    }

    @Override
    public List<StockDTO> searchStocks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return stockRepository.searchStocks(query.trim());
    }
}
