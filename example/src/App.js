import React, { useEffect } from 'react'

import { TIFFViewer } from 'react-tiff'
import 'react-tiff/dist/index.css'
import tiffFile from './images/multipage.tiff'
import tiffFile2 from './images/sample.tiff'
import tiffFile3 from './images/test.tiff'
import tiffFile4 from './images/balloons.tif'

const App = () => {
  useEffect(() => {
    document.title = 'React TIFF Viewer'
  }, [])

  const handleDocumentLoad = (totalPages) => {
    console.log(`Document loaded with ${totalPages} pages`)
  }

  const handleLoad = () => {
    console.log('TIFF file has been loaded')
  }

  return (
    <>
      <TIFFViewer
        tiff={tiffFile}
        lang='tr'
        paginate='ltr'
        buttonColor='#141414'
        currentPage={1}
        onDocumentLoad={handleDocumentLoad}
        onLoad={handleLoad}
        printable
        zoomable
      />
    </>
  )
}

export default App
