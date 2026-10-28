package com.aroundu.controller;

import com.aroundu.dto.PostRequest;
import com.aroundu.model.Post;
import com.aroundu.model.User;
import com.aroundu.repository.PostRepository;
import com.aroundu.security.CurrentUser;
import com.aroundu.service.GeoUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(@RequestParam(defaultValue = "10") double radiusKm) {
        User me = CurrentUser.get();

        List<Map<String, Object>> nearby = postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(p -> {
                    double dist = GeoUtils.distanceKm(me.getLatitude(), me.getLongitude(), p.getLatitude(), p.getLongitude());
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("author", p.getUser().getUsername());
                    m.put("content", p.getContent());
                    m.put("category", p.getCategory());
                    m.put("imageBase64", p.getImageBase64()); // null when no photo was attached
                    m.put("upvotes", p.getUpvotes());
                    m.put("distanceKm", Math.round(dist * 10.0) / 10.0);
                    m.put("createdAt", p.getCreatedAt());
                    return m;
                })
                .filter(m -> (double) m.get("distanceKm") <= radiusKm)
                .sorted(Comparator.comparingDouble(m -> (double) m.get("distanceKm")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(nearby);
    }

    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest req) {
        User me = CurrentUser.get();
        Post post = new Post(me, req.getContent(), req.getCategory(), req.getImageBase64(), me.getLatitude(), me.getLongitude());
        postRepository.save(post);
        return ResponseEntity.ok(Map.of("message", "Post created", "id", post.getId()));
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<?> upvote(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(p -> {
                    p.setUpvotes(p.getUpvotes() + 1);
                    postRepository.save(p);
                    return ResponseEntity.ok(Map.of("id", p.getId(), "upvotes", p.getUpvotes()));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
