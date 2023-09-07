package com.redmath.project.bank.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableMethodSecurity
@Configuration
public class WebSecurityConfiguration {

    @Value("${spring.web.security.ignored:/error,/ui/**,/favicon.ico,/swagger-ui/**,/v3/api-docs,/v3/api-docs/**}")
    private String[] ignored = { "/error", "/ui/**", "/favicon.ico", "/swagger-ui/**", "/v3/api-docs",
            "/v3/api-docs/**" };

    @Value("${spring.web.security.ignored.get:/api/v1/bankAccount}")
    private String[] ignoredGet = { "/api/v1/bankAccount","/api/v1/bankAccount/**","/api/v1/bankTransaction","/api/v1/bankTransaction/**" };

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> {
            for (String ignore : ignored) {
                web.ignoring().requestMatchers(AntPathRequestMatcher.antMatcher(ignore));
            }
//            for (String ignore : ignoredGet) {
//                web.ignoring().requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.GET, ignore));
//            }

            web.ignoring().requestMatchers(new AntPathRequestMatcher("/api/v1/bankBalance","GET"))
            .requestMatchers(new AntPathRequestMatcher("/api/v1/bankBalance/**","GET"))
//                    .requestMatchers(new AntPathRequestMatcher("/api/v1/bankAccount","GET"))
//                    .requestMatchers(new AntPathRequestMatcher("/api/v1/bankAccount/**","GET"))
            .requestMatchers(new AntPathRequestMatcher("/api/v1/bankTransaction","GET"))
            .requestMatchers(new AntPathRequestMatcher("/api/v1/bankTransaction/**","GET"));
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.formLogin(config -> config.successHandler((request, response, auth) -> {
        }));

        http.logout(config -> config.logoutSuccessHandler((request, response, auth) -> {
        }));

        CookieCsrfTokenRepository csrfRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        csrfRepository.setCookiePath("/");
        http.csrf(config -> config.csrfTokenRepository(csrfRepository)
                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()));

        http.authorizeHttpRequests(config -> config
                .requestMatchers(AntPathRequestMatcher.antMatcher("/actuator/**")).hasAuthority("ADMIN")
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/bankAccount/{id}")).permitAll()
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/bankAccount/auth")).permitAll()
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/bankAccount/email/{email}")).permitAll()
//                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/bankAccount/**")).hasAuthority("ADMIN")
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/bankAccount/**")).permitAll()
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/bankTransaction")).permitAll()
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/v1/bankTransaction/**")).permitAll()
                .anyRequest().authenticated());

        return http.build();
    }
}