package com.aroundu.controller;

import com.aroundu.dto.SkillOfferRequest;
import com.aroundu.model.SkillOffer;
import com.aroundu.model.User;
import com.aroundu.repository.SkillOfferRepository;
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
@RequestMapping("/api/skills")
public class SkillOfferController {

    private final SkillOfferRepository skillOfferRepository;

    public SkillOfferController(SkillOfferRepository skillOfferRepository) {
        this.skillOfferRepository = skillOfferRepository;
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> nearby(@RequestParam(defaultValue = "10") double radiusKm) {
        User me = CurrentUser.get();

        List<Map<String, Object>> results = skillOfferRepository.findByStatusOrderByCreatedAtDesc("OPEN").stream()
                .map(s -> {
                    double dist = GeoUtils.distanceKm(me.getLatitude(), me.getLongitude(), s.getLatitude(), s.getLongitude());
                    return Map.<String, Object>of(
                            "id", s.getId(),
                            "user", s.getUser().getUsername(),
                            "skillOffered", s.getSkillOffered(),
                            "skillWanted", s.getSkillWanted(),
                            "description", s.getDescription() == null ? "" : s.getDescription(),
                            "distanceKm", Math.round(dist * 10.0) / 10.0,
                            "status", s.getStatus(),
                            "createdAt", s.getCreatedAt()
                    );
                })
                .filter(m -> (double) m.get("distanceKm") <= radiusKm)
                .sorted(Comparator.comparingDouble(m -> (double) m.get("distanceKm")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody SkillOfferRequest req) {
        User me = CurrentUser.get();
        SkillOffer offer = new SkillOffer(me, req.getSkillOffered(), req.getSkillWanted(), req.getDescription(),
                me.getLatitude(), me.getLongitude());
        skillOfferRepository.save(offer);
        return ResponseEntity.ok(Map.of("message", "Skill offer posted", "id", offer.getId()));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<?> findMatches(@PathVariable Long id) {
        SkillOffer mine = skillOfferRepository.findById(id).orElse(null);
        if (mine == null) return ResponseEntity.notFound().build();

        List<Map<String, Object>> matches = skillOfferRepository.findByStatusOrderByCreatedAtDesc("OPEN").stream()
                .filter(s -> !s.getId().equals(mine.getId()))
                .filter(s -> s.getSkillOffered().equalsIgnoreCase(mine.getSkillWanted())
                        || s.getSkillWanted().equalsIgnoreCase(mine.getSkillOffered()))
                .map(s -> Map.<String, Object>of(
                        "id", s.getId(),
                        "user", s.getUser().getUsername(),
                        "skillOffered", s.getSkillOffered(),
                        "skillWanted", s.getSkillWanted()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(matches);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return skillOfferRepository.findById(id)
                .map(s -> {
                    s.setStatus(status);
                    skillOfferRepository.save(s);
                    return ResponseEntity.ok(Map.of("id", s.getId(), "status", s.getStatus()));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
