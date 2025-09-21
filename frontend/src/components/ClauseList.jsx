import React from 'react'
import ClauseCard from './ClauseCard'
export default function ClauseList({ clauses }){
  if(!clauses || clauses.length===0) return <div>No clauses yet</div>
  return (<div>{clauses.map(c=><ClauseCard key={c.id} clause={c} />)}</div>)
}
