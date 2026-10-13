package dev.gabrieldoti.portfolio.visit;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "visit_counter")
public class VisitCounter {

    public static final long SINGLETON_ID = 1L;

    @Id
    private Long id;

    private long total;

    protected VisitCounter() {
    
    }

    public VisitCounter(Long id, long total) {
        this.id = id;
        this.total = total;
    }

    public Long getId() {
        return id;
    }

    public long getTotal() {
        return total;
    }
}
