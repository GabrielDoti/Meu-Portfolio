package dev.gabrieldoti.portfolio.contact;

import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RateLimiter {

    private final long windowMillis;
    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public RateLimiter(@Value("${app.contact.window-minutes:60}") long windowMinutes) {
        this.windowMillis = Duration.ofMinutes(windowMinutes).toMillis();
    }

    /** @return true se a chamada pode seguir; false se a chave estourou o limite. */
    public boolean tryAcquire(String key, int maxRequests) {
        long now = System.currentTimeMillis();
        Deque<Long> queue = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (queue) {
            while (!queue.isEmpty() && now - queue.peekFirst() > windowMillis) {
                queue.pollFirst();
            }
            if (queue.size() >= maxRequests) {
                return false;
            }
            queue.addLast(now);
            return true;
        }
    }

    /** Remove chaves antigas pra o mapa não crescer pra sempre. */
    public void cleanup() {
        long now = System.currentTimeMillis();
        hits.entrySet().removeIf(e -> {
            synchronized (e.getValue()) {
                Long last = e.getValue().peekLast();
                return last == null || now - last > windowMillis;
            }
        });
    }
}
