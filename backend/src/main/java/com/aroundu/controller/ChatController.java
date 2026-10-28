package com.aroundu.controller;

import com.aroundu.dto.ChatMessageRequest;
import com.aroundu.model.ChatMessage;
import com.aroundu.model.User;
import com.aroundu.repository.ChatMessageRepository;
import com.aroundu.security.CurrentUser;
import com.aroundu.service.GeoUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;

    public ChatController(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    // GET /api/chats/rooms?radiusKm=10 -> list of nearby "rooms" (grouped by location label),
    // each with distance from me and how many messages/activity they have.
    // The frontend polls this + /api/chats/{room}/messages every few seconds to simulate live chat.
    @GetMapping("/rooms")
    public ResponseEntity<?> nearbyRooms(@RequestParam(defaultValue = "10") double radiusKm) {
        User me = CurrentUser.get();

        List<ChatMessage> all = chatMessageRepository.findAllByOrderByCreatedAtDesc();

        // Group by room, keep most recent message's lat/long as the room's location, count messages
        Map<String, List<ChatMessage>> grouped = all.stream()
                .collect(Collectors.groupingBy(ChatMessage::getRoom));

        List<Map<String, Object>> rooms = grouped.entrySet().stream()
                .map(e -> {
                    ChatMessage latest = e.getValue().get(0);
                    double dist = GeoUtils.distanceKm(me.getLatitude(), me.getLongitude(), latest.getLatitude(), latest.getLongitude());
                    return Map.<String, Object>of(
                            "room", e.getKey(),
                            "messageCount", e.getValue().size(),
                            "lastMessage", latest.getContent(),
                            "lastSender", latest.getUser().getUsername(),
                            "distanceKm", Math.round(dist * 10.0) / 10.0,
                            "lastActivity", latest.getCreatedAt()
                    );
                })
                .filter(m -> (double) m.get("distanceKm") <= radiusKm)
                .sorted(Comparator.comparingDouble(m -> (double) m.get("distanceKm")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(rooms);
    }

    // GET /api/chats/{room}/messages -> full message history for a room, oldest first (for polling)
    @GetMapping("/{room}/messages")
    public ResponseEntity<?> getMessages(@PathVariable String room) {
        List<Map<String, Object>> messages = chatMessageRepository.findByRoomOrderByCreatedAtAsc(room).stream()
                .map(m -> Map.<String, Object>of(
                        "id", m.getId(),
                        "sender", m.getUser().getUsername(),
                        "content", m.getContent(),
                        "createdAt", m.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@Valid @RequestBody ChatMessageRequest req) {
        User me = CurrentUser.get();
        ChatMessage msg = new ChatMessage(me, req.getRoom(), req.getContent(), me.getLatitude(), me.getLongitude());
        chatMessageRepository.save(msg);
        return ResponseEntity.ok(Map.of("message", "Sent", "id", msg.getId()));
    }

    // Convenience: lets the frontend know what room to default to for "my area"
    @GetMapping("/my-room")
    public ResponseEntity<?> myRoom() {
        User me = CurrentUser.get();
        return ResponseEntity.ok(Map.of("room", me.getLocationLabel()));
    }
}
