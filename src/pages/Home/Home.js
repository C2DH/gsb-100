import React from "react";
import { useTranslation } from "react-i18next";
import { useCacheStory } from "../../miller";
import SwitchLanguage from "../../components/SwitchLanguage";
import MapHome from "../../components/MapHome";
import styles from "./Home.module.scss";
import LangLink from "../../components/LangLink";

export default function Home() {
  const { t } = useTranslation();
  const [homeStory] = useCacheStory("home");

  return (
    <React.Fragment>
      <div className={styles.mapContainer}>
        <MapHome></MapHome>
      </div>
      <div
        className={`${styles.wrapper} d-flex flex-column justify-content-between p-4`}
      >
        <div className="d-flex">
          <div>
            <h1>
              {homeStory.data.title.replace(/\s.*/, "")}
              <br></br>
              {homeStory.data.title.replace(/\S+\s/, "")}
            </h1>
            <h4 className={`text-primary`}>{homeStory.data.subtitle}</h4>
          </div>
          <div className="ml-auto">
            <SwitchLanguage></SwitchLanguage>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <LangLink id={styles.startLink} to="/outline">
            <div id={styles.start}>
              <p className="m-0 text-center text-uppercase">
                {t("click to start")}
              </p>
            </div>
          </LangLink>
        </div>
      </div>
    </React.Fragment>
  );
}
