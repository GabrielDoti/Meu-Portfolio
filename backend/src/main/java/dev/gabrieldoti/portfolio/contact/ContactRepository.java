package dev.gabrieldoti.portfolio.contact;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findTop100ByOrderByCriadoEmDesc();
}
