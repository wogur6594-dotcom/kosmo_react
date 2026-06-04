package com.jh.app.board;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private CommentRepository commentRepository;

    @PostConstruct
    public void seedInitialPosts() {
        if (boardRepository.count() > 0) {
            return;
        }

        // 초기 주주 토론방 Mock 데이터 Seeding
        BoardEntity p1 = BoardEntity.builder()
                .title("삼성전자 오늘 시외 상승 이유 아시는 분 계신가요?")
                .content("엔비디아 HBM 공급망 진입 루머가 또 도는 것 같네요. 이번에는 진짜 확정일지 궁금합니다. 평단 76,000원에 물려있는데 드디어 탈출각 주나요?")
                .author("개미왕자")
                .createAt(LocalDateTime.now().minusDays(1))
                .views(452)
                .likes(24)
                .stockSymbol("005930")
                .stockName("삼성전자")
                .build();

        BoardEntity p2 = BoardEntity.builder()
                .title("테슬라 이번 2분기 인도량 예측치 분석해봅니다")
                .content("기가 상하이 가동률 및 미국 현지 프로모션 추이 고려했을 때, 애널리스트 평균 컨센서스인 43만 대 수준은 가뿐히 넘어설 것으로 보입니다. FSD 12.4 버전 롤아웃 지연이 변수이지만 장기 관점은 매우 우상향입니다.")
                .author("엘론머스크팬")
                .createAt(LocalDateTime.now().minusDays(1))
                .views(890)
                .likes(72)
                .stockSymbol("TSLA")
                .stockName("테슬라")
                .build();

        BoardEntity p3 = BoardEntity.builder()
                .title("엔비디아 액분 이후 매수 타이밍 고민되네요")
                .content("단기 과열 양상 같기도 하고, 주식 분할 이후 150불 선에서 횡보하다가 3분기 실적 시즌 앞두고 다시 전고점 돌파 쏠 것 같네요. 그냥 매일 적립식 매수로 대응하는 게 최선일까요?")
                .author("반도체러버")
                .createAt(LocalDateTime.now().minusDays(2))
                .views(612)
                .likes(38)
                .stockSymbol("NVDA")
                .stockName("엔비디아")
                .build();

        boardRepository.save(p1);
        boardRepository.save(p2);
        boardRepository.save(p3);

        // 초기 댓글 생성
        CommentEntity c1 = CommentEntity.builder()
                .content("공식 입장이 나기 전까진 중립 기어 박는 게 최고입니다.")
                .author("HBM전문가")
                .createAt(LocalDateTime.now().minusHours(12))
                .board(p1)
                .build();

        CommentEntity c2 = CommentEntity.builder()
                .content("74층 주주인데 이번엔 진짜 뚫어주길 기도합니다.")
                .author("존버가승리")
                .createAt(LocalDateTime.now().minusHours(6))
                .board(p1)
                .build();

        commentRepository.save(c1);
        commentRepository.save(c2);
    }

    public Page<BoardEntity> getList(String stockSymbol, String searchTerm, int page, int size) {
        // 최신 작성일 역순(DESC) 정렬로 Pageable 설정
        Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending());
        return boardRepository.findByFilterAndSearch(stockSymbol, searchTerm, pageable);
    }

    public BoardEntity getDetail(Long id, boolean increaseView) {
        Optional<BoardEntity> boardOpt = boardRepository.findById(id);
        if (boardOpt.isPresent()) {
            BoardEntity board = boardOpt.get();
            if (increaseView) {
                board.setViews(board.getViews() + 1);
                boardRepository.save(board);
            }
            return board;
        }
        return null;
    }

    public BoardEntity write(BoardEntity board) {
        board.setCreateAt(LocalDateTime.now());
        board.setViews(0);
        board.setLikes(0);
        return boardRepository.save(board);
    }

    public BoardEntity toggleLike(Long id) {
        Optional<BoardEntity> boardOpt = boardRepository.findById(id);
        if (boardOpt.isPresent()) {
            BoardEntity board = boardOpt.get();
            board.setLikes(board.getLikes() + 1); // 단순 증가 누적으로 구현
            return boardRepository.save(board);
        }
        return null;
    }

    public CommentEntity writeComment(Long boardId, String content, String author) {
        Optional<BoardEntity> boardOpt = boardRepository.findById(boardId);
        if (boardOpt.isPresent()) {
            CommentEntity comment = CommentEntity.builder()
                    .content(content)
                    .author(author)
                    .createAt(LocalDateTime.now())
                    .board(boardOpt.get())
                    .build();
            return commentRepository.save(comment);
        }
        throw new IllegalArgumentException("Board post not found for ID: " + boardId);
    }
}
