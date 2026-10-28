package com.aroundu.security;

import com.aroundu.model.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentUser {
    public static User get() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
