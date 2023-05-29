package org.itdevspace.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, org.itdevspace.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, org.itdevspace.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, org.itdevspace.domain.User.class.getName());
            createCache(cm, org.itdevspace.domain.Authority.class.getName());
            createCache(cm, org.itdevspace.domain.User.class.getName() + ".authorities");
            createCache(cm, org.itdevspace.domain.ChargeJournaliere.class.getName());
            createCache(cm, org.itdevspace.domain.Projet.class.getName());
            createCache(cm, org.itdevspace.domain.Projet.class.getName() + ".livrables");
            createCache(cm, org.itdevspace.domain.Projet.class.getName() + ".estimations");
            createCache(cm, org.itdevspace.domain.Livrable.class.getName());
            createCache(cm, org.itdevspace.domain.Livrable.class.getName() + ".activites");
            createCache(cm, org.itdevspace.domain.Livrable.class.getName() + ".estimations");
            createCache(cm, org.itdevspace.domain.Activite.class.getName());
            createCache(cm, org.itdevspace.domain.Activite.class.getName() + ".estimations");
            createCache(cm, org.itdevspace.domain.Maintenance.class.getName());
            createCache(cm, org.itdevspace.domain.Ressource.class.getName());
            createCache(cm, org.itdevspace.domain.Ressource.class.getName() + ".chargeJournalieres");
            createCache(cm, org.itdevspace.domain.Ressource.class.getName() + ".maintenances");
            createCache(cm, org.itdevspace.domain.Client.class.getName());
            createCache(cm, org.itdevspace.domain.Client.class.getName() + ".projets");
            createCache(cm, org.itdevspace.domain.Estimation.class.getName());
            createCache(cm, org.itdevspace.domain.Facture.class.getName());
            createCache(cm, org.itdevspace.domain.Facture.class.getName() + ".livrables");
            createCache(cm, org.itdevspace.domain.Projet.class.getName() + ".factures");
            createCache(cm, org.itdevspace.domain.Client.class.getName() + ".factures");
            
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
