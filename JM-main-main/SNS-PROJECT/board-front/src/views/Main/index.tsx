import React, { useEffect, useState } from 'react'
import './style.css';
import Top3Item from 'components/Top3Item';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock, top3BoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { useNavigate } from 'react-router-dom';
import { SEARCH_PATH } from 'constant';
import { getLatestBoardListRequest, getPopularListRequest, getTop3BoardListRequest } from 'apis';
import { GetLatestBoardListResponseDto, GetTop3BoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { usePagination } from 'hooks';
import { GetPopularListResponseDto } from 'apis/response/search';
import Pagination from 'components/Pagination';

// 변경된부분
const sidebarHTML = ` 
  <!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <!-- ICONS -->
     <script src="https://kit.fontawesome.com/def66b134a.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="style.css" />

    <title>Sidebar</title>

  //   <style>
  //   #calendar {
  //     width: ; /* 적절한 너비로 조정 */
  //     height: 900px /* 적절한 높이로 조정 */
  //     border: none;
  //   }
  // </style>

    </head>
    <body>
    <div class="sidebar">
    <div class="menu-btn">
    <div class="menu-btn" id="menu-btn">
    <span></span>
    <span></span>
    <span></span>
  </div>
    </div>
    <div class="head">
      <div class="user-img">
        <img src="user.jpg" alt="" />
      </div>
      <div class="user-details">
        
        <p class="name">rêve</p>
      </div>
    </div>
    <div class="nav">
      <div class="menu">
        <p class="title">Main</p>
        <ul>
          <li>
            <a href="http://127.0.0.1:5500/board-front/Quiz/index.html">
             <FontAwesomeIcon icon={faGear} style={{color: "#0d0d0d",}} />
                          <span class="text">퀴즈</span>
            </a>
          </li>
          <li>
         
            <a href="http://127.0.0.1:5500/board-front/DatePicker/index.html">
            
              <span class="text">오늘 할 일</span>
            </a>
          </li>
          <li>
            <a href="http://127.0.0.1:5500/board-front/CALENDAR/index.html">
              
              <span class="text">특강일정</span>
            </a>
          </li>
          <li>
            <a href="http://127.0.0.1:5500/board-front/Stopwatch/index.html">
              
              <span class="text">스탑워치</span>
              
            </a>
           
          </li>
          <li>
            <a href="http://localhost:5000/">
              
              <span class="text">채팅하기</span>
              
            </a>
           
          </li>

          
        </ul>

       <iframe src="http://127.0.0.1:5501/JM-main-main/SNS-PROJECT/board-front/src/views/CALENDAR/index2.html" title="특강" width="250px" height="400px"></iframe>
        </div>
      <div class="menu">
        <p class="title"></p>
        
      </div>
    </div>
    <div class="menu">
      <p class="title">Account</p>
      <ul>
        <li>
          <a href="#">
            
            <span class="text">setting</span>
          </a>
        </li>
        <li>
          <a href="#">
           
            <span class="text">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="credits">
    
  </div>
</div>

<!-- Jquery -->
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.js"
  integrity="sha512-8Z5++K1rB3U+USaLKG6oO8uWWBhdYsM3hmdirnOEWp8h2B1aOikj5zBzlXs8QOrvY9OxEnD2QDkbSKKpfqcIWw=="
  crossorigin="anonymous"
></script>
<script src="script.js"></script>
    </body>
  </html>
`;

//    component: 게시물 메인 화면 컴포넌트        //
export default function Main() {

  //    function: 네비게이트 함수    //
  const navigate = useNavigate();

  
  


  //    component: 게시물 메인 화면 상단 컴포넌트        //
  const MainTop = () => {

    //    state: 주간 top3 게시물 리스트 상태    //
    const [top3BoardList, setTop3BoardList] = useState<BoardListItem[]>([]);

    //    function: get top3 board list response 처리 함수    //
    const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const {code} =responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const {top3List} = responseBody as GetTop3BoardListResponseDto;
      setTop3BoardList(top3List);
    }

    //    effect: 첫 마운트 시 실행될 함수    //
    useEffect(()=> {
      getTop3BoardListRequest().then(getTop3BoardListResponse);
    }, []);
    
    //    render: 게시물 메인 화면 상단 컴포넌트 렌더링 //
    return (
      <div id='main-top-wrapper'>
          <div dangerouslySetInnerHTML={{ __html: sidebarHTML }} />

        <div className='main-top-container'>
        <div className='main-top-title'><strong>reve:꿈</strong>에서<br/>다양한 이야기를 나눠보세요</div>
        <div className='main-top-contents-box'>
          <div className='main-top-contents-title'>{'주간 TOP 3 게시물'}</div>
          <div className='main-top-contents'>
            {top3BoardList.map(top3ListItem => <Top3Item top3ListItem={top3ListItem}/>)}
            
          </div>
        </div>
      </div>
    </div>
    )
  }

  //    component: 게시물 메인 화면 하단 컴포넌트        //
  const MainBottom = () => {

    //    state: 페이지네이션 관련 상태    //
    const {
      currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    } = usePagination<BoardListItem>(5);

    //    state: 인기 검색어 리스트 상태    //
    const [popularWordList, setpopularWordList] = useState<string[]>([]);

    //    function: get latest board list response 처리 함수    //
    const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const {code} =responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const {latestList} = responseBody as GetLatestBoardListResponseDto;
      setTotalList(latestList);
    }

    //    function: get popular top3 board list response 처리 함수    //
    const getPopularListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const {code} =responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;

      const {popularWordList} = responseBody as GetPopularListResponseDto;
      setpopularWordList(popularWordList);
    }

    //    event handler: 인기 검색어 클릭 이벤트 처리    //
    const onPopularWordClickHandler = (word: string) => {
      navigate(SEARCH_PATH(word));
    }

    //    effect: 첫 마운트 시 실행될 함수    //
    useEffect(()=> {
      getLatestBoardListRequest().then(getLatestBoardListResponse);
      getPopularListRequest().then(getPopularListResponse);
    }, []);

    //    render: 게시물 메인 화면 하단 컴포넌트 렌더링 //
    return (
      <div id='main-bottom-wrapper'>
          <div className='main-bottom-container'>
        <div className='main-bottom-title'>{'최신 게시물'}</div>
        <div className='main-bottom-contents-box'>
          <div className='main-bottom-current-contents'>
            {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem}/>)}
          </div>
          <div className='main-bottom-popular-box'>
            <div className='main-bottom-popular-card'>
              <div className='main-bottom-popular-card-container'>
                <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                <div className='main-bottom-popular-card-contents'>
                  {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div> )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='main-bottom-pagination-box'>
         <Pagination 
          currentPage = {currentPage}
          currentSection = {currentSection}
          setCurrentPage = {setCurrentPage}
          setCurrentSection = {setCurrentSection}
          viewPageList = {viewPageList}
          totalSection = {totalSection}
          />
        </div>
        </div>
      </div>
    )
  }


//    render: 게시물 메인 화면 컴포넌트 렌더링 //
  return (
    <>
      <MainTop />
      <MainBottom />
    </>
  )
}