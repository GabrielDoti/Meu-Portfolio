package dev.gabrieldoti.portfolio.visit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface VisitRepository extends JpaRepository<VisitCounter, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update VisitCounter v set v.total = v.total + 1 where v.id = :id")
    int increment(long id);
}
