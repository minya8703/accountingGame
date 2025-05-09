-- 기존 데이터 삭제
DELETE FROM order_item;
DELETE FROM orders;
DELETE FROM order_status;
DELETE FROM pizza;
DELETE FROM inventory;

-- 주문 상태 초기 데이터
INSERT INTO order_status (status_name, description) VALUES
('PENDING', '주문 대기 중'),
('CONFIRMED', '주문 확인됨'),
('PREPARING', '피자 준비 중'),
('READY', '준비 완료'),
('DELIVERING', '배달 중'),
('COMPLETED', '배달 완료'),
('CANCELLED', '주문 취소됨');

-- 피자 데이터
INSERT INTO pizza (name, base_price, cost_price, type, description, imageUrl, preparation_time, is_available) VALUES
('Margherita', 12000, 5000, 'CLASSIC', 'Tomato sauce, mozzarella cheese, basil', '/images/margherita.jpg', 15, true),
('Pepperoni', 14000, 6000, 'CLASSIC', 'Tomato sauce, mozzarella cheese, pepperoni', '/images/pepperoni.jpg', 15, true),
('Hawaiian', 15000, 6500, 'CLASSIC', 'Tomato sauce, mozzarella cheese, ham, pineapple', '/images/hawaiian.jpg', 15, true),
('BBQ Chicken', 16000, 7000, 'SIGNATURE', 'BBQ sauce, mozzarella cheese, chicken, onion', '/images/bbq-chicken.jpg', 20, true),
('Bulgogi', 15000, 6500, 'SIGNATURE', 'Bulgogi sauce, mozzarella cheese, bulgogi, onion', '/images/bulgogi.jpg', 20, true),
('Sweet Potato', 14000, 6000, 'PREMIUM', 'Cream sauce, mozzarella cheese, sweet potato puree', '/images/sweet-potato.jpg', 15, true),
('Potato', 15000, 6500, 'PREMIUM', 'Cream sauce, mozzarella cheese, potato, bacon', '/images/potato.jpg', 15, true),
('Cheese', 13000, 5500, 'PREMIUM', 'Cream sauce, mozzarella cheese, cheddar cheese, parmesan cheese', '/images/cheese.jpg', 15, true),
('Bacon', 14000, 6000, 'SIGNATURE', 'Cream sauce, mozzarella cheese, bacon, onion', '/images/bacon.jpg', 20, true),
('Shrimp', 16000, 7000, 'SIGNATURE', 'Cream sauce, mozzarella cheese, shrimp, onion', '/images/shrimp.jpg', 20, true);

-- 재고 데이터
INSERT INTO inventory (ingredient_name, quantity, unit, cost_per_unit, minimum_quantity) VALUES
('Dough', 100, 'piece', 1000, 20),
('Tomato Sauce', 50, 'L', 5000, 10),
('Mozzarella Cheese', 30, 'kg', 15000, 5),
('Pepperoni', 20, 'kg', 12000, 5),
('Ham', 20, 'kg', 10000, 5),
('Pineapple', 15, 'kg', 8000, 3),
('Chicken', 15, 'kg', 12000, 5),
('Onion', 10, 'kg', 3000, 3),
('Bulgogi', 15, 'kg', 15000, 5),
('Sweet Potato Puree', 10, 'kg', 8000, 3),
('Potato', 10, 'kg', 4000, 3),
('Bacon', 10, 'kg', 12000, 3),
('Cheddar Cheese', 10, 'kg', 15000, 3),
('Parmesan Cheese', 5, 'kg', 20000, 2),
('Shrimp', 10, 'kg', 18000, 3),
('BBQ Sauce', 10, 'L', 6000, 3),
('Cream Sauce', 10, 'L', 7000, 3);

-- 샘플 주문 데이터
INSERT INTO orders (customer_name, customer_phone, delivery_address, status_id, order_date, total_amount) VALUES
('Hong Gil-dong', '010-1234-5678', '123 Teheran-ro, Gangnam-gu, Seoul', 1, '2024-01-01 12:00:00', 0),
('Kim Chul-soo', '010-2345-6789', '456 Banpo-daero, Seocho-gu, Seoul', 1, '2024-01-01 12:30:00', 0),
('Lee Young-hee', '010-3456-7890', '789 Olympic-ro, Songpa-gu, Seoul', 1, '2024-01-01 13:00:00', 0);

-- 주문 항목 데이터
INSERT INTO order_item (order_id, pizza_id, quantity, price, cost) VALUES
(1, 1, 2, 0, 0),
(1, 2, 1, 0, 0),
(2, 3, 1, 0, 0),
(2, 4, 2, 0, 0),
(3, 5, 1, 0, 0);

-- 기본 계정과목 추가
INSERT INTO account (id, name, code, type, isGroup) VALUES 
(1, '현금', '1000', 'ASSET', false),
(2, '보통예금', '1100', 'ASSET', false),
(3, '매출', '4000', 'REVENUE', false),
(4, '매출원가', '5000', 'EXPENSE', false),
(5, '재고자산', '1200', 'ASSET', false),
(6, '미수금', '1300', 'ASSET', false),
(7, '미지급금', '2000', 'LIABILITY', false),
(8, '자본금', '3000', 'EQUITY', false),
(9, '급여', '5100', 'EXPENSE', false),
(10, '임차료', '5200', 'EXPENSE', false),
(11, '수수료비용', '5300', 'EXPENSE', false),
(12, '이자수익', '4100', 'REVENUE', false),
(13, '이자비용', '5400', 'EXPENSE', false),
(14, '선급금', '1400', 'ASSET', false),
(15, '선수금', '2100', 'LIABILITY', false);

