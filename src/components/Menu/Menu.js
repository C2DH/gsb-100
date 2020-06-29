import React from 'react'
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { Link, NavLink as NavLinkRR } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMiller, usePrefetchStory } from '../../miller'

export default function Menu() {
  const { i18n } = useTranslation()
  const { langs } = useMiller()
  const prefetchStory = usePrefetchStory()

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={Link} to="/">
          Prospecting the In-Between
        </NavbarBrand>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink
              onMouseEnter={() => prefetchStory('outline')}
              tag={NavLinkRR}
              to="/outline"
            >
              01. Outline
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onMouseEnter={() => prefetchStory('perspectives')}
              tag={NavLinkRR}
              to="/perspectives"
            >
              02. Perspectives
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onMouseEnter={() => prefetchStory('explorations')}
              tag={NavLinkRR}
              to="/explorations"
            >
              03. Explorations
            </NavLink>
          </NavItem>
          <NavItem onMouseEnter={() => prefetchStory('about')}>
            <NavLink tag={NavLinkRR} to="/about">
              About
            </NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {i18n.language}
            </DropdownToggle>
            <DropdownMenu right>
              {langs.map((lang) => (
                <DropdownItem
                  onClick={() => {
                    i18n.changeLanguage(lang)
                  }}
                  key={lang}
                >
                  {lang}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Navbar>
    </div>
  )
}
