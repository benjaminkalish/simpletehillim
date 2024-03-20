import { useLoaderData } from 'react-router-dom'
import { gematriya } from '@hebcal/core';
import '../css/Reader.css'
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetElementDimensions from '../useGetElementDimensions';

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
  const [font, setFont] = useState(fonts.times)

  const fontList = Object.entries(fonts).map(x => <li> <button className={font === x[1] && 'selectedFont'} onClick={() => setFont(x[1])}>{x[0].replace('_', ' ')}</button></li>)




  // const foo = useGetElementDimensions(innerTextContainerRef.current)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const [left, setLeft] = useState(0)

  useLayoutEffect(() => {

    function updateDimensions() {
      setDimensions({
        width: innerTextContainerRef.current.clientWidth,
        height: innerTextContainerRef.current.clientHeight
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

  function foo(e) {
    // console.log(e)
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SECTION' && e.target.tagName !== 'UL' && e.target.tagName !== 'LI') {
      pageDown()
    }
  }


  function pageDown() {
    if (left < textRef.current.offsetWidth - dimensions.width)
      setLeft(left + dimensions.width)
    // console.log(textRef.current.offsetWidth, left)
  }

  function pageUp() {

  }

  return (
    <div id='readerContainer' onClick={foo}>
      <button id='menuButton' onClick={menuButtonHandler}>{menuButtonText.current}</button>
      <section id='menu'>
        <ul>
          <li>
            <a href='/' onClick={(e) => navigateTo(e, '/')}><button>Home</button></a>
            <button onClick={() => setFontShown(!fontShown)}>Select Font</button>
            {fontShown && <ul>{fontList}</ul>}
          </li>
        </ul>
      </section>
      <div id='textContainer' onScroll={e => e.target.scrollTo(0, 0)}/* ref={textContainerRef} */>
        <div id='innerTextContainer' ref={innerTextContainerRef} style={{ columnWidth: dimensions.width, left: left, fontSize: dimensions.width / 14 + 'px', fontFamily: font }}>
          <div id='text' ref={textRef}>{text}</div>
        </div>
      </div>
    </div>
  )
}
