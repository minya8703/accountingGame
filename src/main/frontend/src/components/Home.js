import React from 'react';

import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <main>
            <div>
                <div>
                  Home 화면
                </div>
            </div>
        </main>
    );
};

export default Home;