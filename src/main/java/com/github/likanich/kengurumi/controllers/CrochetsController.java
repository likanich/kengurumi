package com.github.likanich.kengurumi.controllers;

import com.github.likanich.kengurumi.models.Crochet;
import com.github.likanich.kengurumi.repositories.CrochetRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/crochets")
public class CrochetsController {

    private final CrochetRepository crochetRepository;

    public CrochetsController(CrochetRepository crochetRepository) {
        this.crochetRepository = crochetRepository;
    }

    @GetMapping()
    public String index(Model model) {
        model.addAttribute("crochets", crochetRepository.findAll());
        return "crochets/index";
    }

    @GetMapping("/new")
    public String newCrochet(@ModelAttribute("crochet") Crochet crochet) {
        return "crochets/new";
    }

    @PostMapping()
    public String saveCrochet(@ModelAttribute("crochet") Crochet crochet, @RequestParam("image") MultipartFile multipartFile) {

        byte[] image;
        try {
            image = multipartFile.getBytes();
            crochet.setImageFile(image);
        } catch (IOException e) {
            e.printStackTrace();
        }
        crochetRepository.save(crochet);

        return "redirect:/crochets";
    }
}
