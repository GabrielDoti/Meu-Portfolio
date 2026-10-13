package dev.gabrieldoti.portfolio.news;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
public class NewsController {

    private final List<NewsItem> items;

    public NewsController(ObjectMapper mapper) throws IOException {
        try (InputStream in = new ClassPathResource("novidades.json").getInputStream()) {
            this.items = mapper.readValue(in, new TypeReference<List<NewsItem>>() { });
        }
    }

    @GetMapping("/api/novidades")
    public List<NewsItem> list() {
        return items;
    }
}
