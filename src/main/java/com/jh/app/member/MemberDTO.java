package com.jh.app.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="tb_users")
public class MemberDTO {

    @Id
    private String username;
    
    @Column
    private String password;
    
    @Transient
    private String passwordCheck;
    
    @Column
    private String name;
    
    @Column
    private String email;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private MemberProfileDTO profile;
}
