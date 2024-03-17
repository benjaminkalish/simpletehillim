import { useLoaderData } from 'react-router-dom'
import { gematriya } from '@hebcal/core';
import '../css/Reader.css'
import { useEffect, useRef, useState } from 'react';

export default function Reader() {
  const data = useLoaderData()
  
  const text = data.map((datum, i) => <div className='perek' key={i}><h2 className='perekHeading'>{perekName(datum.perek)}</h2><p>{datum.text.join('  ')}</p></div>)

  function perekName(n) {
    return `פרק ${gematriya(n).replaceAll('׳', '')}`
  }
  const openSymbol = '☰'
  const closeSymbol = '\u{2715}'
  const menuButtonText = useRef(openSymbol)

  const [menuOpen, setMenuOpen] = useState(false)

  function menuButtonHandler(e){
    // console.log(e.target.parentElement.childNodes[1])
    // e.target.parentElement.childNodes[1].className = memuOpen ? '' : 'openMenu'
    if(menuOpen) {
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

  useEffect(() => {
    textContainerRef.current.click()
    console.log('here')
  }, [menuOpen])

  return (
    <div id='readerContainer'>
      <button id='menuButton' onClick={menuButtonHandler}>{menuButtonText.current}</button>
      <section id='menu'></section>
      <div id='textContainer' ref={textContainerRef}>{text}</div>
    </div>
  )
}
