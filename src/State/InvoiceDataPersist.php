<?php


namespace App\State;


use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Symfony\Component\Security\Core\Security;

class InvoiceDataPersist implements DataPersisterInterface
{
    private $entityManager;
    private $security;

    public function __construct(EntityManagerInterface $entityManager ,Security $security)
    {
        $this->entityManager=$entityManager;
        $this->security=$security;

    }

    public function supports($data): bool
    {
        return $data instanceof Invoice;
    }

    /**
     * @param Invoice $data
     */
    public function persist($data)
    {  
        $em=$this->entityManager;
        $user=$this->security->getUser();
        $nextChrono=$em->getRepository(Invoice::class)->findNextChrono($user);

          $data->setChrono($nextChrono);
          $data->setSentAt(new \DateTime());

        $em->persist($data);
        $em->flush();
    }

    public function remove($data)
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}