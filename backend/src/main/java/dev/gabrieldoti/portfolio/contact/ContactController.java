package dev.gabrieldoti.portfolio.contact;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactRepository repository;
    private final RateLimiter rateLimiter;
    private final EmailNotifier emailNotifier;
    private final String adminToken;
    private final int maxPerIp;
    private final int maxGlobal;

    public ContactController(
            ContactRepository repository,
            RateLimiter rateLimiter,
            EmailNotifier emailNotifier,
            @Value("${app.admin-token:}") String adminToken,
            @Value("${app.contact.max-per-window:5}") int maxPerIp,
            @Value("${app.contact.global-max-per-window:30}") int maxGlobal) {
        this.repository = repository;
        this.rateLimiter = rateLimiter;
        this.emailNotifier = emailNotifier;
        this.adminToken = adminToken;
        this.maxPerIp = maxPerIp;
        this.maxGlobal = maxGlobal;
    }

    @PostMapping("/api/contato")
    public ResponseEntity<Map<String, Object>> send(
            @Valid @RequestBody ContactRequest body, HttpServletRequest request) {

        if (body.website() != null && !body.website().isBlank()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true));
        }

        boolean allowed = rateLimiter.tryAcquire("ip:" + clientIp(request), maxPerIp)
                && rateLimiter.tryAcquire("global", maxGlobal);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Muitas mensagens em pouco tempo. Tente de novo mais tarde.");
        }

        ContactMessage saved = repository.save(new ContactMessage(
                body.nome().trim(), body.email().trim(), body.mensagem().trim()));
        log.info("Nova mensagem de contato id={}", saved.getId());
        emailNotifier.notifyNewMessage(saved); // em segundo plano; falha não afeta a resposta

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true, "id", saved.getId()));
    }


    @GetMapping("/api/admin/mensagens")
    public List<ContactMessage> list(@RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (adminToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        boolean ok = token != null && MessageDigest.isEqual(
                token.getBytes(StandardCharsets.UTF_8), adminToken.getBytes(StandardCharsets.UTF_8));
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido");
        }
        return repository.findTop100ByOrderByCriadoEmDesc();
    }


    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @Scheduled(fixedDelay = 600_000)
    void cleanRateLimiter() {
        rateLimiter.cleanup();
    }
}
