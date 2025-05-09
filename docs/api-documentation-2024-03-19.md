# API 문서 (2024-03-19)

## 목차
- [회계 관리 API](#회계-관리-api)
- [주문 관리 API](#주문-관리-api)
- [피자 메뉴 API](#피자-메뉴-api)
- [재고 관리 API](#재고-관리-api)
- [인증 API](#인증-api)

## 회계 관리 API

### 분개장 API
```http
GET /api/accounting/journal
```
- 분개장 목록 조회
- 기간별, 상태별 필터링 지원

```http
POST /api/accounting/journal
```
- 새로운 분개 등록
- 분개 상세 정보 포함

### 원장 API
```http
GET /api/accounting/ledger
```
- 원장 조회
- 계정별, 기간별 필터링 지원

### 시산표 API
```http
GET /api/accounting/trial-balance
```
- 시산표 조회
- 특정 시점 기준 잔액 조회

### 재무제표 API
```http
GET /api/accounting/financial-statements
```
- 재무제표 조회
- 손익계산서, 대차대조표 포함

### 회계 보고서 API
```http
GET /api/accounting/reports
```
- 회계 보고서 조회
- 기간별, 유형별 보고서 제공

## 주문 관리 API

### 주문 목록
```http
GET /api/orders
```
- 전체 주문 목록 조회
- 상태별, 기간별 필터링 지원

### 주문 등록
```http
POST /api/orders
```
- 새로운 주문 등록
- 주문 상세 정보 포함

### 주문 상세
```http
GET /api/orders/{id}
```
- 특정 주문 상세 정보 조회

### 주문 상태 변경
```http
PUT /api/orders/{id}/status
```
- 주문 상태 업데이트
- 상태: PENDING, CONFIRMED, PREPARING, READY, DELIVERING, COMPLETED, CANCELLED

### 주문 삭제
```http
DELETE /api/orders/{id}
```
- 주문 삭제 (관리자 전용)

## 피자 메뉴 API

### 피자 목록
```http
GET /api/pizzas
```
- 전체 피자 메뉴 조회
- 카테고리별 필터링 지원

### 피자 등록
```http
POST /api/pizzas
```
- 새로운 피자 메뉴 등록
- 가격, 재고 정보 포함

### 피자 상세
```http
GET /api/pizzas/{id}
```
- 특정 피자 상세 정보 조회

### 피자 수정
```http
PUT /api/pizzas/{id}
```
- 피자 정보 수정
- 가격, 재고 정보 업데이트

### 피자 삭제
```http
DELETE /api/pizzas/{id}
```
- 피자 메뉴 삭제 (관리자 전용)

## 재고 관리 API

### 재고 목록
```http
GET /api/inventory
```
- 전체 재고 목록 조회
- 품목별, 상태별 필터링 지원

### 재고 입출고
```http
POST /api/inventory
```
- 재고 입출고 등록
- 수량, 날짜 정보 포함

### 재고 상세
```http
GET /api/inventory/{id}
```
- 특정 재고 상세 정보 조회

### 재고 수정
```http
PUT /api/inventory/{id}
```
- 재고 정보 수정
- 수량, 상태 정보 업데이트

### 재고 이력
```http
GET /api/inventory/history
```
- 재고 변동 이력 조회
- 기간별, 품목별 필터링 지원

## 인증 API

### 로그인
```http
POST /api/auth/login
```
- 사용자 로그인
- JWT 토큰 발급

### 회원가입
```http
POST /api/auth/register
```
- 새로운 사용자 등록
- 기본 정보 입력

### 로그아웃
```http
POST /api/auth/logout
```
- 사용자 로그아웃
- 토큰 무효화

## 공통 사항

### 응답 형식
```json
{
  "status": "success",
  "data": {},
  "message": "성공적으로 처리되었습니다."
}
```

### 에러 응답
```json
{
  "status": "error",
  "message": "에러 메시지",
  "code": "ERROR_CODE"
}
```

### 인증
- JWT 토큰 기반 인증
- Authorization 헤더에 Bearer 토큰 포함
- 토큰 만료 시간: 1시간

### 상태 코드
- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 401: 인증 실패
- 403: 권한 없음
- 404: 리소스 없음
- 500: 서버 오류 