import { useLoaderData } from 'react-router-dom'
import { gematriya } from '@hebcal/core';
import '../css/Reader.css'
import { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import useGetElementDimensions from '../useGetElementDimensions';

export default function Reader() {
  const data = useLoaderData()
  const text = data.map((datum, i) => <div className='perek' key={i}><h2 className='perekHeading'>{perekName(datum.perek)}</h2><p>{datum.text.join('  ')}</p></div>)

  function perekName(n) {
    return `פרק ${gematriya(n).replaceAll('׳', '')}`
  }
  const openSymbol = '☰'
  const closeSymbol = '\u{2715}'
  const menuButtonText = useRef(openSymbol)

  /* const [state, setState] = useState({
    menuOpen: false,
    fontShown: false,
    dimensions: { width: 0, height: 0 },
    left: 0
  }) */

  const [menuOpen, setMenuOpen] = useState(false)

  function menuButtonHandler(e) {
    if (menuOpen) {
      e.target.parentElement.childNodes[1].className = ''
      menuButtonText.current = openSymbol
      setFontShown(false)
      setShowFontSize(false)
      e.target.blur()
    }
    else {
      e.target.parentElement.childNodes[1].className = 'slideOpen'
      menuButtonText.current = closeSymbol
    }
    setMenuOpen(!menuOpen)
  }

  // const textContainerRef = useRef(null)
  const innerTextContainerRef = useRef()
  const textRef = useRef()
  /* const [foo, setFoo] = useState(0)
    useEffect(() => {
      // console.log(textContainerRef.current.clientHeight >= innerTextContainerRef.current.clientHeight)
      console.log(innerTextContainerRef.current.clientWidth)
      setFoo(foo + 1)
    }, [innerTextContainerRef.current.clientWidth]) */

  const navigate = useNavigate()

  function navigateTo(e, url) {
    e.preventDefault()
    navigate(url)
  }

  const fonts = {
    times: '\'Times New Roman\', Times, serif',
    david: 'David',
    frank_ruhl: 'Frank-Ruhl',
    stam: 'Stam'
  }

  const [fontShown, setFontShown] = useState(false)
  const [font, setFont] = useState(fonts.stam)

  const fontList = Object.entries(fonts).map(x => <li> <button className={font === x[1] && 'selectedFont'} onClick={() => setFont(x[1])}>{x[0].replace('_', ' ')}</button></li>)

  // const foo = useGetElementDimensions(innerTextContainerRef.current)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, fontSize: 0 })

  const [left, setLeft] = useState(0)

  const [showFontSize, setShowFontSize] = useState(false)

  function fontLarger() {
    setDimensions({...dimensions, fontSize: dimensions.fontSize * 1.05})
  }

  function fontSmaller() {
    setDimensions({...dimensions, fontSize: dimensions.fontSize * 0.95})
  }

  useLayoutEffect(() => {

    function updateDimensions() {
      setDimensions({
        width: innerTextContainerRef.current.clientWidth,
        height: innerTextContainerRef.current.clientHeight,
        fontSize: innerTextContainerRef.current.clientWidth / 14
      })
      /* if (innerTextContainerRef.current.clientWidth !== 0) {
        console.log(left, left % innerTextContainerRef.current.clientWidth)
        setLeft(left - (left % innerTextContainerRef.current.clientWidth))
        console.log('hi') */
      setLeft(0)
      // }
      // console.log(innerTextContainerRef.current)
    }

    window.addEventListener('resize', updateDimensions)

    updateDimensions()

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  function isMenuTarget(e) {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SECTION' && e.target.tagName !== 'UL' && e.target.tagName !== 'LI') {
      return true
    }
    return false
  }

  const pagesTurned = useRef(0)

  const pageForward = useCallback(() => {
    // console.log('forward')
    if (left < textRef.current.offsetWidth - dimensions.width) {
      setLeft(left + dimensions.width)
      pagesTurned.current = pagesTurned.current + 1
    }
  }, [dimensions.width, left])

  const pageBack = useCallback(() => {
    if (pagesTurned.current > 0) {
      pagesTurned.current = pagesTurned.current - 1
      setLeft(left - dimensions.width)
    }
  }, [dimensions.width, left])

  useEffect(() => {
    function handleKeyDown(e) {
      // console.log(e.code)
      if (e.code === 'Enter'
        || e.code === 'Space'
        || e.code === 'ArrowLeft'
        || e.code === 'ArrowDown'
        || e.code === 'PageDown') {
        pageForward()
      }
      else if (e.code === 'ArrowRight' || e.code === 'PageUp' || e.code === 'ArrowUp') {
        pageBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pageBack, pageForward])

  function clickForward(e) {
    if (isMenuTarget(e)/*  && left < textRef.current.offsetWidth - dimensions.width */) {
      pageForward()
      // console.log(textRef.current.offsetWidth, left)
    }
  }

  function clickBack(e) {
    e.preventDefault()
    if (isMenuTarget(e)/*  && pagesTurned.current > 0 */) {
      pageBack()
    }
  }

  function onWheelHandler(e) {
    if (e.deltaX < 0 || e.deltaY > 0) {
      pageForward()
    }
    else if (e.deltaX > 0 || e.deltaY < 0) {
      pageBack()
    }
  }

  return (
    <div id='readerContainer' onClick={clickForward} onContextMenu={clickBack} onWheel={onWheelHandler}>
      <button id='menuButton' onClick={menuButtonHandler}>{menuButtonText.current}</button>
      <section id='menu'>
        <ul>
          <li>
            <a href='/' onClick={(e) => navigateTo(e, '/')}><button>Home</button></a>
          </li>
          <li>
            <button onClick={() => setFontShown(!fontShown)}>Select Font</button>
            {fontShown && <ul>{fontList}</ul>}
          </li>
          <li>
            <button onClick={() => setShowFontSize(!showFontSize)}>Font Size</button>
            {showFontSize &&
              <div id='fontSize'>
                <button onClick={fontSmaller}>&#65293;</button>
                <button onClick={fontLarger}>&#65291;</button>
              </div>}
          </li>
        </ul>
      </section>
      <div id='textContainer' onScroll={e => e.target.scrollTo(0, 0)}/* ref={textContainerRef} */>
        <div id='innerTextContainer' ref={innerTextContainerRef} style={{ columnWidth: dimensions.width, left: left, fontSize: dimensions.fontSize/* dimensions.width / 14 + 'px' */, fontFamily: font }}>
          <div id='text' ref={textRef}>{text}</div>
        </div>
      </div>
    </div>
  )
}
