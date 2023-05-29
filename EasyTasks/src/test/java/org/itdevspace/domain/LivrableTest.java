package org.itdevspace.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.itdevspace.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LivrableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Livrable.class);
        Livrable livrable1 = new Livrable();
        livrable1.setId(1L);
        Livrable livrable2 = new Livrable();
        livrable2.setId(livrable1.getId());
        assertThat(livrable1).isEqualTo(livrable2);
        livrable2.setId(2L);
        assertThat(livrable1).isNotEqualTo(livrable2);
        livrable1.setId(null);
        assertThat(livrable1).isNotEqualTo(livrable2);
    }
}
