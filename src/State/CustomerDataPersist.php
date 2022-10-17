<?php


namespace App\State;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use App\Entity\Customer;


class CustomerDataPersist implements DataPersisterInterface
{
    private $entityManager;
    private $security;

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager=$entityManager;
        $this->security=$security;

    }

    public function supports($data): bool
    {
        return $data instanceof Customer;
    }

    /**
     * @param User $data
     */
    public function persist($data)
    {
        $user= $this->security->getUser();
         $data->setUser($user);

        $this->entityManager->persist($data);
        $this->entityManager->flush();
    }

    public function remove($data)
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}