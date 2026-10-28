package com.aroundu.controller;

import com.aroundu.dto.MarketplaceItemRequest;
import com.aroundu.model.MarketplaceItem;
import com.aroundu.model.User;
import com.aroundu.repository.MarketplaceItemRepository;
import com.aroundu.security.CurrentUser;
import com.aroundu.service.GeoUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/marketplace")
public class MarketplaceController {

    private final MarketplaceItemRepository itemRepository;

    public MarketplaceController(MarketplaceItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> nearby(@RequestParam(defaultValue = "10") double radiusKm) {
        User me = CurrentUser.get();

        List<Map<String, Object>> results = itemRepository.findByStatusOrderByCreatedAtDesc("AVAILABLE").stream()
                .map(item -> {
                    double dist = GeoUtils.distanceKm(me.getLatitude(), me.getLongitude(), item.getLatitude(), item.getLongitude());
                    return Map.<String, Object>of(
                            "id", item.getId(),
                            "seller", item.getUser().getUsername(),
                            "title", item.getTitle(),
                            "description", item.getDescription() == null ? "" : item.getDescription(),
                            "price", item.getPrice(),
                            "condition", item.getCondition(),
                            "distanceKm", Math.round(dist * 10.0) / 10.0,
                            "status", item.getStatus(),
                            "createdAt", item.getCreatedAt()
                    );
                })
                .filter(m -> (double) m.get("distanceKm") <= radiusKm)
                .sorted(Comparator.comparingDouble(m -> (double) m.get("distanceKm")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody MarketplaceItemRequest req) {
        User me = CurrentUser.get();
        MarketplaceItem item = new MarketplaceItem(me, req.getTitle(), req.getDescription(), req.getPrice(),
                req.getCondition(), me.getLatitude(), me.getLongitude());
        itemRepository.save(item);
        return ResponseEntity.ok(Map.of("message", "Item listed", "id", item.getId()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return itemRepository.findById(id)
                .map(item -> {
                    item.setStatus(status);
                    itemRepository.save(item);
                    return ResponseEntity.ok(Map.of("id", item.getId(), "status", item.getStatus()));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
