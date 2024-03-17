import { useLoaderData } from 'react-router-dom'
import { gematriya } from '@hebcal/core';
import '../css/Reader.css'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reader() {
  const data = useLoaderData()
  console.log(data)
  const text = data.map((datum, i) => <div className='perek' key={i}><h2 className='perekHeading'>{perekName(datum.perek)}</h2><p>{datum.text.join('  ')}</p></div>)

  function perekName(n) {
    return `פרק ${gematriya(n).replaceAll('׳', '')}`
  }
  const openSymbol = '☰'
  const closeSymbol = '\u{2715}'
  const menuButtonText = useRef(openSymbol)

  const [menuOpen, setMenuOpen] = useState(false)

  function menuButtonHandler(e) {
    if (menuOpen) {
      e.target.parentElement.childNodes[1].className = ''
      menuButtonText.current = openSymbol
    }
    else {
      e.target.parentElement.childNodes[1].className = 'slideOpen'
      menuButtonText.current = closeSymbol
    }
    setMenuOpen(!menuOpen)
  }

  const textContainerRef = useRef(null)
  const innerTextContainerRef = useRef(null)

  useEffect(() => {
    console.log(textContainerRef.current.clientHeight >= innerTextContainerRef.current.clientHeight)
    console.log(innerTextContainerRef.current)
  }, [])

  const navigate = useNavigate()

  function navigateTo(e, url) {
    e.preventDefault()
    navigate(url)
}

  const [fontShown, setFontShown] = useState(false)

  return (
    <div id='readerContainer'>
      <button id='menuButton' onClick={menuButtonHandler}>{menuButtonText.current}</button>
      <section id='menu'>
        <ul>
          <li>
            <a href='/' onClick={(e) => navigateTo(e, '/')}><button>Home</button></a>
            <button onClick={() => setFontShown(!fontShown)}>Select Font</button>
            {fontShown && <ul>
              <li>font1</li>
              <li>font2</li>
              <li>font3</li>
              </ul>}
          </li>
        </ul>
      </section>
      <div id='textContainer' ref={textContainerRef}>
        <div id='innerTextContainer' ref={innerTextContainerRef}>{text}</div>
      </div>
    </div>
  )
}
