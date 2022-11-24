import axios from "axios";
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { async } from "regenerator-runtime";
import Field from "../components/forms/Field";
import CustomersAPI from "../services/CustomersAPI";


const InvoicePage =({match})=>{

   const {idC,id}=match.params;

  const [invoice,setInvoice]=useState({
    amount:'',
    status:'',
    customer:'',

  })

  const [error,setError]=useState({
    amount:'',
    status:'',
    customer:'',

  })

  const [customer,setCustomer]=useState({
    firstName:"",
    lastName:"",
    email:"",
    company:""

})


  const STATUS= [
     "Payée",
    "Envoyée",
    "Annulée",
];

  const handleChange=({currentTarget})=>{
   const {name,value}=currentTarget;
console.log(name);
   setInvoice({...invoice,[name]:value,'customer':"/api/customers/"+idC});
   
console.log(invoice)
  }

  const getCustomer =async(idC)=>{
    try{
      const  {firstName,lastName,email,company}=await CustomersAPI.find(idC)
  
     setCustomer({firstName,lastName,email,company});
  
  }catch(error){
  
  console.log(error)}
  }

 useEffect(()=>{
     getCustomer(idC)

},[idC]);

const handleSubmit= async(event)=>{
  event.preventDefault();
  try{
    axios.post('http://127.0.0.1:8000/api/invoices',invoice)
    console.log(invoice);
  }catch(error){
    console.log(error.response);

  }


}


return (<>
 <h1>Création d'un nouveau Facteur</h1>

  <form onSubmit={handleSubmit}>
   <label>Client</label>
   <input type="text"  name="firstName" value={customer.firstName+" "+customer.lastName} className="form-control"  readOnly />

   <Field  name="amount" label="Montant" type="number" value={invoice.amount} onChange={handleChange} error="" placeholder="Montant de facture" />
   <label>Etat des factures</label>
   <select name="status" onChange={handleChange} className="form-control" placeholder="Selectionnez un status">
    
   <option value="">Selectionnez un etat</option>
    {STATUS.map((statu,index)=>(
    <option value={statu} key={index}>{statu}</option>
 
    ))}

   </select>
    <button className="btn btn-success">Enregistrer</button>
    <Link to="/invoices"> Retour a la liste des factures</Link>
  </form>




</>)



}


export default InvoicePage