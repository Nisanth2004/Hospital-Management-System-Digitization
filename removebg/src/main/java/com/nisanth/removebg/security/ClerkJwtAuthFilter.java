package com.nisanth.removebg.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collection;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class ClerkJwtAuthFilter extends OncePerRequestFilter {

    @Value("${clerk.frontend_api_url}")
    private String clerkIssuer;

    private final ClerkJwksProvider clerkJwksProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ SKIP webhooks
        if (path.startsWith("/api/webhooks")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ SKIP admin APIs (NO AUTH FOR NOW)
        if (path.startsWith("/api/admin")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/api/public/medical-stock")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/api/admin/beds")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/api/public")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/api/public/notifications")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/api/token")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/ws")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.startsWith("/api/admin/doctors/**")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔐 JWT REQUIRED FOR OTHER APIs
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(
                    HttpServletResponse.SC_FORBIDDEN,
                    "Authorization header missing / invalid"
            );
            return;
        }

        try {
            String token = authHeader.substring(7);

            // Extract key id (kid)
            String[] chunks = token.split("\\.");
            String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
            ObjectMapper mapper = new ObjectMapper();
            JsonNode headerNode = mapper.readTree(headerJson);
            String kid = headerNode.get("kid").asText();

            // Get public key
            PublicKey publicKey = clerkJwksProvider.getPublicKey(kid);

            // Verify token
            Claims claims = Jwts.parser()
                    .setSigningKey(publicKey)
                    .setAllowedClockSkewSeconds(60)
                    .requireIssuer(clerkIssuer)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String clerkUserId = claims.getSubject();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            clerkUserId,
                            null,
                            Collections.singletonList(
                                    new SimpleGrantedAuthority("ROLE_ADMIN")
                            )
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.sendError(
                    HttpServletResponse.SC_FORBIDDEN,
                    "Invalid JWT Token"
            );
        }
    }
}
