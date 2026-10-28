package com.aroundu.dto;

import jakarta.validation.constraints.NotBlank;

public class SkillOfferRequest {
    @NotBlank private String skillOffered;
    @NotBlank private String skillWanted;
    private String description;

    public String getSkillOffered() { return skillOffered; }
    public void setSkillOffered(String skillOffered) { this.skillOffered = skillOffered; }
    public String getSkillWanted() { return skillWanted; }
    public void setSkillWanted(String skillWanted) { this.skillWanted = skillWanted; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
