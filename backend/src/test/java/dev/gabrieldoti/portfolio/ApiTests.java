package dev.gabrieldoti.portfolio;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import dev.gabrieldoti.portfolio.contact.ContactRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.admin-token=segredo-de-teste",
        "app.contact.max-per-window=3",
        // garante que os testes nunca mandem e-mail de verdade, mesmo com variáveis no ambiente
        "app.mail.resend-api-key=",
        "app.mail.to=",
        "app.cors.allowed-origins=https://meu-portfolio.test"
})
class ApiTests {

    @Autowired
    MockMvc mvc;

    @Autowired
    ContactRepository contactRepository;

    private static String body(String nome, String email, String msg, String website) {
        return """
                {"nome":"%s","email":"%s","mensagem":"%s","website":"%s"}
                """.formatted(nome, email, msg, website);
    }

    @Test
    void healthResponde() throws Exception {
        mvc.perform(get("/api/health")).andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    void novidadesVemDoJson() throws Exception {
        mvc.perform(get("/api/novidades")).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].titulo").exists());
    }

    @Test
    void visitasIncrementam() throws Exception {
        mvc.perform(post("/api/visitas")).andExpect(status().isOk());
        mvc.perform(post("/api/visitas")).andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(greaterThanOrEqualTo(2)));
        mvc.perform(get("/api/visitas")).andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(greaterThanOrEqualTo(2)));
    }

    @Test
    void contatoValidoEhSalvoEListadoComToken() throws Exception {
        long antes = contactRepository.count();
        mvc.perform(post("/api/contato").contentType(MediaType.APPLICATION_JSON)
                        .with(r -> { r.setRemoteAddr("10.0.0.1"); return r; })
                        .content(body("Ana", "ana@exemplo.com", "Oi Gabriel, vamos conversar?", "")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ok").value(true));
        org.junit.jupiter.api.Assertions.assertEquals(antes + 1, contactRepository.count());

        mvc.perform(get("/api/admin/mensagens").header("X-Admin-Token", "segredo-de-teste"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").exists());
    }

    @Test
    void contatoInvalidoRetorna400ComCampos() throws Exception {
        mvc.perform(post("/api/contato").contentType(MediaType.APPLICATION_JSON)
                        .content(body("", "nao-e-email", "oi", "")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").exists())
                .andExpect(jsonPath("$.campos.email").exists())
                .andExpect(jsonPath("$.campos.mensagem").exists());
    }

    @Test
    void honeypotNaoSalva() throws Exception {
        long antes = contactRepository.count();
        mvc.perform(post("/api/contato").contentType(MediaType.APPLICATION_JSON)
                        .content(body("Robo", "robo@spam.com", "compre agora!!!", "http://spam.com")))
                .andExpect(status().isCreated());
        org.junit.jupiter.api.Assertions.assertEquals(antes, contactRepository.count());
    }

    @Test
    void rateLimitBloqueiaDepoisDoLimite() throws Exception {
        for (int i = 0; i < 3; i++) {
            mvc.perform(post("/api/contato").contentType(MediaType.APPLICATION_JSON)
                            .with(r -> { r.setRemoteAddr("10.9.9.9"); return r; })
                            .content(body("Beto", "beto@exemplo.com", "mensagem numero " + i, "")))
                    .andExpect(status().isCreated());
        }
        mvc.perform(post("/api/contato").contentType(MediaType.APPLICATION_JSON)
                        .with(r -> { r.setRemoteAddr("10.9.9.9"); return r; })
                        .content(body("Beto", "beto@exemplo.com", "mensagem extra", "")))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void adminSemTokenOuComTokenErradoNegaAcesso() throws Exception {
        mvc.perform(get("/api/admin/mensagens")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/mensagens").header("X-Admin-Token", "errado"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void corsLiberaSoOrigemConfigurada() throws Exception {
        mvc.perform(options("/api/contato")
                        .header("Origin", "https://meu-portfolio.test")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://meu-portfolio.test"));
        mvc.perform(options("/api/contato")
                        .header("Origin", "https://site-malicioso.test")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }
}
