import axios from "axios";
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { async } from "regenerator-runtime";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import FormLoader from "../components/loaders/FormLoader";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";


const InvoicePage =({match,history})=>{

   const {id}=match.params;

  const [invoice,setInvoice]=useState({
    amount:"",
    status:'SENT',
    customer:'',

  })

  const [error,setError]=useState({
    amount:'',
    status:'',
    customer:'',

  })

  const [customers,setCustomers]=useState([])
  const[editing,setEditing]=useState(false);
  const[loading,setLoading]=useState(true);


  // gestion des changements des inputs dans le formulaire  
  const handleChange=({currentTarget})=>{
    const {name,value}=currentTarget;
    setInvoice({...invoice,[name]:value});
  }

  // recuperation de la liste des clients
  const fetchCustomer =async()=>{
    try{
      const data=await CustomersAPI.findAll()
      setCustomers(data);
     if(!invoice.customer) setInvoice({...invoice,customer:data[0].id}); // si pas de customers dans handleChange en mettre le premier client de la liste mois je choisir de utiliser le required pour resoudre ce probleme 
      setLoading(false);
    
    }catch({response}){
      history.replace("/invoices");
      toast.error('Erreur lors de chargement des factures') 
   }
  }

  // récupération de la facture

  const fetchInvoice =async()=>{
    try{
      const {amount,status,customer}=await InvoicesAPI.find(id);
      setInvoice({amount,status,customer:customer.id});
      setLoading(false);

  }catch({response}){
    history.replace("/invoices"); 
    toast.error('Impossibe de charger la facture') 
  }
  }

  // Récupération de la liste des clients a chaque chargement de composant
 useEffect(()=>{
  fetchCustomer()

},[]);

// récupération de la bonne facture quand l'identifiant de l'URL change
useEffect(()=>{
  if(id!=="new"){
   setEditing(true);
   fetchInvoice(id);
  }
},[id]);

// gestion de la soumession de la formulaire   
const handleSubmit= async(event)=>{
  event.preventDefault();
  try{
    if(invoice.amount === "") { 
      setError({amount: "Don’t forget to enter the invoice amount"}) }
      else{
        if(editing){
          InvoicesAPI.update(id,invoice);    
          toast.success('La facture a bien été modifiée');   
        }else{
          InvoicesAPI.create(invoice);    
          setError({});
          history.replace("/invoices");
          toast.success('La facture a bien été cree')   

        }
      }
  }catch({response}){
    const {violations}=response.data;
    if(violations){
        const apiErrors={};
        violations.map(({propertyPath,message})=>{

            apiErrors[propertyPath]=message;
        })
         setError(apiErrors);
    }
    toast.error("des erreures dans votre formulaire")


}


}


return (<>
 {!editing && <h1>Création d'une nouvelle Facteur</h1> ||<h1>Modification d'une Facteur</h1> }

  {!loading && <form onSubmit={handleSubmit}>
   
   <Field  name="amount" label="Montant" type="number" value={invoice.amount} onChange={handleChange} error={error.amount}  required="" placeholder="Montant de facture" />
   <label>Etat des factures</label>
    
    <Select name="customer" label="Client" onChange={handleChange} error={error.customer} value={invoice.customer} required="required">
      <option value='' key={0}>Selectionnez un client</option>
     {customers.map(customer=>(
         <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
     ))}
  
    
    </Select>

    <Select name="status" label="Etat" onChange={handleChange} error={error.status} value={invoice.status}>
     <option value="PAID">Payée</option>
     <option value="SENT">Envoyée</option>
     <option value="CANCELLED">Annulée</option>
    </Select>


    <button className="btn btn-success">Enregistrer</button>
    <Link to="/invoices"> Retour a la liste des factures</Link>
  </form>||<FormLoader/>}




</>)



}


export default InvoicePage