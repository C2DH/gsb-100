import React from 'react'
import Media from 'react-media'
import Menu from '../../components/Menu'
import MenuMobile from '../../components/MenuMobile'
import { BREAKPOINTS } from '../../utils'

export default function MenuResponsive({ title }) {
  return (
    <Media queries={BREAKPOINTS}>
      {(matches) =>
        matches.md ? (
          <div className="d-block sticky-top">
            <MenuMobile title={title} />
          </div>
        ) : (
          <Menu />
        )
      }
    </Media>
  )
}
