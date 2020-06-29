import React from "react";
import { Link, NavLink } from "react-router-dom";
import classNames from "classnames";
import { useCacheStories, useCacheStory } from "../../miller";
import SwitchLanguage from "../SwitchLanguage";
import styles from "./Menu.module.scss";

export default function Menu() {
  const pagesId = ["outline", "perspectives", "explorations", "about"];
  const params = {
    limit: pagesId.length,
    orderby: "priority",
    nocache: true, // TODO: remove for dev only
    filters: { slug__in: pagesId },
  };
  const [{ stories }] = useCacheStories(params);
  const [homeStory] = useCacheStory("home");

  return (
    <nav
      id={styles.navbar}
      className="navbar navbar-expand-lg navbar-dark bg-secondary"
    >
      <Link id={styles.navbarBrand} className="navbar-brand" to="/">
        {[
          homeStory.data.title.replace(/\s.*/, ""),
          homeStory.data.title.replace(/\S+\s/, ""),
        ].map((d, i) => (
          <h3 key={i} className="m-0">
            {d}
          </h3>
        ))}
      </Link>
      <div className="collapse navbar-collapse align-self-stretch">
        <div className="navbar-nav flex-grow-1 h-100">
          {stories.map((d, i) => {
            return (
              <div
                key={d.slug}
                className={classNames(`${styles.navLinkCont}`, {
                  "flex-fill": d.slug !== "about",
                })}
              >
                <NavLink
                  to={d.slug}
                  activeClassName={styles.active}
                  className={`${styles.navLink} nav-item nav-link text-center`}
                >
                  {d.slug !== "about" &&
                    (i + 1).toString().padStart(2, "0") + ". "}
                  {d.data.title}
                </NavLink>
              </div>
            );
          })}
        </div>
        <SwitchLanguage></SwitchLanguage>
      </div>
    </nav>
  );
  // return (
  //   <div>
  //     <Navbar color="light" light expand="md">
  //       <NavbarBrand tag={Link} to="/">
  //         Prospecting the In-Between
  //       </NavbarBrand>
  //       <Nav className="mr-auto" navbar>
  //         <NavItem>
  //           <NavLink
  //             onMouseEnter={() => prefetchStory('outline')}
  //             tag={NavLinkRR}
  //             to="/outline"
  //           >
  //             01. Outline
  //           </NavLink>
  //         </NavItem>
  //         <NavItem>
  //           <NavLink
  //             onMouseEnter={() => prefetchStory('perspectives')}
  //             tag={NavLinkRR}
  //             to="/perspectives"
  //           >
  //             02. Perspectives
  //           </NavLink>
  //         </NavItem>
  //         <NavItem>
  //           <NavLink
  //             onMouseEnter={() => prefetchStory('explorations')}
  //             tag={NavLinkRR}
  //             to="/explorations"
  //           >
  //             03. Explorations
  //           </NavLink>
  //         </NavItem>
  //         <NavItem onMouseEnter={() => prefetchStory('about')}>
  //           <NavLink tag={NavLinkRR} to="/about">
  //             About
  //           </NavLink>
  //         </NavItem>
  //         <UncontrolledDropdown nav inNavbar>
  //           <DropdownToggle nav caret>
  //             {i18n.language}
  //           </DropdownToggle>
  //           <DropdownMenu right>
  //             {langs.map((lang) => (
  //               <DropdownItem
  //                 onClick={() => {
  //                   i18n.changeLanguage(lang)
  //                 }}
  //                 key={lang}
  //               >
  //                 {lang}
  //               </DropdownItem>
  //             ))}
  //           </DropdownMenu>
  //         </UncontrolledDropdown>
  //       </Nav>
  //     </Navbar>
  //   </div>
  // )
}
