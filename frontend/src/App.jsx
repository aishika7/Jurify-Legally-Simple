import React, { useState } from 'react'
import UploadForm from './components/UploadForm'
import ClauseList from './components/ClauseList'
import Chat from './components/Chat'

export default function App(){
  const [clauses, setClauses] = useState([])
  const [text, setText] = useState('')

  const handleUpload = (data) => { setText(data.text||''); setClauses(data.clauses||[]) }

  return (
    <div>
      <div className="nav">
        <div className="logo"><div style={{width:40,height:40,background:'#0b5fff',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8}}>J</div><div style={{marginLeft:8}}><strong>Jurify</strong><div style={{fontSize:12,color:'#6b7280'}}>Legally Simple</div></div></div>
        <div><button className="btn">Sign up</button></div>
      </div>
      <div className="hero container">
        <div>
          <h1>Jurify — Legally Simple</h1>
          <p>Upload contracts to get summaries, clause explanations, risk tags and negotiation snippets.</p>
          <div className="card">
            <UploadForm onUpload={(fd)=>{ fetch('http://localhost:4000/upload',{method:'POST',body:fd}).then(r=>r.json()).then(handleUpload).catch(e=>alert(e)) }} />
          </div>
        </div>
        <div className="card">
          <h3>Quick Actions</h3>
          <button className="btn" onClick={()=>{ if(text) fetch('http://localhost:4000/summarize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})}).then(r=>r.json()).then(d=>alert(JSON.stringify(d))).catch(e=>alert(e)) }}>Get Summary</button>
          <div style={{marginTop:12}}><button className="btn" onClick={()=>{ if(clauses.length) alert('Clause explanations available below') }}>View Clauses</button></div>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:'20px auto',display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
        <div className="card"><h3>Clauses</h3><ClauseList clauses={clauses} /></div>
        <div className="card"><h3>Chat</h3><Chat clauses={clauses} /></div>
      </div>
    </div>
  )
}
