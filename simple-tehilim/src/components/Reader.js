import { useLoaderData } from 'react-router-dom'
import { gematriya } from '@hebcal/core';
import '../css/Reader.css'
import { useEffect, useRef, useState/* , useLayoutEffect, useEffect, useCallback */ } from 'react';
import { useNavigate } from 'react-router-dom';
import Text from './Text';
// import TrippleText from './TrippleText';
// import TestText from './TestText';
// import TestText2 from './TestText2';

// import useGetElementDimensions from '../useGetElementDimensions';

export default function Reader({ type }) {
  const openSymbol = '☰'
  const closeSymbol = '\u{2715}'
  const menuButtonText = useRef(openSymbol)

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


  const navigate = useNavigate()

  function navigateTo(e, url) {
    e.preventDefault()
    navigate(url)
  }

  const fonts = {
    times: '\'Times New Roman\', Times, serif',
    david: 'David',
    /* frank_ruhl: 'Frank-Ruhl', */
    stam: 'Stam'
  }

  const [fontShown, setFontShown] = useState(false)
  const [font, setFont] = useState(fonts.times)

  const fontList = Object.entries(fonts).map(x => <li key={x[0]}> <button className={font === x[1] && 'selectedFont'} onClick={() => setFont(x[1])}>{x[0].replace('_', ' ')}</button></li>)


  const [fontSizeCoefficient, setFontSizeCoefficient] = useState(1)
  const [showFontSize, setShowFontSize] = useState(false)

  function fontLarger() {
    setFontSizeCoefficient(c => Math.round(c * 105) / 100)
  }

  function fontSmaller() {
    setFontSizeCoefficient(c => Math.round(c * 95) / 100)
  }

  const [text, /* setText */] = useState(useLoaderData())
  const [formattedText, setFormattedText] = useState()
  useEffect(() => {
    function perekName(n) {
      return `פרק ${gematriya(n).replaceAll('׳', '')}`
    }

    let typeText
    let isFirst = false
    let isLast = false

    switch (type) {
      case 'perek':
        typeText = 'Perek'
        if (text[0].perek === 1) {
          isFirst = true
        }
        else if (text[0].perek === 150) {
          isLast = true
        }
        break
      case 'month':
        typeText = 'Day'
        if (text[0].dayMonth === 1) {
          isFirst = true
        }
        else if (text[0].dayMonth === 30) {
          isLast = true
        }
        break
      case 'week':
        typeText = 'Day'
        if (text[0].dayWeek === 1) {
          isFirst = true
        }
        if (text[0].dayWeek === 7) {
          isLast = true
        }
        break
      case 'sefer':
        typeText = 'Sefer'
        if (text[0].sefer === 1) {
          isFirst = true
        }
        if (text[0].sefer === 5) {
          isLast = true
        }
        break
      default:
        typeText = undefined
        isFirst = true
        isLast = true
        break
    }

    const prevButton = !isFirst && <button key='prev'>Previous {typeText}</button>
    const nextButton = !isLast && <button key='next'>Next {typeText}</button>

    setFormattedText([prevButton, text.flatMap(datum => [<h2 className='perekHeading' key={datum.perek}>{perekName(datum.perek)}</h2>]
      .concat(datum.text.join(' ').split(' ').map(x => x + ' '))), nextButton].flat()
    )
  }, [text])

  return (
    <div id='readerContainer'>
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
          {<li>
            <button onClick={() => setShowFontSize(!showFontSize)}>Font Size</button>
            {showFontSize &&
              <div id='fontSize'>
                <button onClick={fontSmaller}>&#65293;</button>
                <button onClick={fontLarger}>&#65291;</button>
              </div>}
          </li>}
        </ul>
      </section>
      {formattedText && <Text formattedText={formattedText} font={font} fontSizeCoefficient={fontSizeCoefficient} />}
    </div>
  )
}