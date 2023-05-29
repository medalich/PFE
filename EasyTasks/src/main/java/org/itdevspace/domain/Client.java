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
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(name = "ref_client", length = 20, nullable = false, unique = true)
    private String refClient;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "contact")
    private String contact;

    @OneToMany(mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "livrables", "estimations", "factures", "client" }, allowSetters = true)
    private Set<Projet> projets = new HashSet<>();

    @OneToMany(mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "livrables", "client", "projet" }, allowSetters = true)
    private Set<Facture> factures = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRefClient() {
        return this.refClient;
    }

    public Client refClient(String refClient) {
        this.setRefClient(refClient);
        return this;
    }

    public void setRefClient(String refClient) {
        this.refClient = refClient;
    }

    public String getNom() {
        return this.nom;
    }

    public Client nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Client prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getContact() {
        return this.contact;
    }

    public Client contact(String contact) {
        this.setContact(contact);
        return this;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Set<Projet> getProjets() {
        return this.projets;
    }

    public void setProjets(Set<Projet> projets) {
        if (this.projets != null) {
            this.projets.forEach(i -> i.setClient(null));
        }
        if (projets != null) {
            projets.forEach(i -> i.setClient(this));
        }
        this.projets = projets;
    }

    public Client projets(Set<Projet> projets) {
        this.setProjets(projets);
        return this;
    }

    public Client addProjet(Projet projet) {
        this.projets.add(projet);
        projet.setClient(this);
        return this;
    }

    public Client removeProjet(Projet projet) {
        this.projets.remove(projet);
        projet.setClient(null);
        return this;
    }

    public Set<Facture> getFactures() {
        return this.factures;
    }

    public void setFactures(Set<Facture> factures) {
        if (this.factures != null) {
            this.factures.forEach(i -> i.setClient(null));
        }
        if (factures != null) {
            factures.forEach(i -> i.setClient(this));
        }
        this.factures = factures;
    }

    public Client factures(Set<Facture> factures) {
        this.setFactures(factures);
        return this;
    }

    public Client addFacture(Facture facture) {
        this.factures.add(facture);
        facture.setClient(this);
        return this;
    }

    public Client removeFacture(Facture facture) {
        this.factures.remove(facture);
        facture.setClient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return id != null && id.equals(((Client) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", refClient='" + getRefClient() + "'" +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", contact='" + getContact() + "'" +
            "}";
    }
}
