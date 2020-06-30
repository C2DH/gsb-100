import React from "react";
import { Link, NavLink } from "react-router-dom";
import classNames from "classnames";
import { useCacheStories, useCacheStory, usePrefetchStory } from "../../miller";
import SwitchLanguage from "../SwitchLanguage";
import styles from "./Menu.module.scss";

const pagesId = ["outline", "perspectives", "explorations", "about"];
const params = {
  limit: pagesId.length,
  orderby: "priority",
  filters: { slug__in: pagesId },
};

function Menu() {
  const [{ stories }] = useCacheStories(params);
  const [homeStory] = useCacheStory("home");
  const prefetchStory = usePrefetchStory();

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
                  onMouseOver={() => prefetchStory(d.slug)}
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
        <SwitchLanguage />
      </div>
    </nav>
  );
}

export default React.memo(Menu);
