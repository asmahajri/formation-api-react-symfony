import axios from "axios";


function findAll(){

    return(
        axios.get("http://127.0.0.1:8000/api/customers")
        .then(response=>response.data["hydra:member"])
    );
}
function  deleteCustomer(id){
  return( axios.delete("http://127.0.0.1:8000/api/customers/"+id));

}

function find(id){

    return axios.get("http://127.0.0.1:8000/api/customers/"+id)
        .then(response=>response.data);
}

function create(customer){
    return axios.post("http://127.0.0.1:8000/api/customers",customer).then(responce=>console.log(responce));
}

function update(id,customer){

    return  axios.put("http://127.0.0.1:8000/api/customers/"+id,customer).then(responce=>console.log(responce));
}

export default{
    findAll,
    find,
    update,
    create,
    delete:deleteCustomer
}