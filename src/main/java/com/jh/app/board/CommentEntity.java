package com.jh.app.board;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_board_comments")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private LocalDateTime createAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private BoardEntity board;

    public CommentEntity() {
    }

    public CommentEntity(Long id, String content, String author, LocalDateTime createAt, BoardEntity board) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.createAt = createAt;
        this.board = board;
    }

    public static CommentEntityBuilder builder() {
        return new CommentEntityBuilder();
    }

    // Getter and Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public LocalDateTime getCreateAt() { return createAt; }
    public void setCreateAt(LocalDateTime createAt) { this.createAt = createAt; }

    public BoardEntity getBoard() { return board; }
    public void setBoard(BoardEntity board) { this.board = board; }

    // Direct Builder Implementation
    public static class CommentEntityBuilder {
        private Long id;
        private String content;
        private String author;
        private LocalDateTime createAt;
        private BoardEntity board;

        public CommentEntityBuilder id(Long id) { this.id = id; return this; }
        public CommentEntityBuilder content(String content) { this.content = content; return this; }
        public CommentEntityBuilder author(String author) { this.author = author; return this; }
        public CommentEntityBuilder createAt(LocalDateTime createAt) { this.createAt = createAt; return this; }
        public CommentEntityBuilder board(BoardEntity board) { this.board = board; return this; }

        public CommentEntity build() {
            return new CommentEntity(id, content, author, createAt, board);
        }
    }
}
