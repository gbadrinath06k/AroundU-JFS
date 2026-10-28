package com.aroundu.repository;

import com.aroundu.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomOrderByCreatedAtAsc(String room);
    List<ChatMessage> findAllByOrderByCreatedAtDesc();
}
