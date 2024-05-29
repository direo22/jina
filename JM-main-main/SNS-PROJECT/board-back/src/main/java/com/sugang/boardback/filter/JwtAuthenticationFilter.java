package com.sugang.boardback.filter;
import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sugang.boardback.provider.JwtProvider;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtProvider jwtProvider;

    //클라이언트 요청이 서버에 도착했을 때 실행되는 필터 역할
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            //아래에 있는 parseBearerToken 메서드를 통해 토큰 추출
            String token = parseBearerToken(request);

            //토큰이 null인 경우(클라이언트 인증 x)
            if(token == null){
                filterChain.doFilter(request, response);
                return;
            }
            //토큰의 유효성x인 경우
            String email = jwtProvider.validate(token);
            if (email == null){
                filterChain.doFilter(request, response);
                return;
            }
            //즉, 토큰이 null이거나 유효성 검증이 안되면 다음 필터로 요청 진행

            //사용자 인증하는 코드 (email, 비밀번호(null), 권한 없음)
            AbstractAuthenticationToken authenticationToken = 
                new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES);
            //사용자의 인증요청에 대한 세부정보 설정
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    
            //비어있는 context 만들기
            SecurityContext SecurityContext = SecurityContextHolder.createEmptyContext();
            //비어있는 context에 authenticationToken를 추가
            SecurityContext.setAuthentication(authenticationToken);
    
            //authenticationToken를 담은 context를 외부에서 사용할 수 있게 Holder에 담아줌
            SecurityContextHolder.setContext(SecurityContext);
            
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        filterChain.doFilter(request, response);
    }

    //HTTP 요청 헤더에서 Bearer 토큰을 추출하는 메서드
    private String parseBearerToken(HttpServletRequest request){    
        //요청에서 Authorization 헤더값 가져옴
        String authorization = request.getHeader("Authorization");

        //헤더 요청에 Authorization가 포함되어있지 않으면 null리턴
        boolean hasAuthorization = StringUtils.hasText(authorization);
        if (!hasAuthorization) return null;

        //헤더의 값이 Bearer로 시작하지 않으면 null리턴
        boolean isBearer = authorization.startsWith("Bearer ");
        if(!isBearer) return null;

        //'Bearer ' 7자 제외한 실제 토큰 부분 추출
        String token = authorization.substring(7);
        return token;
    }
    
}
