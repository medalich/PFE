package org.itdevspace.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.itdevspace.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EstimationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estimation.class);
        Estimation estimation1 = new Estimation();
        estimation1.setId(1L);
        Estimation estimation2 = new Estimation();
        estimation2.setId(estimation1.getId());
        assertThat(estimation1).isEqualTo(estimation2);
        estimation2.setId(2L);
        assertThat(estimation1).isNotEqualTo(estimation2);
        estimation1.setId(null);
        assertThat(estimation1).isNotEqualTo(estimation2);
    }
}
