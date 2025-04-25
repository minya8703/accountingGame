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