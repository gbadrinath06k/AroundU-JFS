package com.aroundu.repository;

import com.aroundu.model.MarketplaceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarketplaceItemRepository extends JpaRepository<MarketplaceItem, Long> {
    List<MarketplaceItem> findAllByOrderByCreatedAtDesc();
    List<MarketplaceItem> findByStatusOrderByCreatedAtDesc(String status);
}
