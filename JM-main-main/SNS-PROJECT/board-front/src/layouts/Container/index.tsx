import { Outlet, useLocation } from 'react-router-dom';
import Footer from 'layouts/Footer';
import Header from 'layouts/Header';
import { AUTH_PATH, MAIN_PATH } from 'constant';

//          component : 레이아웃      //
export default function Container() {

//          state : 현재 페이지 path name 상태            //
const {pathname} = useLocation();

//          render : 레이아웃 렌더링      //
  return (
    <>
       {pathname !== AUTH_PATH() && <Header />}
      <Outlet />
      {pathname !== MAIN_PATH() && pathname !== AUTH_PATH() && <Footer />}
    </>
  )
}