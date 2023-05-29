package org.itdevspace.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.itdevspace.domain.enumeration.TypeCharge;

/**
 * A ChargeJournaliere.
 */
@Entity
@Table(name = "charge_journaliere")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChargeJournaliere implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TypeCharge type;

    @Column(name = "duree")
    private Double duree;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "chargeJournalieres", "maintenances" }, allowSetters = true)
    private Ressource ressource;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ChargeJournaliere id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public ChargeJournaliere description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public ChargeJournaliere date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TypeCharge getType() {
        return this.type;
    }

    public ChargeJournaliere type(TypeCharge type) {
        this.setType(type);
        return this;
    }

    public void setType(TypeCharge type) {
        this.type = type;
    }

    public Double getDuree() {
        return this.duree;
    }

    public ChargeJournaliere duree(Double duree) {
        this.setDuree(duree);
        return this;
    }

    public void setDuree(Double duree) {
        this.duree = duree;
    }

    public Ressource getRessource() {
        return this.ressource;
    }

    public void setRessource(Ressource ressource) {
        this.ressource = ressource;
    }

    public ChargeJournaliere ressource(Ressource ressource) {
        this.setRessource(ressource);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChargeJournaliere)) {
            return false;
        }
        return id != null && id.equals(((ChargeJournaliere) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChargeJournaliere{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", type='" + getType() + "'" +
            ", duree=" + getDuree() +
            "}";
    }
}
