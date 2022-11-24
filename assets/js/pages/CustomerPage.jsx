import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import FormLoader from "../components/loaders/FormLoader";
import CustomersAPI from "../services/CustomersAPI";


const CustomerPage = ({match,history}) => {

    const {id}=match.params;
    const [customer,setCustomer]=useState({
         firstName:"",
         lastName:"",
         email:"",
         company:""

    })

    
    const [errors,setErrors]=useState({
        firstName:"",
        lastName:"",
        email:"",
        company:""

   })


   const[editing , setEditing]=useState(false);
   const[loading,setLoading]=useState(true);

   // recuperation de customers en fonction de l'identifiant
   const fetchCustomer= async (id)=>{
    try{
        const  {firstName,lastName,email,company}=await CustomersAPI.find(id)
         setCustomer({firstName,lastName,email,company});
         setLoading(false);

    }catch(error){
      history.replace("/customers");
      toast.error('Impossible de chargé le Client N° '+id);
    }

 }

 // chargement du customers  si besion au chargement du composant ou au chargement de l'identifiant

   useEffect(()=>{

   if(id!=="new"){
      setEditing(true);
      setLoading(true);
      const data=fetchCustomer(id);
      console.log(data);

   }else{
    setLoading(false);
   }
},[id]);


 
// gestion des changements des inputs dans le formulaire  
    const handleChange=({currentTarget})=>{
       const {name,value}=currentTarget;
       setCustomer({...customer,[name]:value})
       

    }

// gestion de la soumession de la formulaire     

    const handleSubmit=async event=>{
        event.preventDefault();

        try{
            if(!editing){
         await CustomersAPI.create(customer);
            
           history.replace('/customers');
           toast.success('Le client a bien été enregistré')
        }else{
         await CustomersAPI.update(id,customer);
         toast.success('Le client a bien été modifié')
            }
         setErrors({});
        }catch({response}){
            const {violations}=response.data;
            if(violations){
                const apiErrors={};
                violations.map(({propertyPath,message})=>{

                    apiErrors[propertyPath]=message;
                })
                 setErrors(apiErrors);
            }

            toast.error("des erreures dans votre formulaire")
        }

    }

return (<>
        {!editing && <h1>Création d'un nouveau Client</h1>||<h1>Modification d'un client</h1>}
       
       {!loading && <form  onSubmit={handleSubmit}>
           <Field name="firstName" label="Prenom du client" value={customer.firstName} onChange={handleChange} placeholder="Prenom du client" error={errors.firstName}/>
           <Field name="lastName" label="Nom du client" value={customer.lastName} onChange={handleChange} placeholder="Nom du client" error={errors.lastName}/>
           <Field name="email" label="Email du client" value={customer.email} onChange={handleChange} placeholder="Email du client" type="email" error={errors.email}/>
           <Field name="company" label="Entreprise du client" value={customer.company} onChange={handleChange} placeholder="Entreprise du client" error={errors.company}/>
            <button type="submit" className="btn btn-success" >Enregistrer</button>
             <Link to="/customers">Retour a la liste</Link>
        </form>|| <FormLoader/>}


     </>)


}

export default CustomerPage;
