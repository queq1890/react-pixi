import React from 'react'
import * as PIXI from 'pixi.js'
import { createElement, TYPES } from '../src/utils/createElement'
import { getTextureFromProps, props, pixi } from '../src/utils'

import { emptyTexture } from './__fixtures__/textures'
import { desyrel } from './__fixtures__/bitmapfonts'
import parseBitmapFont from './__utils__/parseBitmapFont'

parseBitmapFont(desyrel)

describe('props', function() {
  test('reserved props', () => {
    expect(props.PROPS_RESERVED).toMatchSnapshot()
  })
  test('display object props', () => {
    expect(props.PROPS_DISPLAY_OBJECT).toMatchSnapshot()
  })
})

describe('createElement', () => {
  test('types', () => {
    expect(TYPES).toMatchSnapshot()
  })

  test('create Container', () => {
    const element = createElement(TYPES.Container)
    expect(element).toBeInstanceOf(PIXI.Container)
  })

  test('create Text', () => {
    const element = createElement(TYPES.Text, { text: 'foobar' })
    expect(element).toBeInstanceOf(PIXI.Text)
  })

  test('create Sprite', () => {
    const element = createElement(TYPES.Sprite, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.Sprite)
  })

  test('create ParticleContainer', () => {
    const element = createElement(TYPES.ParticleContainer)
    expect(element).toBeInstanceOf(PIXI.particles.ParticleContainer)
  })

  test('create BitmapText', () => {
    const element = createElement(TYPES.BitmapText, { text: 'foobar', style: { font: '35px Desyrel' } })
    expect(element).toBeInstanceOf(PIXI.extras.BitmapText)
  })

  test('create TilingSprite', () => {
    const element = createElement(TYPES.TilingSprite, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.extras.TilingSprite)
  })

  test('create Graphics', () => {
    const element = createElement(TYPES.Graphics)
    expect(element).toBeInstanceOf(PIXI.Graphics)
  })

  test('create NineSlicePlane', () => {
    const element = createElement(TYPES.NineSlicePlane, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.mesh.NineSlicePlane)
  })

  test('create Mesh', () => {
    const element = createElement(TYPES.Mesh, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.mesh.Mesh)
  })

  test('create Rope', () => {
    const element = createElement(TYPES.Rope, { texture: emptyTexture, points: [] })
    expect(element).toBeInstanceOf(PIXI.mesh.Rope)
  })

  test('create Stage', () => {
    const element = createElement(TYPES.Stage)
    expect(element).toBeDefined()
  })

  test('get undefined', () => {
    expect(createElement('INVALID')).toBeUndefined()
  })
})

describe('getTextureFromProps', function() {
  let spy

  beforeAll(() => {
    spy = jest.spyOn(PIXI.Texture, 'fromImage').mockReturnValue(emptyTexture)
  })

  afterAll(() => {
    spy.mockRestore()
  })

  test('invariant image', () => {
    expect(() => getTextureFromProps('Test', { image: 123 })).toThrow('Test image needs to be a string, got `number`')
  })

  test('invariant texture', () => {
    expect(() => getTextureFromProps('Test', { texture: 'texture' })).toThrow(
      'Test texture needs to be type of `PIXI.Texture`'
    )
  })

  test('get texture from image', () => {
    const texture = getTextureFromProps('Test', { image: './image.png' })
    expect(texture).toBeInstanceOf(PIXI.Texture)
    expect(spy).toBeCalledWith('./image.png')
  })

  test('get texture from texture', () => {
    const texture = getTextureFromProps('Test', { texture: emptyTexture })
    expect(texture).toBe(emptyTexture)
  })
})

describe('pixi', function() {
  describe('parsePoint', function() {
    test('parse undefined', () => {
      expect(pixi.parsePoint(undefined)).toEqual([])
    })

    test('parse null', () => {
      expect(pixi.parsePoint(null)).toEqual([])
    })

    test('parse string', () => {
      expect(pixi.parsePoint('1,3')).toEqual([1, 3])
    })

    test('parse invalid string', () => {
      expect(pixi.parsePoint('not, valid')).toEqual([])
    })

    test('parse number', () => {
      expect(pixi.parsePoint(100)).toEqual([100])
    })

    test('parse shallow array', () => {
      expect(pixi.parsePoint([100, 200])).toEqual([100, 200])
      expect(pixi.parsePoint([100, 200])).not.toBe([100, 200])
    })

    test('parse object with x y', () => {
      expect(pixi.parsePoint({ x: 100, y: 200 })).toEqual([100, 200])
    })

    test('parse object with x only', () => {
      expect(pixi.parsePoint({ x: 100 })).toEqual([100, 0])
    })

    test('parse object with y only', () => {
      expect(pixi.parsePoint({ y: 200 })).toEqual([0, 200])
    })
  })
})