package org.openedx.backend.taxonomy.infra;

import org.openedx.backend.taxonomy.domain.LearnerCurrentJobRecord;

import java.util.List;
import java.util.Optional;

public interface LearnerCurrentJobRepository {

    Optional<LearnerCurrentJobRecord> findByUsername(String username);

    LearnerCurrentJobRecord save(LearnerCurrentJobRecord record);

    List<LearnerCurrentJobRecord> list(int page, int size);

    long count();
}
