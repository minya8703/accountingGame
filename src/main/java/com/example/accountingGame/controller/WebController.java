package com.example.accountingGame.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController implements ErrorController {
    
    @GetMapping({"/", "/home", "/register", "/login", "/pizzas", "/pizzas/**", "/inventory"})
    public String index() {
        return "forward:/index.html";
    }

    @GetMapping("/error")
    public String error() {
        return "forward:/index.html";
    }
}
