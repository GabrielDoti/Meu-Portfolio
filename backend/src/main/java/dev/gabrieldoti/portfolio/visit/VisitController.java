package dev.gabrieldoti.portfolio.visit;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VisitController {

    private final VisitService service;

    public VisitController(VisitService service) {
        this.service = service;
    }

    @GetMapping("/api/visitas")
    public Map<String, Long> total() {
        return Map.of("total", service.total());
    }

    /** O front chama uma vez por sessão do navegador. */
    @PostMapping("/api/visitas")
    public Map<String, Long> register() {
        return Map.of("total", service.registerVisit());
    }
}
