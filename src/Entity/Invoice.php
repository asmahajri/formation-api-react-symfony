<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *  subresourceOperations={
 * "api_customers_invoices_get_subresource"={
 *  "normalization_context"={
 *   "groups"={"invoices_subresource"}
 * }
 * }
 * },
 * denormalizationContext={
 * "disable_type_enforcement"=true
 * },
 * itemOperations={"GET","PUT","DELETE","increment"={
 * "method"="post",
 * "path"="invoices/{id}/incriment",
 * "controller"="App\Controller\InvoicesIncrimentController",
 * "openapi_context"={
 * "summary"="Incrimenter une facture",
 * "description"="incrimenter le chrono d'une facture donnée"
 * }
 * }},
 * 
 * attributes={
 *  "order"={"chrono":"desc"}},
 *  normalizationContext={
 *      "groups"={"invoices_read"}
 * })
 * @ApiFilter(OrderFilter::class,properties={"sentAt"})
 */

class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_read","invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read","customers_read","invoices_subresource"})
     * @Assert\Type(type="numeric", message="le mountant de a facture doit etre numerique")
     * @Assert\NotBlank(message="le montant  est obligatoire")
     */

    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read","customers_read"})
     * @Assert\Type(type="DateTime",message="merci de saisir une date valide")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read","customers_read"})
     * @Assert\NotBlank(message="le status  est obligatoire")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read","customers_read"})
     * @Assert\NotBlank(message="le client  est obligatoire")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_read"})
     * @Assert\Type(type="integer", message="le chrono  doit etre un entier ")
     */
    private $chrono;

    /**
     * 
     * @Groups({"invoices_read"})
     */

    public function getUser():User{
     
        return $this->customer->getUser();

    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
