package com.jh.app.notice;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice/**")
@AllArgsConstructor
@CrossOrigin("*")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("list")
    public List<NoticeDTO> list() throws Exception {
        return noticeService.getList();
    }

    @GetMapping("detail/{id}")
    public NoticeDTO detail(@PathVariable(name = "id") Long id) throws Exception {
        return noticeService.getDetail(id);
    }
}
