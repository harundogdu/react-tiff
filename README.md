# react-tiff

A React component for viewing TIFF images.

## Features

- Supports multi-page TIFF images
- Supports TIFF images with multiple channels (e.g. RGB, RGBA, CMYK)
- Supports TIFF images with multiple resolutions (e.g. 1x, 2x, 4x)
- Supports TIFF images with multiple tiles
- Supports TIFF images with multiple strips
- Supports TIFF images with multiple samples per pixel (e.g. 1, 2, 3, 4)
- Supports TIFF images with multiple bits per sample (e.g. 1, 2, 4, 8, 16, 32)
- Supports TIFF images with multiple photometric interpretations (e.g. min-is-black, min-is-white, RGB, palette color, transparency mask, CMYK, YCbCr, CIELab)

## Install

```bash
npm install --save react-tiff
```

```bash
yarn add react-tiff
```

## Usage

```jsx
import React from 'react'

import { TIFFViewer } from 'react-tiff'
import 'react-tiff/dist/index.css'
import tiffFile from './images/multipage.tiff'

const App = () => {
  return (
    <TIFFViewer
      tiff={tiffFile}
      lang='en' // en | de | fr | es | tr
      paginate='ltr' // bottom | ltr
      buttonColor='#141414'
    />
  )
}

export default App
```

## Live

[Demo](https://codesandbox.io/s/react-tiff-95u65f)

## Extras

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-tiff-viewer.svg)](https://www.npmjs.com/package/react-tiff-viewer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## License

MIT © [harundogdu](https://github.com/harundogdu)
