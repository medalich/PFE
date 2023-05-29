package org.itdevspace.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.itdevspace.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RessourceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ressource.class);
        Ressource ressource1 = new Ressource();
        ressource1.setId(1L);
        Ressource ressource2 = new Ressource();
        ressource2.setId(ressource1.getId());
        assertThat(ressource1).isEqualTo(ressource2);
        ressource2.setId(2L);
        assertThat(ressource1).isNotEqualTo(ressource2);
        ressource1.setId(null);
        assertThat(ressource1).isNotEqualTo(ressource2);
    }
}
