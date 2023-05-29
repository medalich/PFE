package org.itdevspace.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ressource.
 */
@Entity
@Table(name = "ressource")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ressource implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "prenom", nullable = false)
    private String prenom;

    @OneToMany(mappedBy = "ressource")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ressource" }, allowSetters = true)
    private Set<ChargeJournaliere> chargeJournalieres = new HashSet<>();

    @OneToMany(mappedBy = "ressource")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ressource" }, allowSetters = true)
    private Set<Maintenance> maintenances = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ressource id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Ressource nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Ressource prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Set<ChargeJournaliere> getChargeJournalieres() {
        return this.chargeJournalieres;
    }

    public void setChargeJournalieres(Set<ChargeJournaliere> chargeJournalieres) {
        if (this.chargeJournalieres != null) {
            this.chargeJournalieres.forEach(i -> i.setRessource(null));
        }
        if (chargeJournalieres != null) {
            chargeJournalieres.forEach(i -> i.setRessource(this));
        }
        this.chargeJournalieres = chargeJournalieres;
    }

    public Ressource chargeJournalieres(Set<ChargeJournaliere> chargeJournalieres) {
        this.setChargeJournalieres(chargeJournalieres);
        return this;
    }

    public Ressource addChargeJournaliere(ChargeJournaliere chargeJournaliere) {
        this.chargeJournalieres.add(chargeJournaliere);
        chargeJournaliere.setRessource(this);
        return this;
    }

    public Ressource removeChargeJournaliere(ChargeJournaliere chargeJournaliere) {
        this.chargeJournalieres.remove(chargeJournaliere);
        chargeJournaliere.setRessource(null);
        return this;
    }

    public Set<Maintenance> getMaintenances() {
        return this.maintenances;
    }

    public void setMaintenances(Set<Maintenance> maintenances) {
        if (this.maintenances != null) {
            this.maintenances.forEach(i -> i.setRessource(null));
        }
        if (maintenances != null) {
            maintenances.forEach(i -> i.setRessource(this));
        }
        this.maintenances = maintenances;
    }

    public Ressource maintenances(Set<Maintenance> maintenances) {
        this.setMaintenances(maintenances);
        return this;
    }

    public Ressource addMaintenance(Maintenance maintenance) {
        this.maintenances.add(maintenance);
        maintenance.setRessource(this);
        return this;
    }

    public Ressource removeMaintenance(Maintenance maintenance) {
        this.maintenances.remove(maintenance);
        maintenance.setRessource(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ressource)) {
            return false;
        }
        return id != null && id.equals(((Ressource) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ressource{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            "}";
    }
}
