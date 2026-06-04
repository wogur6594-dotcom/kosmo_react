package com.jh.app.stock;

import java.util.List;

public interface StockService {
    List<StockDTO> getStockList();
    StockDTO getStockDetail(String symbol);
    List<StockHistoryDTO> getStockHistory(String symbol);
    List<StockDTO> searchStocks(String query);
}
