import React, { useRef, useState, useEffect } from 'react'
import { gematriya } from '@hebcal/core';

export default function Text(props) {
    const [visibleText, setVisibleText] = useState([0, 0])
    const textContainerRef = useRef()
    const innerTextContainerRef = useRef()
    const isRoom = useRef(true)
    const index = useRef(0)
    // const text = props.text.map((datum, i) => <div className='perek' key={i}><h2 className='perekHeading'>{perekName(datum.perek)}</h2><p>{datum.text.join('  ')}</p></div>)
    function perekName(n) {
        return `פרק ${gematriya(n).replaceAll('׳', '')}`
    }
    const testText = props.text.map((datum) => datum.text.join(' ')).join(' ').split(' ')
    const didMount = useRef(false)
    //   const textRef = useRef()
    //   const [foo, setFoo] = useState(0)

    useEffect(() => {
        index.current = 70
        setVisibleText([0, index.current])
    }, [testText])

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }

        if (!innerTextContainerRef || !textContainerRef) {
            return
        }
        /* if (textContainerRef.current.clientHeight > innerTextContainerRef.current.clientHeight
            && index.current < testText.length
            && isRoom.current) {
            setVisibleText(testText.slice(0, index.current).join(' '))
            index.current = index.current + 1
        }
        else if (isRoom.current){
            console.log('here')
            isRoom.current = false
            let oneLess = index.current - 2
            setVisibleText(testText.slice(0, oneLess).join(' '))
            index.current = oneLess
            console.log(testText[oneLess])
        } */
    }, [visibleText, textContainerRef, innerTextContainerRef, testText])
    
    return (
        <div id='textContainer' /* onScroll={e => e.target.scrollTo(0, 0)} */ ref={textContainerRef}>
            <div id='innerTextContainer' ref={innerTextContainerRef} style={{ /* columnWidth: dimensions.width, left: left *//* , fontSize: dimensions.fontSize *//* dimensions.width / 14 + 'px' , *//* fontFamily: font */ }}>
                {testText.slice(visibleText[0], visibleText[1]).join(' ')}
            </div>
        </div>
    )
}
