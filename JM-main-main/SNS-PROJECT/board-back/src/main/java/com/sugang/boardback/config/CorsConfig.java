package com.sugang.boardback.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer{

    @Override
    public void addCorsMappings (CorsRegistry corsRegistry){
        corsRegistry    //CORS 설정 추가
            .addMapping("/**")  //모든 경로에 대해 CORS 설정 추가(모든 요청에 CORS 적용)
            .allowedMethods("*") //모든 HTTP 메서드 허용
            .allowedOrigins("*");//모든 출처 허용
    }
    
}
