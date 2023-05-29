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
import org.itdevspace.domain.enumeration.StatutFacture;

/**
 * A Facture.
 */
@Entity
@Table(name = "facture")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Facture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(name = "ref_facture", length = 20, nullable = false, unique = true)
    private String refFacture;

    @Column(name = "date_facture")
    private LocalDate dateFacture;

    @Column(name = "montant")
    private Double montant;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private StatutFacture etat;

    @OneToMany(mappedBy = "facture")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "activites", "estimations", "projet", "facture" }, allowSetters = true)
    private Set<Livrable> livrables = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "projets", "factures" }, allowSetters = true)
    private Client client;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "livrables", "estimations", "factures", "client" }, allowSetters = true)
    private Projet projet;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Facture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRefFacture() {
        return this.refFacture;
    }

    public Facture refFacture(String refFacture) {
        this.setRefFacture(refFacture);
        return this;
    }

    public void setRefFacture(String refFacture) {
        this.refFacture = refFacture;
    }

    public LocalDate getDateFacture() {
        return this.dateFacture;
    }

    public Facture dateFacture(LocalDate dateFacture) {
        this.setDateFacture(dateFacture);
        return this;
    }

    public void setDateFacture(LocalDate dateFacture) {
        this.dateFacture = dateFacture;
    }

    public Double getMontant() {
        return this.montant;
    }

    public Facture montant(Double montant) {
        this.setMontant(montant);
        return this;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public String getDescription() {
        return this.description;
    }

    public Facture description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public StatutFacture getEtat() {
        return this.etat;
    }

    public Facture etat(StatutFacture etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(StatutFacture etat) {
        this.etat = etat;
    }

    public Set<Livrable> getLivrables() {
        return this.livrables;
    }

    public void setLivrables(Set<Livrable> livrables) {
        if (this.livrables != null) {
            this.livrables.forEach(i -> i.setFacture(null));
        }
        if (livrables != null) {
            livrables.forEach(i -> i.setFacture(this));
        }
        this.livrables = livrables;
    }

    public Facture livrables(Set<Livrable> livrables) {
        this.setLivrables(livrables);
        return this;
    }

    public Facture addLivrable(Livrable livrable) {
        this.livrables.add(livrable);
        livrable.setFacture(this);
        return this;
    }

    public Facture removeLivrable(Livrable livrable) {
        this.livrables.remove(livrable);
        livrable.setFacture(null);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Facture client(Client client) {
        this.setClient(client);
        return this;
    }

    public Projet getProjet() {
        return this.projet;
    }

    public void setProjet(Projet projet) {
        this.projet = projet;
    }

    public Facture projet(Projet projet) {
        this.setProjet(projet);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facture)) {
            return false;
        }
        return id != null && id.equals(((Facture) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facture{" +
            "id=" + getId() +
            ", refFacture='" + getRefFacture() + "'" +
            ", dateFacture='" + getDateFacture() + "'" +
            ", montant=" + getMontant() +
            ", description='" + getDescription() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
