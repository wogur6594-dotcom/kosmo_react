package com.jh.app.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockHistoryRepository extends JpaRepository<StockHistoryDTO, Long> {
    List<StockHistoryDTO> findByStockOrderByTimestampAsc(StockDTO stock);
    List<StockHistoryDTO> findByStock_SymbolOrderByTimestampAsc(String symbol);
}
