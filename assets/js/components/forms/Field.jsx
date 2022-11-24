import React from "react";

//name


const Field=({name,label,value,onChange,placeholder="",type="text",error="",required})=>{

return(
<div>
<label htmlFor={name}>{label}</label>
<input 
type={type} 
value={value} 
onChange={onChange} 
className={"form-control" + (error && " is-invalid")} 
name={name}
id={name} 
error={error}
required={required}
placeholder={placeholder||label}
className={"form-control" + (error && " is-invalid")}/>
{error && (<p className="invalid-feedback">{error}</p>)}
</div>
)


}

export default Field

