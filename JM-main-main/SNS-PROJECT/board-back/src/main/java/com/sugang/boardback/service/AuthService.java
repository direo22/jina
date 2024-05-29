package com.sugang.boardback.service;

import org.springframework.http.ResponseEntity;

import com.sugang.boardback.dto.request.auth.SignInRequestDto;
import com.sugang.boardback.dto.request.auth.SignUpRequestDto;
import com.sugang.boardback.dto.response.auth.SignInResponseDto;
import com.sugang.boardback.dto.response.auth.SignUpResponseDto;

public interface AuthService {
    
    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);

    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
    
}
