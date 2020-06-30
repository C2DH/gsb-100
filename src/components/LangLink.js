import React from 'react'
import { Link } from 'react-router-dom'
import { useToWithLang } from '../hooks'

export default function LangLink({ to, ...props }) {
  const toWithLang = useToWithLang(to)
  return <Link to={toWithLang} {...props} />
}
