package com.project.Shopapp.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private long amount;

    private String bankCode;

    @NotNull(message = "Language is required")
    private String language;
}
