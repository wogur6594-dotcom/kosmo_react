package com.jh.app.stock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/list")
    public List<StockDTO> getStockList() {
        return stockService.getStockList();
    }

    @GetMapping("/detail/{symbol}")
    public Map<String, Object> getStockDetail(@PathVariable String symbol) {
        StockDTO stock = stockService.getStockDetail(symbol);
        List<StockHistoryDTO> history = stockService.getStockHistory(symbol);

        Map<String, Object> response = new HashMap<>();
        response.put("stock", stock);
        response.put("history", history);
        return response;
    }

    @GetMapping("/search")
    public List<StockDTO> searchStocks(@RequestParam(value = "query", defaultValue = "") String query) {
        return stockService.searchStocks(query);
    }
}
