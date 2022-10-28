import React, { useEffect } from 'react'
import styles from './styles.module.css'
import UTIF from 'utif'
import axios from 'axios'
import i18n from 'i18next'
import { useTranslation, initReactI18next } from 'react-i18next'
import PropTypes from 'prop-types'

export const TIFFViewer = ({ tiff, lang = 'en', ...rest }) => {
  // i18 localization
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: {
          Next: 'Next',
          Previous: 'Previous',
          'Page {page} of {total}': 'Page {page} of {total}'
        }
      },
      tr: {
        translation: {
          Next: 'Sonraki',
          Previous: 'Önceki',
          'Page {page} of {total}': '{page}. sayfa / {total}'
        }
      },
      de: {
        translation: {
          Next: 'Nächste',
          Previous: 'Vorherige',
          'Page {page} of {total}': 'Seite {page} von {total}'
        }
      },
      fr: {
        translation: {
          Next: 'Suivant',
          Previous: 'Précédent',
          'Page {page} of {total}': 'Page {page} sur {total}'
        }
      },
      es: {
        translation: {
          Next: 'Siguiente',
          Previous: 'Anterior',
          'Page {page} of {total}': 'Página {page} de {total}'
        }
      }
    },
    lng: lang,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false
    }
  })
  // translate initial
  const { translate } = useTranslation()

  // states
  const [_tiff] = React.useState(tiff)
  const [, setTiffs] = React.useState([])
  const [pages, setPages] = React.useState([])
  const [page, setPage] = React.useState(0)

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
    <div className={styles.container} id='tiff-container' {...rest}>
      <div id='tiff-inner-container' className={styles.inner} />
      {pages.length > 1 && (
        <div id='footer'>
          <button
            disabled={page === 0}
            onClick={handlePreviousClick}
            className={styles.button}
          >
            {translate('Previous')}
          </button>
          <span className={styles.span}>
            Page {page + 1} of {pages.length}
            {translate(`Page ${page + 1} of ${pages.length}`)}
          </span>
          <button
            disabled={page === pages.length - 1}
            onClick={handleNextClick}
            className={styles.button}
          >
            {translate('Next')}
          </button>
        </div>
      )}
    </div>
  )
}

TIFFViewer.propTypes = {
  tiff: PropTypes.string.isRequired,
  lang: PropTypes.string
}
