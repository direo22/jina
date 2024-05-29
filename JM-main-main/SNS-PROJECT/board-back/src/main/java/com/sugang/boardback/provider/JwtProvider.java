package com.sugang.boardback.provider;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


//Jwt 생성, 검증하는 역할
@Component
public class JwtProvider {
    //임의로 설정한 비밀키
    @Value("${secret-key}")
    private String secretKey;
    
    //사용자 이메일 받아서 '이메일' 기반으로 JWT 생성
    public String create(String email){

        //Date 객체를 사용해 현재 시각 기준으로 1시간 뒤 만료 시간 설정
        //Instant.now(현재 시간)에서 1시간 더한 새로운 Instant 객체 생성
        //ChronoUnit.HOURS는 1이 시간 단위라는 것을 지정해줌
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        //jwt 생성
        String jwt = Jwts.builder()
            //서명 알고리즘과 비밀키(서버측에서만 알아야함) 지정
            .signWith(SignatureAlgorithm.HS256, secretKey)
            //JWT 주제 설정(이메일 주소로 주제 설정), 토큰의 발급시간 설정, 토큰의 만료시간 설정
            .setSubject(email).setIssuedAt(new Date()).setExpiration(expiredDate)
            //위에서 설정한 모든 내용을 기반으로 JWT 생성되고, 해당 JWT 문자열로 반환
            .compact();
        return jwt;
    }
    //JWT 유효성 검증
    public String validate(String jwt){
        //JWT 파싱해 클레임 가져오는거 시도
        //클레임 : 토큰에 포함된 정보
        Claims claims = null;

        //파싱 도중 에외 발생시 null 반환
        try {
            //jwt 파서가 주어진 secretKey를 이용해 jwt서명 검증
            //null이 되는 경우 비밀키가 안맞거나, 토큰이 만료된 경우
            claims = Jwts.parser().setSigningKey(secretKey)
                .parseClaimsJws(jwt).getBody(); //유효하면 getBody로 클레임 추철
        } catch (Exception exception) { //유효하지 않은 경우 예외 출력 후 null 반환
            exception.printStackTrace();
            return null;            
        }
        
        //추출한 클레임에서 주제를 가져옴
        return claims.getSubject();
    }
}