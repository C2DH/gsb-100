import React, { useMemo } from 'react'
import classNames from 'classnames'
import * as d3Array from 'd3-array'
import * as d3Scale from 'd3-scale'
import { AxisBottom } from '@vx/axis'
import { Grid } from '@vx/grid'
import styles from './Timeline.module.scss'

const dodge = (data, radius, x) => {
  const radius2 = radius ** 2
  const circles = data
    .map((d) => ({
      x: x(new Date(d.data.start_date)),
      data: d.data,
      doc_id: d.document_id,
    }))
    .sort((a, b) => a.x - b.x)
  const epsilon = 1e-3
  let head = null,
    tail = null

  // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
  function intersects(x, y) {
    let a = head
    while (a) {
      if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
        return true
      }
      a = a.next
    }
    return false
  }

  // Place each circle sequentially.
  for (const b of circles) {
    // Remove circles from the queue that can’t intersect the new circle b.
    while (head && head.x < b.x - radius2) head = head.next

    // Choose the minimum non-intersecting tangent.
    if (intersects(b.x, (b.y = 0))) {
      let a = head
      b.y = Infinity
      do {
        let y1 = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2)
        let y2 = a.y - Math.sqrt(radius2 - (a.x - b.x) ** 2)
        if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1
        if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2
        a = a.next
      } while (a)
    }

    // Add b to the queue.
    b.next = null
    if (head === null) head = tail = b
    else tail = tail.next = b
  }

  return circles
}

const radius = 4
const padding = 2
const height = 70

function Timeline({ documents, width }) {
  const margin = {
    top: 0,
    right: 15,
    bottom: 20,
    left: 15,
  }
  const vizWidth = width - margin.right - margin.left
  const vizHeight = height - margin.top - margin.bottom
  const domain = d3Array.extent(documents, (d) => new Date(d.data.start_date))
  const xScale = useMemo(() => {
    return d3Scale.scaleTime().domain(domain).range([0, vizWidth])
  }, [vizWidth, domain])

  const dots = useMemo(() => {
    return dodge(documents, radius * 2 + padding, xScale)
  }, [xScale, documents])

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {dots.map((dot) => {
          return (
            <circle
              key={dot.doc_id}
              cx={dot.x}
              cy={vizHeight / 2 + dot.y}
              r={radius}
              fill={'white'}
            ></circle>
          )
        })}
      </g>
      <AxisBottom
        top={vizHeight}
        scale={xScale}
        tickStroke={'rgba(255,255,255,0.5)'}
        tickLength={-vizHeight}
        tickLabelProps={
          (/* value, index */) => ({
            fill: '#fff',
            fontSize: 12,
            textAnchor: 'middle',
            dy: vizHeight,
          })
        }
        hideAxisLine
      ></AxisBottom>
      )}
    </svg>
  )
}

export default Timeline