-- 분개 예제 1: 현금 매출
INSERT INTO journal_entry (id, description, date, status) VALUES 
(1, '현금 매출', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(1, 1, 1, 100000, 0),    -- 현금 차변
(2, 1, 3, 0, 100000);    -- 매출 대변

-- 분개 예제 2: 외상 매출
INSERT INTO journal_entry (id, description, date, status) VALUES 
(2, '외상 매출', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(3, 2, 6, 200000, 0),    -- 미수금 차변
(4, 2, 3, 0, 200000);    -- 매출 대변

-- 분개 예제 3: 현금 매입
INSERT INTO journal_entry (id, description, date, status) VALUES 
(3, '현금 매입', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(5, 3, 5, 300000, 0),    -- 재고자산 차변
(6, 3, 1, 0, 300000);    -- 현금 대변

-- 분개 예제 4: 외상 매입
INSERT INTO journal_entry (id, description, date, status) VALUES 
(4, '외상 매입', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(7, 4, 5, 400000, 0),    -- 재고자산 차변
(8, 4, 7, 0, 400000);    -- 미지급금 대변

-- 분개 예제 5: 급여 지급
INSERT INTO journal_entry (id, description, date, status) VALUES 
(5, '급여 지급', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(9, 5, 9, 2500000, 0),   -- 급여 차변
(10, 5, 2, 0, 2500000);  -- 보통예금 대변

-- 분개 예제 6: 임차료 선지급
INSERT INTO journal_entry (id, description, date, status) VALUES 
(6, '3개월 임차료 선지급', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(11, 6, 14, 900000, 0),  -- 선급금 차변
(12, 6, 1, 0, 900000);   -- 현금 대변

-- 분개 예제 7: 수수료 미지급
INSERT INTO journal_entry (id, description, date, status) VALUES 
(7, '수수료 미지급', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(13, 7, 11, 150000, 0),  -- 수수료비용 차변
(14, 7, 7, 0, 150000);   -- 미지급금 대변

-- 분개 예제 8: 이자 수익
INSERT INTO journal_entry (id, description, date, status) VALUES 
(8, '이자 수익 발생', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(15, 8, 2, 50000, 0),    -- 보통예금 차변
(16, 8, 12, 0, 50000);   -- 이자수익 대변

-- 분개 예제 9: 선수금 수령
INSERT INTO journal_entry (id, description, date, status) VALUES 
(9, '용역 선수금 수령', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(17, 9, 1, 1000000, 0),  -- 현금 차변
(18, 9, 15, 0, 1000000); -- 선수금 대변

-- 분개 예제 10: 자본금 납입
INSERT INTO journal_entry (id, description, date, status) VALUES 
(10, '자본금 납입', '2024-04-28', 'APPROVED');

INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(19, 10, 2, 5000000, 0),  -- 보통예금 차변
(20, 10, 8, 0, 5000000);  -- 자본금 대변

-- 피자 판매
INSERT INTO journal_entry (id, description, date, status) VALUES 
(101, '피자 판매', '2024-06-01', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(101, 101, 1, 25000, 0),    -- 현금 차변
(102, 101, 3, 0, 25000);    -- 매출 대변

-- 치즈 구입
INSERT INTO journal_entry (id, description, date, status) VALUES 
(102, '치즈 구입', '2024-06-02', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(103, 102, 4, 8000, 0),     -- 매출원가(원재료비) 차변
(104, 102, 1, 0, 8000);     -- 현금 대변

-- 임대료 지급
INSERT INTO journal_entry (id, description, date, status) VALUES 
(103, '임대료 지급', '2024-06-03', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(105, 103, 10, 500000, 0),  -- 임차료 차변
(106, 103, 1, 0, 500000);   -- 현금 대변

-- 외상 매출 (피자 외상 판매)
INSERT INTO journal_entry (id, description, date, status) VALUES 
(201, '피자 외상 판매', '2024-06-04', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(201, 201, 6, 18000, 0),    -- 미수금 차변
(202, 201, 3, 0, 18000);    -- 매출 대변

-- 급여 지급
INSERT INTO journal_entry (id, description, date, status) VALUES 
(202, '직원 급여 지급', '2024-06-05', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(203, 202, 9, 1200000, 0),   -- 급여 차변
(204, 202, 1, 0, 1200000);   -- 현금 대변

-- 외상 매입 (재료 외상 구입)
INSERT INTO journal_entry (id, description, date, status) VALUES 
(203, '토마토 소스 외상 구입', '2024-06-06', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(205, 203, 5, 50000, 0),     -- 재고자산 차변
(206, 203, 7, 0, 50000);     -- 미지급금 대변

-- 배달비 지급
INSERT INTO journal_entry (id, description, date, status) VALUES 
(204, '배달비 지급', '2024-06-07', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(207, 204, 11, 20000, 0),    -- 수수료비용 차변
(208, 204, 1, 0, 20000);     -- 현금 대변

-- 피자 재료 추가 구입
INSERT INTO journal_entry (id, description, date, status) VALUES 
(205, '모짜렐라 치즈 구입', '2024-06-08', 'APPROVED');
INSERT INTO journal_detail (id, journal_entry_id, account_id, debitAmount, creditAmount) VALUES 
(209, 205, 4, 15000, 0),     -- 매출원가(원재료비) 차변
(210, 205, 1, 0, 15000);     -- 현금 대변 