import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import { fileUploadRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest } from 'apis';
import { GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'apis/request/user';
import { useCookies } from 'react-cookie';

export default function User() {

  const { userEmail } = useParams();
  const { loginUser } = useLoginUserStore();
  const [cookies] = useCookies();
  const [isMyPage, setMyPage] = useState<boolean>(false);
  const navigate = useNavigate();

  const UserTop = () => {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
    const [nickname, setNickname] = useState<string>('');
    const [changeNickname, setChangeNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') {
        navigate(MAIN_PATH());
        return;
      }

      const { email, nickname, profileImage } = responseBody as GetUserResponseDto;
      setNickname(nickname);
      setProfileImage(profileImage);
      const isMyPage = email === loginUser?.email;
      setMyPage(isMyPage);
    };

    const fileUploadResponse = (profileImage: string | null) => {
      if (!profileImage || !cookies.accessToken) return;
      const requestBody: PatchProfileImageRequestDto = { profileImage };
      patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
    }

    const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;
      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    };

    const patchNicknameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const { code } = responseBody;
      if (code === 'VF') alert('닉네임은 필수입니다.');
      if (code === 'AF') alert('인증에 실패했습니다.');
      if (code === 'DN') alert('중복되는 닉네임입니다.');
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') return;
      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    };

    const onProfileBoxClickHandler = () => {
      if (!isMyPage || !imageInputRef.current) return;
      imageInputRef.current.click();
    };

    const onNicknameEditButtonClickHandler = () => {
      if (!isNicknameChange) {
        setChangeNickname(nickname);
        setNicknameChange(true);
        return;
      }
      if (!cookies.accessToken) return;
      const requestBody: PatchNicknameRequestDto = { nickname: changeNickname };
      patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
    };

    const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || !event.target.files.length) return;
      const file = event.target.files[0];
      const data = new FormData();
      data.append('file', file);
      fileUploadRequest(data).then(fileUploadResponse);
    };

    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setChangeNickname(event.target.value);
    };

    useEffect(() => {
      if (!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    }, [userEmail]);

    return (
      <div id='user-top-wrapper'>
        <div className='user-top-container'>
          {isMyPage ?
            <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
              {profileImage ?
                <div className='user-top-profile-image' style={{ backgroundImage: `url(${profileImage})` }}></div> :
                <div className='icon-box-large'>
                  <div className='icon image-box-white-icon'></div>
                </div>
              }
              <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onProfileImageChangeHandler} />
            </div> :
            <div className='user-top-profile-image-box' style={{ backgroundImage: `url(${profileImage || defaultProfileImage})` }}></div>
          }
          <div className='user-top-info-box'>
            <div className='user-top-info-nickname-box'>
              {isMyPage ?
                <>
                  {isNicknameChange ?
                    <input className='user-top-info-nickname-input' type='text' size={changeNickname.length + 2} value={changeNickname} onChange={onNicknameChangeHandler} /> :
                    <div className='user-top-info-nickname'>{nickname}</div>
                  }
                  <div className='icon-button' onClick={onNicknameEditButtonClickHandler}>
                    <div className='icon edit-icon'></div>
                  </div>
                </> :
                <div className='user-top-info-nickname'>{nickname}</div>
              }
            </div>
            <div className='user-top-info-email'>{userEmail}</div>
          </div>
        </div>
      </div>
    );
  };

  const UserBottom = () => {
    const [count, setCount] = useState<number>(0);
    const [userBoardList, setUserBoardList] = useState<BoardListItem[]>([]);

    const onSideCardClickHandler = () => {
      if (isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
      else if (loginUser) navigate(USER_PATH(loginUser.email));
    };

    useEffect(() => {
      setUserBoardList(latestBoardListMock);
      setCount(latestBoardListMock.length);
    }, [userEmail]);

    return (
      <div id='user-bottom-wrapper'>
        <div className='user-bottom-container'>
          <div className='user-bottom-title'>{isMyPage ? '내 게시물' : '게시물 '} <span className='emphasis'>{count}</span></div>
          <div className='user-bottom-contents-box'>
            {count === 0 ?
              <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div> :
              <div className='user-bottom-contents'>
                {userBoardList.map((boardListItem, index) => <BoardItem key={index} boardListItem={boardListItem} />)}
              </div>
            }
            <div className='user-bottom-side-box'>
              <div className='user-bottom-side-card' onClick={onSideCardClickHandler}>
                <div className='user-bottom-side-container'>
                  {isMyPage ?
                    <>
                      <div className='icon-box'>
                        <div className='icon edit-icon'></div>
                      </div>
                      <div className='user-bottom-side-text'>{'글쓰기'}</div>
                    </> :
                    <>
                      <div className='user-bottom-side-text'>{'내 게시물로 가기'}</div>
                      <div className='icon-box'>
                        <div className='icon arrow-right-icon'></div>
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='user-bottom-pagination-box'></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <UserTop />
      <UserBottom />
    </>
  );
}
