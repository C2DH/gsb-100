import React, { useState, useEffect } from 'react'
import { randomUniform, randomInt } from 'd3-random'
import classNames from 'classnames'
import LangLink from '../LangLink'
import styles from './ImagesStack.module.scss'

function randomTransform() {
  return `scale(${randomUniform(0.6, 1)()}) translate(${randomInt(
    -5,
    5
  )()}%,${randomInt(-5, 5)()}%) rotate(${randomInt(-5, 5)()}deg)`
}

function RandImage({ doc, randomize }) {
  const [transform, setTransform] = useState(() => ({
    stable: randomTransform(),
    random: null,
  }))

  useEffect(() => {
    if (randomize) {
      setTransform((s) => ({
        ...s,
        random: randomTransform(),
      }))
    } else {
      setTransform((s) => {
        if (s.random === null) {
          return s
        }
        return {
          ...s,
          random: null,
        }
      })
    }
  }, [randomize])

  return (
    <img
      className={styles.stackImage}
      alt={doc.data.title}
      key={doc.id}
      src={doc.data.resolutions.medium.url}
      style={{
        transform: transform.random ?? transform.stable,
      }}
    />
  )
}

function ImagesStack({ category, docs, empty, style, link }) {
  const [randomize, setRandomize] = useState(false)
  return (
    <LangLink
      to={`/explorations/${link}`}
      className={styles.stack}
      style={style}
    >
      <div
        onMouseEnter={() => setRandomize(true)}
        onMouseLeave={() => setRandomize(false)}
        className={classNames(
          'align-items-center d-flex justify-content-center position-absolute w-100 h-100',
          { border: empty }
        )}
      >
        {docs &&
          docs.map((doc, i) => (
            <RandImage randomize={randomize} doc={doc} key={doc.id}></RandImage>
          ))}
        <h3 className="text-capitalize m-0 text-white">{category}</h3>
      </div>
    </LangLink>
  )
}

export default React.memo(ImagesStack)
