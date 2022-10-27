import React from 'react'

import { TIFFViewer } from 'react-tiff-viewer'
import 'react-tiff-viewer/dist/index.css'
import tiffFile from './multipage.tiff'

const App = () => {
  return <TIFFViewer tiff={tiffFile} isBorder isMargin />
}

export default App
