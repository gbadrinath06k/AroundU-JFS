package com.aroundu.dto;

import jakarta.validation.constraints.NotBlank;

public class PostRequest {
    @NotBlank private String content;
    @NotBlank private String category;
    // Optional data URL string (e.g. "data:image/png;base64,..."), sent by the frontend's file picker
    private String imageBase64;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
}
