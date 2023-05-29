package org.itdevspace.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.itdevspace.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChargeJournaliereTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChargeJournaliere.class);
        ChargeJournaliere chargeJournaliere1 = new ChargeJournaliere();
        chargeJournaliere1.setId(1L);
        ChargeJournaliere chargeJournaliere2 = new ChargeJournaliere();
        chargeJournaliere2.setId(chargeJournaliere1.getId());
        assertThat(chargeJournaliere1).isEqualTo(chargeJournaliere2);
        chargeJournaliere2.setId(2L);
        assertThat(chargeJournaliere1).isNotEqualTo(chargeJournaliere2);
        chargeJournaliere1.setId(null);
        assertThat(chargeJournaliere1).isNotEqualTo(chargeJournaliere2);
    }
}
