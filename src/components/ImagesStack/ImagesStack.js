import React from 'react'
import { randomUniform, randomInt } from 'd3-random'
import classNames from 'classnames'
import LangLink from '../LangLink'
import styles from './ImagesStack.module.scss'

function RandImage({ doc }) {
  return (
    <img
      className={styles.stackImage}
      alt={doc.data.title}
      key={doc.id}
      src={doc.data.resolutions.medium.url}
      style={{
        transform: `scale(${randomUniform(0.6, 1)()}) translate(${randomInt(
          -5,
          5
        )()}%,${randomInt(-5, 5)()}%) rotate(${randomInt(-5, 5)()}deg)`,
      }}
    />
  )
}

function ImagesStack({ category, docs, empty, style, link }) {
  return (
    <LangLink
      to={`/explorations/${link}`}
      className={styles.stack}
      style={style}
    >
      <div
        className={classNames(
          'align-items-center d-flex justify-content-center position-absolute w-100 h-100',
          { border: empty }
        )}
      >
        {docs &&
          docs.map((doc, i) => <RandImage doc={doc} key={doc.id}></RandImage>)}
        <h3 className="text-capitalize m-0 text-white">{category}</h3>
      </div>
    </LangLink>
  )
}

export default React.memo(ImagesStack)
