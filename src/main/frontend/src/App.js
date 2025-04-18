import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./layout/Header";
import Home from "./components/Home";
import Footer from "./layout/Footer";
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
                <Route path='/' exact={true} component={Home }/>

                <Route path="/home" element={<Home />}></Route>
                {/*<Route path="/regcertinfo" element={<RegCertInfo />}></Route>*/}
                {/*<Route path="/getcertinfo/:seq" element={<GetCertInfo />}></Route>*/}
                {/*<Route path="/uptcertinfo" element={<UptCertInfo />}></Route>*/}
                {/*<Route path="/delcertinfo/:parentSeq" element={<DelCertInfo />}></Route>*/}

                {/*<Route path="/login" element={<Login />}></Route>*/}
                {/*<Route path="/join" element={<Join />}></Route>*/}
                {/*<Route path="/logout" element={<Logout />}></Route>*/}
            </Routes>
          <Footer />
        </BrowserRouter>
      </div>
  );
}

export default App;
