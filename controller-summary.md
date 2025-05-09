# 전체 컨트롤러 및 주요 엔드포인트/역할/연동 React 파일 요약

| 컨트롤러 파일명                        | 주요 엔드포인트(예시)                                         | 역할/설명                       | 연동 React 파일(예시)                                      |
|----------------------------------------|--------------------------------------------------------------|----------------------------------|------------------------------------------------------------|
| **AccountingController.java**          | `/api/accounting/journal-entries`<br>`/api/accounting/ledger-entries`<br>`/api/accounting/trial-balance-entries`<br>`/api/accounting/financial-statements-entries` | 회계 데이터, 보고서              | JournalEntry.js<br>Ledger.js<br>TrialBalance.js<br>FinancialStatements.js |
| **AccountingPracticeController.java**  | `/api/accounting/practice/...`                               | 회계 연습/문제                   | (해당 기능 React 파일)                                     |
| **WebController.java**                 | `/`<br>`/login`<br>`/accounting` 등                          | 웹 라우팅, 메인 페이지           | App.js, 라우팅 관련 파일                                   |
| **AuthController.java**                | `/api/auth/login`<br>`/api/auth/register`                    | 인증/회원가입                    | Login.js, Register.js                                      |
| **HomeController.java**                | `/api/home`                                                  | 홈/대시보드                      | (홈 관련 React 파일)                                       |
| **UserController.java**                | `/api/user/...`                                              | 사용자 정보                      | UserProfile.js 등                                          |
| **OrderController.java**               | `/api/order/...`                                             | 주문 관리                        | OrderList.js, OrderDetail.js                               |
| **PizzaController.java**               | `/api/pizza/...`                                             | 피자 메뉴 관리                   | PizzaList.js, PizzaDetail.js                               |
| **InventoryController.java**           | `/api/inventory/...`                                         | 재고 관리                        | InventoryList.js, InventoryDetail.js                       |

---

> 실제 프로젝트 구조에 따라 파일명/엔드포인트/연동 React 파일이 다를 수 있으니, 필요시 직접 확인해 주세요. 