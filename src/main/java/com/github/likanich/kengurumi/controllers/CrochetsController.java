package com.github.likanich.kengurumi.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/crochets")
public class CrochetsController {

    @GetMapping()
    public String index() {
        return "crochets/index";
    }
}
