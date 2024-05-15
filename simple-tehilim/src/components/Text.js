import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { gematriya } from '@hebcal/core';
import '../css/Text.css'
// import { flushSync } from 'react-dom';

export default function Text({ text, font }) {
    const [visibleText, setVisibleText] = useState([0, 0])
    const [opacity, setOpacity] = useState()
    const textContainerRef = useRef()
    const innerTextContainerRef = useRef()
    const topIndex = useRef(0)
    const bottomIndex = useRef(0)

    function perekName(n) {
        return `פרק ${gematriya(n).replaceAll('׳', '')}`
    }

    const [displayText, /* setDisplayText */] = useState(
        text.flatMap(datum => [<h2 className='perekHeading' key={datum.perek}>{perekName(datum.perek)}</h2>]
            .concat(datum.text.join(' ').split(' ').map(x => x + ' ')))/* .map(x => typeof(x) === 'string' ? x + ' ' : x) */
    )

    const didMount = useRef(false)
    const maxWords = 60
    const layoutInitialize = useCallback(() => {
        bottomIndex.current = maxWords + topIndex.current
        setVisibleText([topIndex.current, bottomIndex.current])
    }, [])

    useEffect(() => {
        // flushSync(() => setOpacity(0))
        setOpacity(0)
        layoutInitialize()
    }, [layoutInitialize, font])

    const initialInterval = maxWords / 6
    const interval = useRef(initialInterval)
    const topDown = useRef(true)
    const layoutRecalculate = useCallback(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }
        if (textContainerRef.current.clientHeight
            < innerTextContainerRef.current.clientHeight) {
            interval.current = Math.ceil(interval.current / 2)
            topDown.current ?
                bottomIndex.current = bottomIndex.current - interval.current
                : topIndex.current = topIndex.current + interval.current
            setVisibleText([topIndex.current, bottomIndex.current])
        }
        else if (textContainerRef.current.clientHeight
            > innerTextContainerRef.current.clientHeight && interval.current > 1
            && bottomIndex.current < displayText.length) {
            // topIndex.current === 0 && topDown.current = true
            if (topIndex.current === 0) {
                topDown.current = true
            }
            topDown.current ?
                bottomIndex.current = bottomIndex.current + interval.current
                : topIndex.current = Math.max(topIndex.current - interval.current, 0)
            // interval.current = Math.ceil(interval.current / 2)
            setVisibleText([topIndex.current, bottomIndex.current])
        }
        else {
            interval.current = initialInterval
            topDown.current = true
            setOpacity(1)
        }
        // console.log(topIndex.current, bottomIndex.current, topDown.current)
    }, [displayText.length, initialInterval])
    // console.log('hi')
    useEffect(() => {
        layoutRecalculate()
    }, [visibleText, textContainerRef, innerTextContainerRef, layoutRecalculate])

    useLayoutEffect(() => {
        function pageForward() {
            // console.log(bottomIndex.current, displayText.length)
            if (bottomIndex.current >= displayText.length) {
                return
            }
            setOpacity(0)
            topIndex.current = bottomIndex.current
            bottomIndex.current = bottomIndex.current + Math.min(maxWords, displayText.length - bottomIndex.current)
            setVisibleText([topIndex.current, bottomIndex.current])
        }

        function pageBack() {
            if (topIndex.current === 0) {
                return
            }
            setOpacity(0)
            topDown.current = false
            bottomIndex.current = topIndex.current
            topIndex.current = Math.max(bottomIndex.current - maxWords, 0)
            setVisibleText([topIndex.current, bottomIndex.current])
        }

        function isWrongClickTarget(e) {
            return e.target.tagName === 'BUTTON'
                || e.target.tagName === 'SECTION'
                || e.target.tagName === 'UL'
                || e.target.tagName === 'LI'
        }

        function clickHandler(e) {
            if (isWrongClickTarget(e)) {
                return
            }
            pageForward()
        }

        function keydownHandler(e) {
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

        window.addEventListener('keydown', keydownHandler)
        window.addEventListener('resize', layoutInitialize)
        window.addEventListener('click', clickHandler)

        return () => {
            window.removeEventListener('keydown', keydownHandler)
            window.removeEventListener('resize', layoutInitialize)
            window.removeEventListener('click', clickHandler)
        }
    }, [displayText.length, layoutInitialize])
 console.log(innerTextContainerRef.current && innerTextContainerRef.current.style.fontSize)
    return (
        <div id='textContainer' /* onScroll={e => e.target.scrollTo(0, 0)} */ ref={textContainerRef}>
            <div id='innerTextContainer' ref={innerTextContainerRef} style={{ opacity: opacity, fontFamily: font/*, columnWidth: dimensions.width, left: left *//* , fontSize: dimensions.fontSize *//* dimensions.width / 14 + 'px'*/ }}>
                {displayText.slice(visibleText[0], visibleText[1])}
            </div>
        </div>
    )
}
