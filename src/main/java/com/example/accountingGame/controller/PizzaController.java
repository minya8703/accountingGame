package com.example.accountingGame.controller;

import com.example.accountingGame.entity.Pizza;
import com.example.accountingGame.entity.PizzaType;
import com.example.accountingGame.service.PizzaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/pizzas")
@CrossOrigin(origins = "http://localhost:3000")
public class PizzaController {

    private final PizzaService pizzaService;

    @Autowired
    public PizzaController(PizzaService pizzaService) {
        this.pizzaService = pizzaService;
    }

    @PostMapping("/init")
    public ResponseEntity<List<Pizza>> initializePizzas() {
        List<Pizza> initialPizzas = Arrays.asList(
            createPizza("마르게리타", 15000, 8000, "클래식한 토마토 소스와 모차렐라 치즈의 조화", 
                "https://example.com/margherita.jpg", PizzaType.CLASSIC, 15),
            createPizza("페퍼로니", 18000, 9000, "매콤한 페퍼로니와 모차렐라 치즈의 조합", 
                "https://example.com/pepperoni.jpg", PizzaType.CLASSIC, 15),
            createPizza("바베큐 치킨", 17000, 8500, "달콤한 바베큐 소스와 치킨의 만남", 
                "https://example.com/bbq-chicken.jpg", PizzaType.CLASSIC, 16),
            createPizza("슈프림", 19000, 9500, "다양한 토핑이 들어간 클래식 피자", 
                "https://example.com/supreme.jpg", PizzaType.CLASSIC, 18),
            createPizza("치즈", 14000, 7000, "더블 모차렐라 치즈의 풍부한 맛", 
                "https://example.com/cheese.jpg", PizzaType.CLASSIC, 12)
        );

        return ResponseEntity.ok(pizzaService.saveAll(initialPizzas));
    }

    private Pizza createPizza(String name, int basePrice, int costPrice, String description, 
                            String imageUrl, PizzaType type, int preparationTime) {
        Pizza pizza = new Pizza();
        pizza.setName(name);
        pizza.setBasePrice(BigDecimal.valueOf(basePrice));
        pizza.setCostPrice(BigDecimal.valueOf(costPrice));
        pizza.setDescription(description);
        pizza.setImageUrl(imageUrl);
        pizza.setType(type);
        pizza.setPreparationTime(preparationTime);
        pizza.setIsAvailable(true);
        return pizza;
    }

    @GetMapping
    public List<Pizza> getAllPizzas() {
        return pizzaService.getAllPizzas();
    }

    @GetMapping("/available")
    public ResponseEntity<List<Pizza>> getAvailablePizzas() {
        return ResponseEntity.ok(pizzaService.getAvailablePizzas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pizza> getPizzaById(@PathVariable Long id) {
        return pizzaService.getPizzaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pizza createPizza(@RequestBody Pizza pizza) {
        return pizzaService.savePizza(pizza);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pizza> updatePizza(@PathVariable Long id, @RequestBody Pizza pizza) {
        return ResponseEntity.ok(pizzaService.updatePizza(id, pizza));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePizza(@PathVariable Long id) {
        pizzaService.deletePizza(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Pizza> toggleAvailability(@PathVariable Long id) {
        Pizza pizza = pizzaService.toggleAvailability(id);
        return ResponseEntity.ok(pizza);
    }
} 