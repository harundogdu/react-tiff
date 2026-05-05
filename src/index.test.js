import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), isCancel: jest.fn(() => false) },
  get: jest.fn(),
  isCancel: jest.fn(() => false)
}))
jest.mock('utif', () => ({
  __esModule: true,
  default: {
    decode: jest.fn(() => [{ width: 1, height: 1 }]),
    decodeImage: jest.fn(),
    toRGBA8: jest.fn(() => new Uint8ClampedArray(4))
  }
}))

const axios = require('axios').default
const { TIFFViewer } = require('.')

let container = null

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  if (container) {
    unmountComponentAtNode(container)
    container.remove()
    container = null
  }
  jest.clearAllMocks()
})

describe('TIFFViewer', () => {
  it('is exported', () => {
    expect(TIFFViewer).toBeTruthy()
  })

  it('does not throw when unmounted while TIFF is still loading', async () => {
    let resolveAxios
    const pending = new Promise((resolve) => {
      resolveAxios = resolve
    })
    axios.get = jest.fn().mockReturnValue(pending)

    act(() => {
      render(<TIFFViewer tiff='test.tif' />, container)
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][1].responseType).toBe('arraybuffer')

    // Unmount before axios resolves — this used to throw on appendChild(null)
    act(() => {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    })

    // Now resolve. Without the fix imgLoaded runs and crashes on
    // document.getElementById('tiff-inner-container').appendChild(...).
    let caught = null
    try {
      await act(async () => {
        resolveAxios({ data: new ArrayBuffer(8) })
        await Promise.resolve()
        await Promise.resolve()
      })
    } catch (err) {
      caught = err
    }
    expect(caught).toBeNull()
  })
})
