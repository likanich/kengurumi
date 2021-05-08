package com.github.likanich.kengurumi.controllers;

import com.github.likanich.kengurumi.KengurumiApplication;
import com.github.likanich.kengurumi.repositories.CrochetRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    private final CrochetRepository crochetRepository;

    public MainController(CrochetRepository crochetRepository) {
        this.crochetRepository = crochetRepository;
    }

    @GetMapping("/")
    public String getCanvas(Model model) {
        model.addAttribute("crochets", crochetRepository.findAll());
        return "index";
    }
}
