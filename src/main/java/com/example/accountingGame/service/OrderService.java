package com.example.accountingGame.service;

import com.example.accountingGame.entity.Order;
import com.example.accountingGame.entity.OrderItem;
import com.example.accountingGame.entity.OrderStatus;
import com.example.accountingGame.entity.Pizza;
import com.example.accountingGame.entity.PizzaSize;
import com.example.accountingGame.repository.OrderRepository;
import com.example.accountingGame.repository.OrderStatusRepository;
import com.example.accountingGame.repository.PizzaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final PizzaRepository pizzaRepository;

    // 모든 주문 목록 조회
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 주문 상세 정보 조회
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // 새로운 주문 생성
    @Transactional
    public Order createOrder(Order order) {
        // 주문 항목의 가격과 원가 계산
        for (OrderItem item : order.getOrderItems()) {
            Pizza pizza = item.getPizza();
            if (pizza == null) {
                throw new IllegalArgumentException("피자가 선택되지 않았습니다.");
            }
            
            // 사이즈가 null인 경우 기본값 설정
            if (item.getSize() == null) {
                item.setSize(PizzaSize.MEDIUM);
            }
            
            // 가격 계산
            BigDecimal basePrice = pizza.getBasePrice();
            BigDecimal sizeMultiplier = switch (item.getSize()) {
                case SMALL -> BigDecimal.ONE;
                case MEDIUM -> new BigDecimal("1.2");
                case LARGE -> new BigDecimal("1.5");
            };
            
            BigDecimal price = basePrice.multiply(sizeMultiplier)
                                      .multiply(new BigDecimal(item.getQuantity()));
            item.setPrice(price);
            
            // 원가 계산
            BigDecimal cost = pizza.getCostPrice()
                                 .multiply(new BigDecimal(item.getQuantity()));
            item.setCost(cost);
        }
        
        // 주문 상태 설정
        OrderStatus pendingStatus = orderStatusRepository.findByStatusName("PENDING")
                .orElseGet(() -> {
                    OrderStatus status = new OrderStatus();
                    status.setStatusName("PENDING");
                    status.setDescription("주문 대기 중");
                    return orderStatusRepository.save(status);
                });
        order.setStatus(pendingStatus);
        order.setOrderDate(LocalDateTime.now());
        
        return orderRepository.save(order);
    }

    private BigDecimal getSizeMultiplier(PizzaSize size) {
        switch (size) {
            case SMALL:
                return new BigDecimal("0.8");
            case LARGE:
                return new BigDecimal("1.2");
            case MEDIUM:
            default:
                return BigDecimal.ONE;
        }
    }

    // 주문 상태 업데이트
    @Transactional
    public Order updateOrderStatus(Long orderId, String statusName) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다: " + orderId));

        OrderStatus newStatus = orderStatusRepository.findByStatusName(statusName)
                .orElseThrow(() -> new RuntimeException("주문 상태를 찾을 수 없습니다: " + statusName));

        if (!isValidStatusTransition(order.getStatus().getStatusName(), statusName)) {
            throw new RuntimeException("잘못된 상태 전환입니다: " + order.getStatus().getStatusName() + " -> " + statusName);
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // 주문 취소
    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다: " + orderId));

        if (!isCancellableStatus(order.getStatus().getStatusName())) {
            throw new RuntimeException("현재 상태에서는 주문을 취소할 수 없습니다: " + order.getStatus().getStatusName());
        }

        OrderStatus cancelledStatus = orderStatusRepository.findByStatusName("CANCELLED")
                .orElseThrow(() -> new RuntimeException("주문 상태를 찾을 수 없습니다: CANCELLED"));

        order.setStatus(cancelledStatus);
        return orderRepository.save(order);
    }

    // 상태별 주문 목록 조회
    public List<Order> getOrdersByStatus(String statusName) {
        OrderStatus status = orderStatusRepository.findByStatusName(statusName)
                .orElseThrow(() -> new RuntimeException("주문 상태를 찾을 수 없습니다: " + statusName));
        return orderRepository.findByStatus(status);
    }

    // 상태 전환 유효성 검사
    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        switch (currentStatus) {
            case "PENDING":
                return List.of("CONFIRMED", "CANCELLED").contains(newStatus);
            case "CONFIRMED":
                return List.of("PREPARING", "CANCELLED").contains(newStatus);
            case "PREPARING":
                return List.of("READY", "CANCELLED").contains(newStatus);
            case "READY":
                return List.of("DELIVERING", "CANCELLED").contains(newStatus);
            case "DELIVERING":
                return List.of("COMPLETED", "CANCELLED").contains(newStatus);
            default:
                return false;
        }
    }

    // 취소 가능한 상태인지 확인
    private boolean isCancellableStatus(String status) {
        return List.of("PENDING", "CONFIRMED", "PREPARING").contains(status);
    }
} 