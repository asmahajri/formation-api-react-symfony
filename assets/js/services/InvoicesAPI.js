import axios from "axios";
import {INVOICES_API} from "../config";


function findAll(){

    return(
        axios.get(INVOICES_API)
        .then(response=>response.data["hydra:member"])
    );
}
function  deleteInvoice(id){
  return( axios.delete(INVOICES_API+"/"+id));

}

function find(id){
    return axios.get(INVOICES_API+"/"+id).then(response=>response.data)
}

function update(id,invoice)
{
    return axios.put(INVOICES_API+"/"+id,{...invoice,amount: Number(invoice.amount), customer: `/api/customers/${invoice.customer}`})

}

function create(invoice){
   return axios.post(INVOICES_API,{...invoice,amount: invoice.amount, customer: `/api/customers/${invoice.customer}`})

}

export default{
    findAll,
    delete:deleteInvoice,
    find,
    update,
    create
}