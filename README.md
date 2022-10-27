# react-tiff-viewer

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-tiff-viewer.svg)](https://www.npmjs.com/package/react-tiff-viewer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-tiff-viewer
yarn add react-tiff-viewer
```

## Usage

```jsx
import React from 'react'

import { TIFFViewer } from 'react-tiff-viewer'
import 'react-tiff-viewer/dist/index.css'
import tiffFile from './multipage.tiff'

const App = () => {
  return <TIFFViewer tiff={tiffFile} isBorder isMargin />
}

export default App
```

## License

MIT © [harundogdu](https://github.com/harundogdu)
