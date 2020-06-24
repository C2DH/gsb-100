import React, { useState } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap'
import { Link, NavLink as NavLinkRR } from 'react-router-dom'

export default function Menu() {
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={Link} to="/">
          Prospecting the In-Between
        </NavbarBrand>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink tag={NavLinkRR} to="/outline">
              01. Outline
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={NavLinkRR} to="/perspectives">
              02. Perspectives
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={NavLinkRR} to="/explorations">
              03. Explorations
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={NavLinkRR} to="/about">
              About
            </NavLink>
          </NavItem>
          {/* <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Options
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
        </Nav>
      </Navbar>
    </div>
  )
}
