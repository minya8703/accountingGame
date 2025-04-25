package com.example.accountingGame.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // React 라우터가 처리할 수 있도록 index.html로 포워딩
        return "forward:/index.html";
    }
} 