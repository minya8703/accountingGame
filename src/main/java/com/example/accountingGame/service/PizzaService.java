package com.example.accountingGame.service;

import com.example.accountingGame.entity.Pizza;
import com.example.accountingGame.entity.PizzaType;
import com.example.accountingGame.repository.PizzaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PizzaService {

    private final PizzaRepository pizzaRepository;

    @Autowired
    public PizzaService(PizzaRepository pizzaRepository) {
        this.pizzaRepository = pizzaRepository;
    }

    // 모든 피자 목록 조회
    public List<Pizza> getAllPizzas() {
        return pizzaRepository.findAll();
    }

    // 판매 가능한 피자 목록 조회
    public List<Pizza> getAvailablePizzas() {
        return pizzaRepository.findByIsAvailableTrue();
    }

    // 피자 상세 정보 조회
    public Optional<Pizza> getPizzaById(Long id) {
        return pizzaRepository.findById(id);
    }

    // 새로운 피자 등록
    public Pizza savePizza(Pizza pizza) {
        return pizzaRepository.save(pizza);
    }

    // 피자 정보 수정
    public Pizza updatePizza(Long id, Pizza pizzaDetails) {
        Pizza pizza = pizzaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pizza not found"));

        pizza.setName(pizzaDetails.getName());
        pizza.setBasePrice(pizzaDetails.getBasePrice());
        pizza.setCostPrice(pizzaDetails.getCostPrice());
        pizza.setDescription(pizzaDetails.getDescription());
        pizza.setImageUrl(pizzaDetails.getImageUrl());
        pizza.setType(pizzaDetails.getType());
        pizza.setPreparationTime(pizzaDetails.getPreparationTime());
        pizza.setIsAvailable(pizzaDetails.getIsAvailable());

        return pizzaRepository.save(pizza);
    }

    // 피자 삭제
    public void deletePizza(Long id) {
        pizzaRepository.deleteById(id);
    }

    // 피자 판매 가능 여부 변경
    public Pizza toggleAvailability(Long id) {
        Pizza pizza = pizzaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pizza not found"));
        pizza.setIsAvailable(!pizza.getIsAvailable());
        return pizzaRepository.save(pizza);
    }

    public List<Pizza> findAll() {
        return pizzaRepository.findAll();
    }

    public Optional<Pizza> findById(Long id) {
        return pizzaRepository.findById(id);
    }

    public Pizza save(Pizza pizza) {
        return pizzaRepository.save(pizza);
    }

    public List<Pizza> saveAll(List<Pizza> pizzas) {
        return pizzaRepository.saveAll(pizzas);
    }

    public void deleteById(Long id) {
        pizzaRepository.deleteById(id);
    }
} 