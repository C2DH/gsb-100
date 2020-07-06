import React, { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import styles from './DocumentInfoPdf.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default function DocumentInfoPdf({ doc }) {
  const container = useRef()
  const [height, setHeight] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  let pdfUrl = doc.attachment
  if (process.env.NODE_ENV !== 'production') {
    const baseUrlRegex = /http(s)?:\/\/([^/]+)/
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    pdfUrl = pdfUrl.replace(baseUrlRegex, baseUrl)
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function handlePageChange(e) {
    const pageNumber = e.target.value
    if (+pageNumber <= numPages) {
      setPageNumber(+pageNumber)
    }
  }

  useEffect(() => {
    setHeight(container.current.clientHeight)
  }, [])

  return (
    <div className={styles.InfoPdfContainer}>
      <div className={styles.PdfContainer}>
        <div className={styles.PdfDocumentContainer} ref={container}>
          {!!height && (
            <Document
              file={pdfUrl}
              height={height}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page height={height} pageNumber={pageNumber || 1} />
            </Document>
          )}
        </div>
        <div className={styles.PdfControls}>
          <button
            onClick={() => setPageNumber((p) => p - 1)}
            disabled={pageNumber <= 1}
            className="btn btn-dark bg-transparent mr-2"
          >
            {'←'}
          </button>
          <input
            className="page-input mr-2"
            type="number"
            onChange={handlePageChange}
            value={pageNumber}
            min="1"
            max="numPages"
          />
          {' of '}
          {numPages}
          <button
            onClick={() => setPageNumber((p) => p + 1)}
            disabled={pageNumber >= numPages}
            className="btn btn-dark bg-transparent ml-2"
          >
            {'→'}
          </button>
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
