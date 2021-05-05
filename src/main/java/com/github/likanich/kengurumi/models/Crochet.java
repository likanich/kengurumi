package com.github.likanich.kengurumi.models;

import javax.persistence.*;
import java.util.Base64;

@Entity
public class Crochet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Lob
    private byte[] imageFile;

    @Column(columnDefinition="TEXT")
    private String description;

    public Crochet() {
    }

    public Crochet(Long id, String name, byte[] imageFile, String description) {
        this.id = id;
        this.name = name;
        this.imageFile = imageFile;
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImageFile() {
        return imageFile;
    }

    public void setImageFile(byte[] image) {
        this.imageFile = image;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    @Transient
    public String getImagePath() {
        if (imageFile == null) return null;

        return "/images/crochets/" + imageFile;
    }

    public String getImgData() {
        return Base64.getMimeEncoder().encodeToString(imageFile);
    }

}
