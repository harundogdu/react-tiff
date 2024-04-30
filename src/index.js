import React, { forwardRef, useEffect } from 'react'
import styles from './styles.module.css'
import UTIF from 'utif'
import axios from 'axios'
import i18n from 'i18next'
import { useTranslation, initReactI18next } from 'react-i18next'
import PropTypes from 'prop-types'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        Next: 'Next',
        Previous: 'Previous',
        'Page of total': 'Page {{page}} of {{total}}'
      }
    },
    tr: {
      translation: {
        Next: 'Sonraki',
        Previous: 'Önceki',
        'Page of total': '{{ page }}. sayfa / {{ total }}'
      }
    },
    de: {
      translation: {
        Next: 'Nächste',
        Previous: 'Vorherige',
        'Page of total': 'Seite {{page}} von {{total}}'
      }
    },
    fr: {
      translation: {
        Next: 'Suivant',
        Previous: 'Précédent',
        'Page of total': 'Page {{page}} sur {{total}}'
      }
    },
    es: {
      translation: {
        Next: 'Siguiente',
        Previous: 'Anterior',
        'Page of total': 'Página {{page}} de {{total}}'
      }
    },
    ja: {
      translation: {
        Next: '次へ',
        Previous: '前へ',
        'Page of total': '{{page}} / {{total}} ページ'
      }
    },
    zh: {
      translation: {
        Next: '下一页',
        Previous: '上一页',
        'Page of total': '第 {{page}} 页，共 {{total}} 页'
      }
    },
    ru: {
      translation: {
        Next: 'Следующий',
        Previous: 'Предыдущий',
        'Page of total': 'Страница {{page}} из {{total}}'
      }
    },
    ar: {
      translation: {
        Next: 'التالى',
        Previous: 'سابق',
        'Page of total': 'صفحة {{page}} من {{total}}'
      }
    },
    hi: {
      translation: {
        Next: 'अगला',
        Previous: 'पिछला',
        'Page of total': 'पृष्ठ {{page}} का {{total}}'
      }
    }
  },
  lng: 'tr',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false
  }
})

export const TIFFViewer = forwardRef(function TiffFileViewer(
  {
    tiff,
    lang = 'en',
    paginate = 'bottom',
    buttonColor = '#141414',
    printable = false,
    ...rest
  },
  ref
) {
  const { t, i18n } = useTranslation()

  // states
  const [_tiff] = React.useState(tiff)
  const [, setTiffs] = React.useState([])
  const [pages, setPages] = React.useState([])
  const [page, setPage] = React.useState(0)

  // refs
  const canvasRef = React.useRef(null)
  const btnPrintRef = React.useRef(null)
  const paginateLTRRef = React.useRef(null)
  const paginateBottomRef = React.useRef(null)

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

  const handlePrintClick = () => {
    try {
      if (printable) btnPrintRef.current.style.visibility = 'hidden'

      if (paginateLTRRef.current)
        paginateLTRRef.current.style.visibility = 'hidden'

      if (paginateBottomRef.current)
        paginateBottomRef.current.style.visibility = 'hidden'

      // all page window.print
      if (pages.length > 1) {
        pages.forEach((page, index) => {
          if (index > 0) {
            canvasRef.current.style.display = 'block'
            canvasRef.current.appendChild(page)
          }
        })
        // print
        window.print()

        // remove all pages
        pages.forEach((page, index) => {
          if (index > 0) {
            canvasRef.current.removeChild(page)
          } else {
            canvasRef.current.style.display = 'flex'
          }
        })
      } else {
        window.print()
      }
    } catch (error) {
      console.error('Error')
    } finally {
      if (printable) btnPrintRef.current.style.visibility = 'visible'

      if (paginateLTRRef.current)
        paginateLTRRef.current.style.visibility = 'visible'

      if (paginateBottomRef.current) {
        paginateBottomRef.current.style.visibility = 'visible'
      }
    }
  }

  useEffect(() => {
    displayTIFF(_tiff)
  }, [_tiff])

  useEffect(() => {
    if (pages.length > 0) {
      canvasRef.current.innerHTML = ''
      canvasRef.current.appendChild(pages[page])
    }
  }, [page, pages])

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang])

  // ref all page print
  React.useImperativeHandle(ref, () => ({
    context: () => {
      pages.forEach((page, index) => {
        if (index > 0) {
          canvasRef.current.style.display = 'block'
          canvasRef.current.appendChild(page)
        }
      })
      return canvasRef.current
    }
  }))

  return (
    <div className={styles.container} id='tiff-container' ref={ref} {...rest}>
      {printable && (
        <button
          id='btn-print'
          onClick={handlePrintClick}
          ref={btnPrintRef}
          className={styles.btnPrint}
          type='button'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z'
            />
          </svg>
        </button>
      )}
      <div className={styles.arrow}>
        <div
          id='tiff-inner-container'
          className={styles.inner}
          ref={canvasRef}
        />

        {paginate === 'ltr' && pages.length > 1 && (
          <div className={styles.absolute} id='absolute' ref={paginateLTRRef}>
            <button
              style={{ backgroundColor: buttonColor }}
              disabled={page === 0}
              onClick={handlePreviousClick}
              className={styles.button}
              type='button'
            >
              {t('<')}
            </button>{' '}
            <button
              style={{ backgroundColor: buttonColor }}
              disabled={page === pages.length - 1}
              onClick={handleNextClick}
              className={styles.button}
              type='button'
            >
              {t('>')}
            </button>
          </div>
        )}
      </div>

      {paginate === 'bottom' && pages.length > 1 && (
        <div id='footer' ref={paginateBottomRef}>
          <button
            style={{ backgroundColor: buttonColor }}
            disabled={page === 0}
            onClick={handlePreviousClick}
            className={styles.button}
            type='button'
          >
            {t('Previous')}
          </button>
          <span className={styles.span}>
            {t('Page of total', { page: page + 1, total: pages.length })}
          </span>
          <button
            style={{ backgroundColor: buttonColor }}
            disabled={page === pages.length - 1}
            onClick={handleNextClick}
            className={styles.button}
            type='button'
          >
            {t('Next')}
          </button>
        </div>
      )}
    </div>
  )
})

TIFFViewer.propTypes = {
  tiff: PropTypes.string.isRequired,
  lang: PropTypes.string,
  paginate: PropTypes.string,
  buttonColor: PropTypes.string,
  printable: PropTypes.bool
}
