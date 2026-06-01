package com.jh.app.notice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public List<NoticeDTO> getList() {
        return noticeRepository.findAll();
    }

    public NoticeDTO getDetail(Long id) throws Exception {
        Optional<NoticeDTO> result = noticeRepository.findById(id);
        return result.orElse(null);
    }
}
