import React from 'react'

export default function DocumentInfo({ doc }) {
  return (
    <div className='row no-gutters'>
      <div className='col-md-8 offset-md-2'>
      <h2>{doc.title}</h2>
      <div className='d-flex justify-content-center'>
        <img title={doc.title} alt={doc.title} src={doc.attachment} />
      </div>
      </div>
    </div>
  )
}
