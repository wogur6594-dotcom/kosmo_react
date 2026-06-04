package com.jh.app.board;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_free_boards")
public class BoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private LocalDateTime createAt;

    @Column(nullable = false)
    private Integer views;

    @Column(nullable = false)
    private Integer likes;

    @Column(nullable = false)
    private String stockSymbol;

    @Column(nullable = false)
    private String stockName;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CommentEntity> comments = new ArrayList<>();

    public BoardEntity() {
    }

    public BoardEntity(Long id, String title, String content, String author, LocalDateTime createAt, Integer views, Integer likes, String stockSymbol, String stockName, List<CommentEntity> comments) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createAt = createAt;
        this.views = views;
        this.likes = likes;
        this.stockSymbol = stockSymbol;
        this.stockName = stockName;
        this.comments = comments != null ? comments : new ArrayList<>();
    }

    public static BoardEntityBuilder builder() {
        return new BoardEntityBuilder();
    }

    // Getter and Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public LocalDateTime getCreateAt() { return createAt; }
    public void setCreateAt(LocalDateTime createAt) { this.createAt = createAt; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public String getStockSymbol() { return stockSymbol; }
    public void setStockSymbol(String stockSymbol) { this.stockSymbol = stockSymbol; }

    public String getStockName() { return stockName; }
    public void setStockName(String stockName) { this.stockName = stockName; }

    public List<CommentEntity> getComments() { return comments; }
    public void setComments(List<CommentEntity> comments) { this.comments = comments; }

    // Direct Builder Implementation
    public static class BoardEntityBuilder {
        private Long id;
        private String title;
        private String content;
        private String author;
        private LocalDateTime createAt;
        private Integer views;
        private Integer likes;
        private String stockSymbol;
        private String stockName;
        private List<CommentEntity> comments;

        public BoardEntityBuilder id(Long id) { this.id = id; return this; }
        public BoardEntityBuilder title(String title) { this.title = title; return this; }
        public BoardEntityBuilder content(String content) { this.content = content; return this; }
        public BoardEntityBuilder author(String author) { this.author = author; return this; }
        public BoardEntityBuilder createAt(LocalDateTime createAt) { this.createAt = createAt; return this; }
        public BoardEntityBuilder views(Integer views) { this.views = views; return this; }
        public BoardEntityBuilder likes(Integer likes) { this.likes = likes; return this; }
        public BoardEntityBuilder stockSymbol(String stockSymbol) { this.stockSymbol = stockSymbol; return this; }
        public BoardEntityBuilder stockName(String stockName) { this.stockName = stockName; return this; }
        public BoardEntityBuilder comments(List<CommentEntity> comments) { this.comments = comments; return this; }

        public BoardEntity build() {
            return new BoardEntity(id, title, content, author, createAt, views, likes, stockSymbol, stockName, comments);
        }
    }
}
