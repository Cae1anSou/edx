package org.openedx.backend.enterprise.infra;

import org.openedx.backend.enterprise.domain.EnterpriseLearnerRecord;

import java.util.List;
import java.util.Optional;

public interface EnterpriseLearnerRepository {

    Optional<EnterpriseLearnerRecord> findByUsername(String username);

    EnterpriseLearnerRecord save(EnterpriseLearnerRecord record);

    List<EnterpriseLearnerRecord> list(int page, int size);

    long count();
}
