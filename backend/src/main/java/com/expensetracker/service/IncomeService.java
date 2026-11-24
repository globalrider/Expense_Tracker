package com.expensetracker.service;

import com.expensetracker.dto.IncomeDto;
import com.expensetracker.model.Income;
import com.expensetracker.model.User;
import com.expensetracker.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    // Fetch all incomes with optional filters (month or source or date range)
    public List<IncomeDto> getIncomesForUser(User user, String month, String source, LocalDate startDate, LocalDate endDate) {
        List<Income> list;

        if (month != null && !month.isBlank()) {
            String[] parts = month.split("-");
            int year = Integer.parseInt(parts[0]);
            int monthNum = Integer.parseInt(parts[1]);
            LocalDate start = LocalDate.of(year, monthNum, 1);
            LocalDate end = start.plusMonths(1).minusDays(1);
            list = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
        } else if (startDate != null && endDate != null) {
            list = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        } else if (source != null && !source.isBlank() && !"ALL".equalsIgnoreCase(source)) {
            list = incomeRepository.findByUserAndSourceOrderByDateDesc(user, source);
        } else {
            list = incomeRepository.findByUserOrderByDateDesc(user);
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    // Fetch single income record by ID
    public IncomeDto getIncomeById(User user, Long id) {
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Income record not found with id: " + id));
        return toDto(income);
    }

    // Create new income record
    public IncomeDto createIncome(User user, IncomeDto dto) {
        Income income = new Income();
        income.setUser(user);
        income.setSource(dto.getSource());
        income.setAmount(dto.getAmount());
        income.setDate(dto.getDate());
        income.setReference(dto.getReference());
        income.setNotes(dto.getNotes());

        Income saved = incomeRepository.save(income);
        return toDto(saved);
    }

    // Update income record
    public IncomeDto updateIncome(User user, Long id, IncomeDto dto) {
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Income not found or unauthorized"));

        income.setSource(dto.getSource());
        income.setAmount(dto.getAmount());
        income.setDate(dto.getDate());
        income.setReference(dto.getReference());
        income.setNotes(dto.getNotes());

        return toDto(incomeRepository.save(income));
    }

    // Delete income record
    public void deleteIncome(User user, Long id) {
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Income not found or unauthorized"));
        incomeRepository.delete(income);
    }

    public IncomeDto toDto(Income income) {
        IncomeDto dto = new IncomeDto();
        dto.setId(income.getId());
        dto.setSource(income.getSource());
        dto.setAmount(income.getAmount());
        dto.setDate(income.getDate());
        dto.setReference(income.getReference());
        dto.setNotes(income.getNotes());
        return dto;
    }
}
