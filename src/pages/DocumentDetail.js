import React from 'react'
import { useParams } from 'react-router-dom'
import { useCacheDocument } from '../miller'
import DocumentInfo from '../components/DocumentInfo'
import Menu from '../components/Menu'

export default function DocumentDetail() {
  const { id } = useParams()
  const [doc] = useCacheDocument(id)

  return (
    <div className='h-100 d-flex flex-column'>
      <Menu />
      <div style={{ flex: 1 }}>
        <DocumentInfo doc={doc} />
      </div>
    </div>
  )
}