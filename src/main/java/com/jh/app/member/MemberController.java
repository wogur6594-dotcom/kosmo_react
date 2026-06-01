package com.jh.app.member;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member/*")
@AllArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("join")
    public void join() throws Exception {
        System.out.println("join");
    }
}
