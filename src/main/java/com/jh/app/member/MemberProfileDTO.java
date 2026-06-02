package com.jh.app.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "tb_user_profiles")
public class MemberProfileDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "stored_file_name", nullable = false, unique = true)
    private String storedFileName;



    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 1:1 관계의 주인으로 설정하여 tb_users의 username을 외래 키로 참조
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", referencedColumnName = "username", unique = true)
    private MemberDTO member;
}
