import React, { useEffect } from 'react'

import { TIFFViewer } from 'react-tiff-viewer'
import 'react-tiff-viewer/dist/index.css'
import tiffFile from './images/multipage.tiff'
import tiffFile2 from './images/sample.tiff'
import tiffFile3 from './images/test.tiff'
import tiffFile4 from './images/balloons.tif'

const App = () => {
  useEffect(() => {
    document.title = 'React TIFF Viewer'
  }, [])

  return (
    <>
      <TIFFViewer
        tiff={tiffFile}
        lang='tr'
        paginate='ltr'
        buttonColor='#141414'
      />
    </>
  )
}

export default App
