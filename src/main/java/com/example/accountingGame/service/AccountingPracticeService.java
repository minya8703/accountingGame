package com.example.accountingGame.service;

import com.example.accountingGame.dto.AccountingPracticeDto;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class AccountingPracticeService {
    private final Random random = new Random();
    private final List<AccountingPracticeDto> practices = Arrays.asList(
        createPractice("현금", 
            "기업이 보유하고 있는 현금 및 당좌예금과 같이 즉시 사용할 수 있는 자산",
            "피자 가게에서 고객으로부터 현금 20,000원을 받고 피자를 판매한 경우",
            Arrays.asList(
                new AccountingPracticeDto.JournalEntry("현금", "20,000", "", "현금 수입"),
                new AccountingPracticeDto.JournalEntry("매출", "", "20,000", "피자 판매")
            ),
            "현금이 증가하면 차변에 기록하고, 매출이 발생하면 대변에 기록합니다."
        ),
        createPractice("매출채권",
            "상품이나 서비스를 판매하고 아직 대금을 받지 않은 채권",
            "고객에게 30,000원 상당의 피자를 외상으로 판매한 경우",
            Arrays.asList(
                new AccountingPracticeDto.JournalEntry("매출채권", "30,000", "", "외상 판매"),
                new AccountingPracticeDto.JournalEntry("매출", "", "30,000", "피자 판매")
            ),
            "매출채권이 증가하면 차변에 기록하고, 매출이 발생하면 대변에 기록합니다."
        ),
        createPractice("재료비",
            "상품을 생산하거나 서비스를 제공하기 위해 사용된 원재료의 비용",
            "피자 재료를 15,000원에 구매한 경우",
            Arrays.asList(
                new AccountingPracticeDto.JournalEntry("재료비", "15,000", "", "피자 재료 구매"),
                new AccountingPracticeDto.JournalEntry("현금", "", "15,000", "재료 구매 대금 지불")
            ),
            "재료비가 발생하면 차변에 기록하고, 현금이 감소하면 대변에 기록합니다."
        )
    );

    public AccountingPracticeDto getRandomPractice() {
        return practices.get(random.nextInt(practices.size()));
    }

    private AccountingPracticeDto createPractice(String term, String definition, String example, 
            List<AccountingPracticeDto.JournalEntry> journalEntries, String explanation) {
        return AccountingPracticeDto.builder()
                .term(term)
                .definition(definition)
                .example(example)
                .journalEntries(journalEntries)
                .explanation(explanation)
                .build();
    }
} 