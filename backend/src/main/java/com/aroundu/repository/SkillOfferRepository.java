package com.aroundu.repository;

import com.aroundu.model.SkillOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillOfferRepository extends JpaRepository<SkillOffer, Long> {
    List<SkillOffer> findAllByOrderByCreatedAtDesc();
    List<SkillOffer> findByStatusOrderByCreatedAtDesc(String status);
}
