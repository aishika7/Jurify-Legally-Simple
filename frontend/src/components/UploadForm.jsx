import React, { useRef } from 'react'
export default function UploadForm({ onUpload }){
  const fileRef = useRef()
  const submit = (e)=>{ e.preventDefault(); const f = fileRef.current.files[0]; if(!f) return alert('Choose file'); const fd = new FormData(); fd.append('file', f); onUpload(fd); }
  return (<form onSubmit={submit}><input ref={fileRef} type="file" accept=".txt,.pdf,.docx" /><button className="btn" type="submit">Upload</button></form>)
}
