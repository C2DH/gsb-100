import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ArrowLeft, ArrowRight } from 'react-feather'
import DocumentInfoBox from '../DocumentInfoBox'
import styles from './DocumentInfoPdf.module.scss'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default function DocumentInfoPdf({ doc }) {
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

  return (
    <React.Fragment>
      <div className={styles.InfoPdfContainer}>
        <div className={styles.PdfContainer}>
          <div className={styles.PdfDocumentContainer}>
            <Document
              className={styles.pdfDocument}
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page className={styles.pdfPage} pageNumber={pageNumber || 1} />
            </Document>
          </div>
          <div className={styles.PdfControls}>
            <button
              onClick={() => setPageNumber((p) => p - 1)}
              disabled={pageNumber <= 1}
              className="btn btn-link btn-icon-round mr-2"
            >
              <ArrowLeft color="white"></ArrowLeft>
            </button>
            <input
              className="page-input mr-2"
              type="number"
              onChange={handlePageChange}
              value={pageNumber}
              min="1"
              max={numPages}
              step="1"
            />
            {' of '}
            {numPages}
            <button
              onClick={() => setPageNumber((p) => p + 1)}
              disabled={pageNumber >= numPages}
              className="btn btn-link btn-icon-round ml-2"
            >
              <ArrowRight color="white"></ArrowRight>
            </button>
          </div>
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
