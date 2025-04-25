import React, { useEffect, useState } from 'react'; // useEffect와 useState 훅 사용
import axios from 'axios'; // axios 사용
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [message, setMessage] = useState('');  // message 상태 변수 생성
  const navigate = useNavigate();

  // 컴포넌트가 렌더링된 후 API 호출
  useEffect(() => {
    // Spring Boot API 호출
    axios.get('/home') // Spring Boot의 /home API 엔드포인트
      .then(response => {
        setMessage(response.data.message);  // 받은 데이터를 message 상태에 저장
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);  // 에러 처리
      });
  }, []); // 빈 배열을 두면 컴포넌트가 처음 렌더링될 때만 호출

  return (
    <main>
      <div>
        <div>
          Home 화면
        </div>
        <div>
          {message && <p>{message}</p>}  {/* 받은 메시지 출력 */}
        </div>
      </div>
    </main>
  );
};

export default Home;
