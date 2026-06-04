package com.jh.app.board;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    @Query("SELECT b FROM BoardEntity b WHERE " +
           "(:stockSymbol = 'ALL' OR b.stockSymbol = :stockSymbol) AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(b.content) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<BoardEntity> findByFilterAndSearch(
            @Param("stockSymbol") String stockSymbol,
            @Param("search") String search,
            Pageable pageable
    );
}
