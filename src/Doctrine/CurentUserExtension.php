<?php 

namespace App\Doctrine;

use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\User;

class CurentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface{
private $security;
private $authorizationChecker;

public function __construct(Security $security,AuthorizationCheckerInterface $checker)
{
    $this->security=$security;
    $this->authorizationChecker = $checker;
}

private function andWhere(QueryBuilder $queryBuilder ,string $resourceClass){

// recupere l'user connecte 
$user=$this->security->getUser(); // si user n'est coonecté entity user est null

// afficher les donnes lier au user connecte 
if(($resourceClass==Customer::class || $resourceClass==Invoice::class)
     && !$this->authorizationChecker->isGranted('ROLE_ADMIN')
     && $user instanceof User){
    $rootAlias = $queryBuilder->getRootAliases()[0];

    if($resourceClass==Customer::class){
      $queryBuilder->andWhere("$rootAlias.user=:user");
    }else if($resourceClass==Invoice::class){
         $queryBuilder->join("$rootAlias.customer","c")
         ->andWhere("c.user =:user");

    }
    $queryBuilder->setParameter('user',$user);
}

}
public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
{
    $this->andWhere($queryBuilder,$resourceClass);
    
}

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->andWhere($queryBuilder,$resourceClass);
    }
}