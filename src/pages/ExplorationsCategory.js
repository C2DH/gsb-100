import React from 'react'
import Menu from '../components/Menu'
import { useParams } from 'react-router-dom'

export default function ExplorationsCategory() {
  const { category } = useParams()

  return (
    <div>
      <Menu />
      <h1>Explorations {category}</h1>
    </div>
  )
}