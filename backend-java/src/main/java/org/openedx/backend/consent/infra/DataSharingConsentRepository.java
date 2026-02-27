package org.openedx.backend.consent.infra;

import org.openedx.backend.consent.domain.DataSharingConsentRecord;

import java.util.Optional;

public interface DataSharingConsentRepository {

    Optional<DataSharingConsentRecord> findByUsername(String username);

    DataSharingConsentRecord save(DataSharingConsentRecord record);
}
