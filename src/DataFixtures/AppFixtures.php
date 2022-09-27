<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{ /**
 * l'encodeur de mot de passe
 *
 * @var UserPasswordEncoderInterface
 */
    private $encoder ;
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder=$encoder;
    }
    public function load(ObjectManager $manager): void
    {
       $faker = Factory::create('fr_FR');
      

       for($u=0;$u<10;$u++){
            $user = new User();
            $hach= $this->encoder->encodePassword($user,'password');
            $user->setEmail($faker->email())
                 ->setPassword($hach)
                 ->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName());
                 $manager->persist($user);

     $chrono=1;
       for($c=0;$c<mt_rand(5,20);$c++){
           $customer = new Customer();
           $customer->setFirstName($faker->firstName())
           ->setLastName($faker->lastName())
           ->setCompany($faker->company())
           ->setEmail($faker->email())
           ->setUser($user);
           $manager->persist($customer);
           for($f=0;$f<mt_rand(3,10);$f++){
             $invoice = new Invoice();
             $invoice->setAmount($faker->randomFloat(2,250,5000))
             ->setSentAt($faker->dateTimeBetween('-6 months'))
             ->setStatus($faker->randomElement(['SENT','PAID','CANCELLED']))
             ->setCustomer($customer)
             ->setChrono($chrono);
             $manager->persist($invoice);
             $chrono++;
           }

       }
    }
        $manager->flush();
    }
}
