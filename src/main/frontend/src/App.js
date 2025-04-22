import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layout/Header";
import Home from "./components/Home";
import Footer from "./layout/Footer";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import ErrorPage from "./components/error/ErrorPage";
import ApiTestPage from "./components/api/ApiTestPage";
// import RegCertInfo from "./components/RegCertInfo";
// import GetCertInfo from "./components/GetCertInfo";
// import UptCertInfo from "./components/UptCertInfo";
// import DelCertInfo from "./components/DelCertInfo";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {

  return (
      <div>
        <BrowserRouter>
          <Header />
            <Routes>
                <Route path='/' exact={true} element={<Home />}/>

                <Route path="/home" element={<Home />}></Route>
                <Route path="/register" element={<RegisterForm />}></Route>
                <Route path="/login" element={<LoginForm />}></Route>
                <Route path="/api-test" element={<ApiTestPage />}></Route>
                {/*<Route path="/regcertinfo" element={<RegCertInfo />}></Route>*/}
                {/*<Route path="/getcertinfo/:seq" element={<GetCertInfo />}></Route>*/}
                {/*<Route path="/uptcertinfo" element={<UptCertInfo />}></Route>*/}
                {/*<Route path="/delcertinfo/:parentSeq" element={<DelCertInfo />}></Route>*/}

                {/* 404 에러 페이지 */}
                <Route path="*" element={<ErrorPage />}></Route>
            </Routes>
          <Footer />
        </BrowserRouter>
      </div>
  );
}

export default App;
