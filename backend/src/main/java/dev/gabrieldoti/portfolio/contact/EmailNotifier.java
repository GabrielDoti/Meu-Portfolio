package dev.gabrieldoti.portfolio.contact;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import jakarta.annotation.PreDestroy;

@Component
public class EmailNotifier {

    private static final Logger log = LoggerFactory.getLogger(EmailNotifier.class);

    private final RestClient client;
    private final String apiKey;
    private final String from;
    private final String to;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    public EmailNotifier(
            @Value("${app.mail.resend-api-key:}") String apiKey,
            @Value("${app.mail.from:Portfolio <onboarding@resend.dev>}") String from,
            @Value("${app.mail.to:}") String to) {
        this.apiKey = apiKey;
        this.from = from;
        this.to = to;

        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build());
        factory.setReadTimeout(Duration.ofSeconds(10));
        this.client = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .requestFactory(factory)
                .build();
    }

    public boolean isEnabled() {
        return !apiKey.isBlank() && !to.isBlank();
    }

    /** Dispara o envio em segundo plano. Não lança exceção. */
    public void notifyNewMessage(ContactMessage message) {
        if (!isEnabled()) {
            return;
        }
        executor.submit(() -> send(message));
    }

    private void send(ContactMessage m) {
        try {
            Map<String, Object> payload = Map.of(
                    "from", from,
                    "to", List.of(to),
                    "subject", "[Portfolio] Nova mensagem de " + singleLine(m.getNome()),
                    "reply_to", singleLine(m.getEmail()),
                    "text", "Nome: " + m.getNome() + "\n"
                            + "E-mail: " + m.getEmail() + "\n\n"
                            + m.getMensagem());

            client.post()
                    .uri("/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("E-mail de contato enviado (mensagem id={})", m.getId());
        } catch (RuntimeException e) {
            // Nunca loga a chave: só o tipo e a mensagem do erro.
            log.warn("Falha ao enviar e-mail de contato (mensagem id={}): {}", m.getId(), e.getMessage());
        }
    }

    static String singleLine(String value) {
        return value == null ? "" : value.replaceAll("[\\r\\n]+", " ").trim();
    }

    @PreDestroy
    void shutdown() {
        executor.shutdown();
    }
}
