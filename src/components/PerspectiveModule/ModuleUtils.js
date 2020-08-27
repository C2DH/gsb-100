import React from 'react'
import { CornerLeftUp } from 'react-feather'

export const Caption = ({ caption }) => {
  return (
    <div className="d-flex align-items-start mt-2">
      <CornerLeftUp
        size="14px"
        color={'#00b37f'}
        className="flex-shrink-0"
      ></CornerLeftUp>
      <p className="ml-2 text-primary">{caption}</p>
    </div>
  )
}
