import React from "react";


const Select =({name,value,label,error,onChange,children,required})=>{

return (<div>
<label>{label}</label>
<select name={name} value={value} required={required} error={error} onChange={onChange} className={"form-control" + (error && " is-invalid")}>
    {children}
</select>

{error && (<p className="invalid-feedback">{error}</p>)}
</div>)


}

export default Select;