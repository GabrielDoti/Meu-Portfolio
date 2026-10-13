package dev.gabrieldoti.portfolio;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import dev.gabrieldoti.portfolio.contact.ContactMessage;
import dev.gabrieldoti.portfolio.contact.EmailNotifier;

class EmailNotifierTest {

    @Test
    void ficaDesligadoSemChaveOuSemDestino() {
        assertFalse(new EmailNotifier("", "Portfolio <a@b.com>", "eu@exemplo.com").isEnabled());
        assertFalse(new EmailNotifier("", "Portfolio <a@b.com>", "").isEnabled());
        assertTrue(new EmailNotifier("", "Portfolio <a@b.com>", "eu@exemplo.com").isEnabled());
    }

    @Test
    void desligadoNaoFazNadaENaoLancaExcecao() {
        EmailNotifier notifier = new EmailNotifier("", "Portfolio <a@b.com>", "");
        assertDoesNotThrow(() -> notifier.notifyNewMessage(
                new ContactMessage("Ana", "ana@exemplo.com", "Oi, tudo bem?")));
    }
}
