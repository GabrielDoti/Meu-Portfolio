package dev.gabrieldoti.portfolio.visit;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VisitService implements ApplicationRunner {

    private final VisitRepository repository;

    public VisitService(VisitRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!repository.existsById(VisitCounter.SINGLETON_ID)) {
            repository.save(new VisitCounter(VisitCounter.SINGLETON_ID, 0));
        }
    }

    @Transactional(readOnly = true)
    public long total() {
        return repository.findById(VisitCounter.SINGLETON_ID).map(VisitCounter::getTotal).orElse(0L);
    }

    @Transactional
    public long registerVisit() {
        repository.increment(VisitCounter.SINGLETON_ID);
        return total();
    }
}
