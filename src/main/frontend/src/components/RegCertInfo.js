import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import cryptoJs from 'crypto-js';

// 🔑 환경 변수에서 SecretKey 및 IV 값 가져오기 (보안 강화)
const secretKey = process.env.REACT_APP_SECRET_KEY || "default_secret_key";
const iv = process.env.REACT_APP_IV || "default_iv";

// 🔒 AES 암호화
export const encrypt = (text) => {
    const cipher = cryptoJs.AES.encrypt(text, cryptoJs.enc.Utf8.parse(secretKey), {
        iv: cryptoJs.enc.Utf8.parse(iv),
        padding: cryptoJs.pad.Pkcs7,
        mode: cryptoJs.mode.CBC,
    });
    return cipher.toString();
};

// 🔓 AES 복호화
export const decrypt = (encryptedText) => {
    const decipher = cryptoJs.AES.decrypt(encryptedText, cryptoJs.enc.Utf8.parse(secretKey), {
        iv: cryptoJs.enc.Utf8.parse(iv),
        padding: cryptoJs.pad.Pkcs7,
        mode: cryptoJs.mode.CBC,
    });
    return decipher.toString(cryptoJs.enc.Utf8);
};

const RegCertInfo = () => {
    const navigate = useNavigate();
    const [certInfo, setCertInfo] = useState({
        channel: 'NARINER',
        corpBizNo: '',
        certPw: '',
        type: ''
    });
    const [encodingPw, setEncodingPw] = useState('');
    const [files, setFiles] = useState([]);

    // 🔹 사업자 번호 입력 핸들러
    const handleCorpBizNoChange = (e) => {
        const regex = /^[0-9\b -]{0,12}$/;
        if (regex.test(e.target.value)) {
            setCertInfo(prevState => ({ ...prevState, corpBizNo: e.target.value.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') }));
        }
    };

    // 🔑 비밀번호 입력 핸들러 (암호화 적용)
    const handlePasswordChange = (e) => {
        setCertInfo(prevState => ({ ...prevState, certPw: e.target.value }));
        setEncodingPw(encrypt(e.target.value));
    };

    // 🔄 파일 업로드 핸들러 (파일 확장자 검증)
    const handleChangeFile = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const allowedExtensions = ['.key', '.der'];

        const isValidFiles = selectedFiles.every(file =>
            allowedExtensions.includes(file.name.slice(file.name.lastIndexOf('.')))
        );

        if (!isValidFiles || selectedFiles.length !== 2) {
            alert('확장자가 ".key" 또는 ".der"인 파일을 모두 선택해주세요.');
            return;
        }

        setFiles(selectedFiles);
    };

    // 🔹 인증 정보 구분 선택 핸들러
    const handleSelect = (e) => {
        setCertInfo(prevState => ({ ...prevState, type: e.target.value }));
    };

    // 🔥 최종 제출 (API 요청)
    const saveCertInfo = async (e) => {
        e.preventDefault();

        // 🔍 입력값 검증
        if (!certInfo.corpBizNo) return alert('사업자 번호를 입력해주세요.');
        if (!certInfo.certPw) return alert('인증서 비밀번호를 입력해주세요.');
        if (certInfo.type === 'default' || !certInfo.type) return alert('인증 정보 구분을 선택해주세요.');
        if (files.length !== 2) return alert('확장자가 ".key" 또는 ".der"인 파일을 모두 선택해주세요.');

        // 🔐 비밀번호 암호화 후 저장
        setCertInfo(prevState => ({ ...prevState, certPw: encodingPw }));

        // 📁 FormData 구성
        const formData = new FormData();
        formData.append("certInfo", new Blob([JSON.stringify(certInfo)], {type: "application/json"}));
        files.forEach(file => formData.append("files", file));

        // 📡 API 요청
        try {
            axios.post("http://localhost:8088/regcertinfo/create", formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
                .then(response => {
                    alert('등록되었습니다.');
                    navigate('/home');
                })
                .catch(error => {
                    if (error.response) {
                        // 백엔드에서 반환한 에러 메시지 출력
                        console.error("에러 응답:", error.response);
                        alert(`에러 발생: ${error.response.data.message || "알 수 없는 오류"}`);
                    } else if (error.request) {
                        // 요청이 이루어졌지만 응답을 받지 못한 경우
                        console.error("응답 없음:", error.request);
                        alert("서버로부터 응답을 받을 수 없습니다.");
                    } else {
                        // 요청을 보내기 전에 에러가 발생한 경우
                        console.error("요청 오류:", error.message);
                        alert("요청 중 오류가 발생했습니다.");
                    }
                });

        } catch (error) {
            console.error(error);
            alert('에러 발생: ' + error.message);
        }
    };

    // 🔻 JSX 렌더링
    return (
        <Container>
            <Form onSubmit={saveCertInfo}>
                {/* 사업자 번호 입력 */}
                <Form.Group>
                    <Form.Label>사업자 번호</Form.Label>
                    <Form.Control
                        type="text"
                        name="corpBizNo"
                        value={certInfo.corpBizNo}
                        onChange={handleCorpBizNoChange}
                    />
                </Form.Group>

                {/* 비밀번호 입력 */}
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="certPw"
                        value={certInfo.certPw}
                        onChange={handlePasswordChange}
                    />
                </Form.Group>

                {/* 인증 정보 구분 선택 */}
                <Form.Group>
                    <Form.Label>인증 정보 구분</Form.Label>
                    <Form.Select onChange={handleSelect} value={certInfo.type}>
                        <option value="default">인증 정보구분을 선택</option>
                        <option value="TAX">TAX : 전자세금계산서발행</option>
                        <option value="HTX">HTX : 홈택스로그인</option>
                    </Form.Select>
                </Form.Group>

                {/* 파일 업로드 */}
                <Form.Group>
                    <Form.Label>인증서 파일 등록 (".key", ".der" 파일 필수)</Form.Label>
                    <Form.Control
                        accept=".key,.der"
                        type="file"
                        multiple
                        onChange={handleChangeFile}
                    />
                </Form.Group>

                {/* 제출 버튼 */}
                <br />
                <button className="btn btn-outline-secondary" type="submit">
                    <i className="fas fa-pen"></i> 등록하기
                </button>
            </Form>
        </Container>
    );
};

export default RegCertInfo;
