package com.nisanth.removebg.config;

import com.nisanth.removebg.security.ClerkJwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ClerkJwtAuthFilter clerkJwtAuthFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth->
                        auth.requestMatchers("/api/webhooks/**","/api/admin/**","/api/public/medical-stock/**","/api/public/**","/api/admin/doctors/**","/api/public/notifications/**", "/ws/**",
                                        "/public/**","/api/token/**","/api/public/crowd-status/**")

                                .permitAll().anyRequest().authenticated())
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(clerkJwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }



    @Bean
    public CorsFilter corsFilter()
    {
        return new CorsFilter(corsConfigurationSource());
    }


    private UrlBasedCorsConfigurationSource corsConfigurationSource()
    {
        CorsConfiguration config=new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173","http://localhost:5174"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
        config.setAllowedHeaders(List.of("Authorization","Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",config);
        return source;
    }
}
