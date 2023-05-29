package org.itdevspace.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.itdevspace.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActiviteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Activite.class);
        Activite activite1 = new Activite();
        activite1.setId(1L);
        Activite activite2 = new Activite();
        activite2.setId(activite1.getId());
        assertThat(activite1).isEqualTo(activite2);
        activite2.setId(2L);
        assertThat(activite1).isNotEqualTo(activite2);
        activite1.setId(null);
        assertThat(activite1).isNotEqualTo(activite2);
    }
}
