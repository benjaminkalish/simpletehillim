import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { gematriya } from '@hebcal/core';

export default function Text({text}) {
    const [visibleText, setVisibleText] = useState([0, 0])
    const textContainerRef = useRef()
    const innerTextContainerRef = useRef()
    const isRoom = useRef(true)
    const topIndex = useRef(0)
    const bottomIndex = useRef(0)

    // const testText = text.map((datum, i) => <div className='perek' key={i}><h2 className='perekHeading'>{perekName(datum.perek)}</h2><p>{datum.text.join('  ')}</p></div>)
    function perekName(n) {
        return `פרק ${gematriya(n).replaceAll('׳', '')}`
    }
    // const testText = text.map((datum) => datum.text.join(' ')).join(' ').split(' ')
    const testText = text.flatMap(datum => [<h2 className='perekHeading'>{perekName(datum.perek)}</h2>].concat(datum.text.join(' ').split(' '))).map(x => typeof(x) === 'string' ? x + ' ' : x)
    // const testText = text.map(datum => <div>datum.perek</div>)


    const didMount = useRef(false)
    //   const textRef = useRef()
    //   const [foo, setFoo] = useState(0)

    const layoutInitialize = useCallback(() => {
        console.log(testText)
        bottomIndex.current = 70
        setVisibleText([topIndex.current, bottomIndex.current])
    }, [])

    useEffect(() => {
        layoutInitialize()
    }, [layoutInitialize])

    const layoutRecalculate = useCallback(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }
        if (!innerTextContainerRef || !textContainerRef) {
            return
        }
        if (isRoom.current && textContainerRef.current.clientHeight < innerTextContainerRef.current.clientHeight) {
            bottomIndex.current = bottomIndex.current - 2
            setVisibleText([topIndex.current, bottomIndex.current])
        }

    }, [])

    useEffect(() => {
        layoutRecalculate()
    }, [visibleText, textContainerRef, innerTextContainerRef, layoutRecalculate])

    useLayoutEffect(() => {
        function clickHandler(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SECTION' || e.target.tagName === 'UL' || e.target.tagName === 'LI') {
                return
            }
            if(bottomIndex.current >= testText.length){
                return
            }
            topIndex.current = bottomIndex.current
            bottomIndex.current = bottomIndex.current + 70
            setVisibleText([topIndex.current, bottomIndex.current])
        }


        window.addEventListener('resize', layoutInitialize)
        window.addEventListener('click', clickHandler)
        return () => window.removeEventListener('resize', layoutInitialize)
    }, [layoutInitialize])

    return (
        <div id='textContainer' /* onScroll={e => e.target.scrollTo(0, 0)} */ ref={textContainerRef}>
            <div id='innerTextContainer' ref={innerTextContainerRef} style={{ /* columnWidth: dimensions.width, left: left *//* , fontSize: dimensions.fontSize *//* dimensions.width / 14 + 'px' , *//* fontFamily: font */ }}>
                {testText.slice(visibleText[0], visibleText[1])}
            </div>
        </div>
    )
}
