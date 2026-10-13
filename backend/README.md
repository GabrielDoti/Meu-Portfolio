# backend (API)

API do portfólio em **Spring Boot 3.5 / Java 21**. A documentação geral do projeto está no [README da raiz](../README.md).

## Endpoints

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/health` | Health check (Render e "acordar" a API) |
| POST | `/api/contato` | Recebe `{nome, email, mensagem, website}`, valida, salva e avisa por e-mail. `website` é o honeypot anti-robô (deve ir vazio) |
| GET | `/api/novidades` | Lista as novidades de `src/main/resources/novidades.json` |
| GET | `/api/visitas` | Total de visitas |
| POST | `/api/visitas` | Registra uma visita e devolve o total |
| GET | `/api/admin/mensagens` | Últimas 100 mensagens. Exige o header `X-Admin-Token` igual a `ADMIN_TOKEN`; sem a variável o endpoint responde 404 |

Contato: validação com erro por campo (400), limite de 5 envios por IP e 30 no total por hora (429).

## Rodar

```bash
mvn spring-boot:run   # http://localhost:8080 (H2 em memória: os dados somem ao reiniciar)
mvn test
```

## Variáveis de ambiente

| Variável | Pra quê |
|---|---|
| `SPRING_PROFILES_ACTIVE=prod` | Usa PostgreSQL em vez de H2 |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexão com o PostgreSQL (o `render.yaml` preenche sozinho) |
| `CORS_ORIGINS` | URL(s) do front separadas por vírgula. Sem isso o navegador bloqueia o formulário em produção |
| `ADMIN_TOKEN` | Token pra ler as mensagens em `/api/admin/mensagens` |
| `RESEND_API_KEY` | Chave da API do [Resend](https://resend.com) (envio do e-mail de contato) |
| `CONTACT_TO` | E-mail que recebe as mensagens |
| `MAIL_FROM` | Remetente (padrão: `Portfolio <onboarding@resend.dev>`) |

Se `RESEND_API_KEY` ou `CONTACT_TO` estiverem vazios, o aviso por e-mail fica desligado e a mensagem continua sendo salva no banco normalmente.

> **Por que Resend e não SMTP?** O plano gratuito do Render bloqueia as portas SMTP de saída, então o envio é feito por API HTTPS.
> Sem verificar um domínio, o Resend em geral só permite enviar para o e-mail da própria conta (confira na documentação deles). Pra um portfólio, usar o seu e-mail em `CONTACT_TO` resolve.
