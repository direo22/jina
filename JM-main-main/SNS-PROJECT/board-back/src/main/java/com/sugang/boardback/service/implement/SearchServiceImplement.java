package com.sugang.boardback.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sugang.boardback.dto.response.ResponseDto;
import com.sugang.boardback.dto.response.search.GetPopularListResponseDto;
import com.sugang.boardback.dto.response.search.GetRelationListResponseDto;
import com.sugang.boardback.repository.SearchLogRepository;
import com.sugang.boardback.repository.resultSet.GetPopularListResultSet;
import com.sugang.boardback.repository.resultSet.GetRelationListResultSet;
import com.sugang.boardback.service.SearchService;
import java.util.List;
import java.util.ArrayList;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SearchServiceImplement implements SearchService{
    
    private final SearchLogRepository searchLogRepository;
    @Override
    public ResponseEntity<? super GetPopularListResponseDto> getPopularList() {
        
        List<GetPopularListResultSet> resultSets = new ArrayList<>();
        try {
            resultSets = searchLogRepository.getPopularList();
            
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetPopularListResponseDto.success(resultSets);
        
    }
    @Override
    public ResponseEntity<? super GetRelationListResponseDto> getRelationList(String searchWord) {
        
        List<GetRelationListResultSet> resultSets = new ArrayList<>();
        try {
            resultSets = searchLogRepository.getRelationList(searchWord);
            
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetRelationListResponseDto.success(resultSets);
    }
    
    
}
