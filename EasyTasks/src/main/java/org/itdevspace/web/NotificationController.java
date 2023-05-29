package org.itdevspace.web;

import org.itdevspace.security.AuthoritiesConstants;
import org.itdevspace.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notification")

public class NotificationController {
    @Autowired
    NotificationService notificationService;
    @GetMapping("/count")
   
    public int getNonActivatedUsers(){
        return notificationService.countuserbyactivationkey();

    }
    
}
