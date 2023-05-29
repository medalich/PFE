package org.itdevspace.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.swing.text.html.Option;
import javax.transaction.Transactional;

import org.itdevspace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.itdevspace.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional

public class NotificationService {
    private final Logger log = LoggerFactory.getLogger(NotificationService.class);
    @Autowired
    UserRepository userRepository;
    
    public int countuserbyactivationkey(){
        
    List<User>users=userRepository.findUsersByActivatedIsFalse(false);
        int size= users.size();
        log.debug("Activating user for activation key {}", users.size());
        return size;
    }

    
}
