package com.sugang.boardback.config;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sugang.boardback.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configurable
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
            .cors().and()   //CORS 설정
            .csrf().disable()   //CSRF 비활성화
            .httpBasic().disable()  //HTTP 기본 인증 비활성화
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()   //세션 사용하지 않음
            .authorizeRequests()    //요청에 대한 인증 및 권한 부여를 설정
            .antMatchers("/", "/api/v1/auth/**", "/api/v1/search/**", "/file/**").permitAll()
            //경로에 대한 요청은 모든 사용자에게 허용
            .antMatchers(HttpMethod.GET, "/api/v1/board/**", "/api/v1/user/*").permitAll()
            //GET 메서드로 경로에 대한 요청은 모든 사용자에게 허용
            .anyRequest().authenticated();  //그 외 요청은 인증된 사용자만
            

        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        //jwtAuthenticationFilter앞에 UsernamePasswordAuthenticationFilter 추가해 JWT 인증 처리
        return httpSecurity.build();    //설정된 HttpSecurity 객체를 반환
    }
}

class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint{

    //인증 실패했을때 호출되는 메서드
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
                
        //응답 타입 JSON형태
        response.setContentType("application/json");
        //상태 코드 403(Forbidden)
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{ \"code\": \"AF\", \"message\": \"Authorization Failed\" }");
    }
    
}
