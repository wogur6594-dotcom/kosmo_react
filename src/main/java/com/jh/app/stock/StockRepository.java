package com.jh.app.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<StockDTO, String> {

    @Query("SELECT s FROM StockDTO s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.symbol) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.theme) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.sector) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<StockDTO> searchStocks(@Param("query") String query);
}
