package org.itdevspace.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.itdevspace.domain.enumeration.Etat;

/**
 * The Employee entity.
 */
@Schema(description = "The Employee entity.")
@Entity
@Table(name = "livrable")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Livrable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * The firstname attribute.
     */
    @Schema(description = "The firstname attribute.", required = true)
    @NotNull
    @Size(max = 20)
    @Column(name = "ref_livrable", length = 20, nullable = false, unique = true)
    private String refLivrable;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private Etat etat;

    @OneToMany(mappedBy = "livrable")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "estimations", "livrable" }, allowSetters = true)
    private Set<Activite> activites = new HashSet<>();

    @OneToMany(mappedBy = "livrable")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "projet", "livrable", "activite" }, allowSetters = true)
    private Set<Estimation> estimations = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "livrables", "estimations", "factures", "client" }, allowSetters = true)
    private Projet projet;

    @ManyToOne
    @JsonIgnoreProperties(value = { "livrables", "client", "projet" }, allowSetters = true)
    private Facture facture;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Livrable id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRefLivrable() {
        return this.refLivrable;
    }

    public Livrable refLivrable(String refLivrable) {
        this.setRefLivrable(refLivrable);
        return this;
    }

    public void setRefLivrable(String refLivrable) {
        this.refLivrable = refLivrable;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public Livrable dateDebut(LocalDate dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public Livrable dateFin(LocalDate dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getDescription() {
        return this.description;
    }

    public Livrable description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Etat getEtat() {
        return this.etat;
    }

    public Livrable etat(Etat etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public Set<Activite> getActivites() {
        return this.activites;
    }

    public void setActivites(Set<Activite> activites) {
        if (this.activites != null) {
            this.activites.forEach(i -> i.setLivrable(null));
        }
        if (activites != null) {
            activites.forEach(i -> i.setLivrable(this));
        }
        this.activites = activites;
    }

    public Livrable activites(Set<Activite> activites) {
        this.setActivites(activites);
        return this;
    }

    public Livrable addActivite(Activite activite) {
        this.activites.add(activite);
        activite.setLivrable(this);
        return this;
    }

    public Livrable removeActivite(Activite activite) {
        this.activites.remove(activite);
        activite.setLivrable(null);
        return this;
    }

    public Set<Estimation> getEstimations() {
        return this.estimations;
    }

    public void setEstimations(Set<Estimation> estimations) {
        if (this.estimations != null) {
            this.estimations.forEach(i -> i.setLivrable(null));
        }
        if (estimations != null) {
            estimations.forEach(i -> i.setLivrable(this));
        }
        this.estimations = estimations;
    }

    public Livrable estimations(Set<Estimation> estimations) {
        this.setEstimations(estimations);
        return this;
    }

    public Livrable addEstimation(Estimation estimation) {
        this.estimations.add(estimation);
        estimation.setLivrable(this);
        return this;
    }

    public Livrable removeEstimation(Estimation estimation) {
        this.estimations.remove(estimation);
        estimation.setLivrable(null);
        return this;
    }

    public Projet getProjet() {
        return this.projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public Livrable projet(Projet projet) {
        this.setProjet(projet);
        return this;
    }

    public Facture getFacture() {
        return this.facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }

    public Livrable facture(Facture facture) {
        this.setFacture(facture);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Livrable)) {
            return false;
        }
        return id != null && id.equals(((Livrable) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Livrable{" +
            "id=" + getId() +
            ", refLivrable='" + getRefLivrable() + "'" +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", description='" + getDescription() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
