package org.itdevspace.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
 * A Activite.
 */
@Entity
@Table(name = "activite")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Activite implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(name = "ref_act", length = 20, nullable = false, unique = true)
    private String refAct;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(name = "raf")
    private String raf;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private Etat etat;

    @OneToMany(mappedBy = "activite")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "projet", "livrable", "activite" }, allowSetters = true)
    private Set<Estimation> estimations = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "activites", "estimations", "projet", "facture" }, allowSetters = true)
    private Livrable livrable;

    

    public Long getId() {
        return this.id;
    }

    public Activite id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRefAct() {
        return this.refAct;
    }

    public Activite refAct(String refAct) {
        this.setRefAct(refAct);
        return this;
    }

    public void setRefAct(String refAct) {
        this.refAct = refAct;
    }

    public String getDescription() {
        return this.description;
    }

    public Activite description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public Activite dateDebut(LocalDate dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public Activite dateFin(LocalDate dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getRaf() {
        return this.raf;
    }

    public Activite raf(String raf) {
        this.setRaf(raf);
        return this;
    }

    public void setRaf(String raf) {
        this.raf = raf;
    }

    public Etat getEtat() {
        return this.etat;
    }

    public Activite etat(Etat etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public Set<Estimation> getEstimations() {
        return this.estimations;
    }

    public void setEstimations(Set<Estimation> estimations) {
        if (this.estimations != null) {
            this.estimations.forEach(i -> i.setActivite(null));
        }
        if (estimations != null) {
            estimations.forEach(i -> i.setActivite(this));
        }
        this.estimations = estimations;
    }

    public Activite estimations(Set<Estimation> estimations) {
        this.setEstimations(estimations);
        return this;
    }

    public Activite addEstimation(Estimation estimation) {
        this.estimations.add(estimation);
        estimation.setActivite(this);
        return this;
    }

    public Activite removeEstimation(Estimation estimation) {
        this.estimations.remove(estimation);
        estimation.setActivite(null);
        return this;
    }

    public Livrable getLivrable() {
        return this.livrable;
    }

    public void setLivrable(Livrable livrable) {
        this.livrable = livrable;
    }

    public Activite livrable(Livrable livrable) {
        this.setLivrable(livrable);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Activite)) {
            return false;
        }
        return id != null && id.equals(((Activite) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Activite{" +
            "id=" + getId() +
            ", refAct='" + getRefAct() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", raf='" + getRaf() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
