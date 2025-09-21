import React, { useState } from 'react'
export default function Chat({ clauses }){
  const [messages,setMessages]=useState([])
  const [q,setQ]=useState('')
  const send = ()=>{ if(!q) return; setMessages(m=>[...m,{role:'user',text:q},{role:'ai',text:'Demo answer'}]); setQ('') }
  return (<div style={{display:'flex',flexDirection:'column',height:400}}>
    <div style={{flex:1,overflow:'auto',padding:8,background:'#fbfdff'}}>{messages.map((m,i)=>(<div key={i} style={{textAlign:m.role==='user'?'right':'left'}}><div style={{display:'inline-block',padding:8,background:m.role==='user'?'#0b5fff':'#e6eef9',color:m.role==='user'?'#fff':'#000',borderRadius:8}}>{m.text}</div></div>))}</div>
    <div style={{display:'flex',gap:8,marginTop:8}}><input value={q} onChange={e=>setQ(e.target.value)} style={{flex:1}} /><button className="btn" onClick={send}>Send</button></div>
  </div>)
}
