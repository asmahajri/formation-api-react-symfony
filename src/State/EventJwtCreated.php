<?php

namespace App\State;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class EventJwtCreated{
    
    
    public function updateJwtData(JwtCreatedEvent $event)
{

    // recuperer l'user connecte 
      $user= $event->getUser();

   // enrechir les datas

   $data = $event->getData();

   $data['firstName']=$user->getFirstName();
   $data['lastName']=$user->getLastName();

}



}