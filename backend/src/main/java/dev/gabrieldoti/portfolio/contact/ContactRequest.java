package dev.gabrieldoti.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "Informe seu nome")
        @Size(max = 80, message = "Nome muito longo (máx. 80)")
        String nome,

        @NotBlank(message = "Informe seu e-mail")
        @Email(message = "E-mail inválido")
        @Size(max = 120, message = "E-mail muito longo (máx. 120)")
        String email,

        @NotBlank(message = "Escreva uma mensagem")
        @Size(min = 5, max = 2000, message = "A mensagem deve ter entre 5 e 2000 caracteres")
        String mensagem,

        String website) {
}
