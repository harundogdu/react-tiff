import React, { useEffect } from 'react'
import styles from './styles.module.css'
import UTIF from 'utif'
import axios from 'axios'

export const TIFFViewer = ({
  tiff,
  isBorder = false,
  isMargin = false,
  ...rest
}) => {
  const [_tiff] = React.useState(tiff)
  const [, setTiffs] = React.useState([])
  const [pages, setPages] = React.useState([])
  const [page, setPage] = React.useState(0)

  const style = {
    border: isBorder ? '1px solid #ccc' : 'none',
    margin: isMargin ? '1rem' : '0px'
  }

  function imgLoaded(e) {
    var ifds = UTIF.decode(e.target.response)
    const _tiffs = ifds.map(function (ifd, index) {
      UTIF.decodeImage(e.target.response, ifd)
      var rgba = UTIF.toRGBA8(ifd)
      var canvas = document.createElement('canvas')
      canvas.width = ifd.width
      canvas.height = ifd.height
      var ctx = canvas.getContext('2d')
      var img = ctx.createImageData(ifd.width, ifd.height)
      img.data.set(rgba)
      ctx.putImageData(img, 0, 0)
      if (index === 0)
        document.getElementById('tiff-inner-container').appendChild(canvas)
      return canvas
    })
    setPages(_tiffs)
    setTiffs(_tiffs)
  }

  async function displayTIFF(tiffUrl) {
    const response = await axios.get(tiffUrl, {
      responseType: 'arraybuffer'
    })
    imgLoaded({ target: { response: response.data } })
  }

  const handlePreviousClick = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }
  const handleNextClick = () => {
    if (page < pages.length - 1) {
      setPage(page + 1)
    }
  }

  useEffect(() => {
    displayTIFF(_tiff)
  }, [_tiff])

  useEffect(() => {
    if (pages.length > 0) {
      const tiffInnerContainer = document.getElementById('tiff-inner-container')
      tiffInnerContainer.innerHTML = ''
      tiffInnerContainer.appendChild(pages[page])
    }
  }, [page, pages])

  return (
    <div
      className={styles.container}
      id='tiff-container'
      style={style}
      {...rest}
    >
      <div id='tiff-inner-container' />
      <div id='footer'>
        <button onClick={handlePreviousClick} className={styles.button}>
          Previous
        </button>
        <span className={styles.span}>
          Page {page + 1} of {pages.length}
        </span>
        <button onClick={handleNextClick} className={styles.button}>
          Next
        </button>
      </div>
    </div>
  )
}
