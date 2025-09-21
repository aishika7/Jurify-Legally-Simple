import React, { useState } from 'react'
export default function ClauseCard({ clause }){
  const [open,setOpen]=useState(false)
  return (<div style={{border:'1px solid #eee',padding:10,borderRadius:8,marginBottom:8}}>
    <div style={{display:'flex',justifyContent:'space-between'}}><strong>Clause {clause.id}</strong><button onClick={()=>setOpen(!open)} className="btn">{open?'Hide':'Explain'}</button></div>
    <div style={{marginTop:8}}>{clause.text.slice(0,300)}{clause.text.length>300?'...':''}</div>
    {open && <div style={{marginTop:8,background:'#fbfdff',padding:8}}><em>Explanation (demo)</em></div>}
  </div>)
}
