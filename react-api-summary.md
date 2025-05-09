# React 파일별 API 호출 요약

| React 파일명                                      | 호출하는 API 엔드포인트(예시)                                 | 설명/비고                       |
|---------------------------------------------------|--------------------------------------------------------------|----------------------------------|
| **JournalEntry.js**                               | `/api/accounting/journal-entries?startDate=...&endDate=...`  | 분개장(전표) 데이터 조회         |
| **Ledger.js**                                     | `/api/accounting/ledger-entries?startDate=...&endDate=...&accountCode=...` | 원장 데이터 조회                |
| **TrialBalance.js**                               | `/api/accounting/trial-balance-entries?startDate=...&endDate=...` | 시산표 데이터 조회              |
| **FinancialStatements.js**                        | `/api/accounting/financial-statements-entries?startDate=...&endDate=...` | 재무제표 데이터 조회            |
| **OrderList.js**                                  | `/api/order/list` 등                                         | 주문 목록 조회                   |
| **OrderDetail.js**                                | `/api/order/{id}`                                            | 주문 상세 조회                   |
| **PizzaList.js**                                  | `/api/pizza/list`                                            | 피자 메뉴 목록                   |
| **InventoryList.js**                              | `/api/inventory/list`                                        | 재고 목록                        |
| **Login.js**                                      | `/api/auth/login`                                            | 로그인                           |
| **Register.js**                                   | `/api/auth/register`                                         | 회원가입                         |
| **UserProfile.js**                                | `/api/user/profile`                                          | 사용자 정보 조회                 |

---

> 실제 프로젝트 구조에 따라 파일명/엔드포인트가 다를 수 있으니, 필요시 직접 확인해 주세요. 