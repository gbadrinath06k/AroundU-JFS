package com.aroundu.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageRequest {
    @NotBlank
    private String room;

    @NotBlank
    private String content;

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
