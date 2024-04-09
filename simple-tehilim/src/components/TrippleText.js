import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { gematriya } from '@hebcal/core';

export default function TrippleText({ text, font }) {
    const [totalText, setTotalText] = useState(
        text.flatMap(datum => [<h2 className='perekHeading' key={datum.perek}>{perekName(datum.perek)}</h2>]
            .concat(datum.text.join(' ').split(' ').map(x => x + ' ')))/* .map(x => typeof(x) === 'string' ? x + ' ' : x) */
    )
    const [opacities, setOpacities] = useState({ a: 1, b: 0, c: 0 })
    const textContainerRef = useRef()
    const innerTextContainerRef = useRef()
    const page = useRef(1)
    const top1 = useRef(0)
    const maxWords = 120
    const bottom1 = useRef(maxWords)
    const bottom2 = useRef(maxWords * 2)
    const bottom3 = useRef(maxWords * 3)
    const p1IsSet = useRef(false)
    const p2IsSet = useRef(false)
    const p3IsSet = useRef(false)
    const topIndex = useRef(0)
    const bottomIndex = useRef(0)
    const a = useRef()
    const b = useRef()
    const c = useRef()
    

    function perekName(n) {
        return `פרק ${gematriya(n).replaceAll('׳', '')}`
    }

    const text1 = useCallback(() => {
        return totalText.slice(top1.current, bottom1.current)
    }, [totalText])

    const text2 = useCallback(() => {
        return totalText.slice(bottom1.current, bottom2.current)
    }, [totalText])

    const text3 = useCallback(() => {
        return totalText.slice(bottom2.current, bottom3.current)
    }, [totalText])

    const [visibleText, setVisibleText] = useState({})

    const didMount = useRef(false)


    /* const layoutInitialize = useCallback(() => {
        bottomIndex.current = 120 + topIndex.current
        setVisibleText([topIndex.current, bottomIndex.current])
    }, []) */

    useEffect(() => {
        setVisibleText({ aText: text1(), bText: text2(), cText: text3() })
    }, [text1, text2, text3, totalText])

    const setPage3 = useCallback((element) => {
        if (textContainerRef.current.clientHeight
            < element.current.clientHeight) {
            bottom3.current = bottom3.current - 2
            setVisibleText({ ...visibleText, cText: text3() })
        }
        else {
            p3IsSet.current = true
        }
    }, [text3, visibleText])

    const setPage2 = useCallback((element) => {
        if (textContainerRef.current.clientHeight
            < element.current.clientHeight) {
            bottom2.current = bottom2.current - 2
            bottom3.current = bottom2.current + maxWords
            console.log(text3())
            setVisibleText({ ...visibleText, bText: text2(), cText: text3() })
        }
        else {
            p2IsSet.current = true
            setPage3(c)
        }
    }, [setPage3, text2, text3, visibleText])

    const setPage1 = useCallback((element) => {
        if (textContainerRef.current.clientHeight
            < element.current.clientHeight) {
            bottom1.current = bottom1.current - 2
            bottom2.current = bottom1.current + maxWords
            bottom3.current = bottom2.current + maxWords
            setVisibleText({ aText: text1(), bText: text2(), cText: text3() })
        }
        else {
            p1IsSet.current = true
            setPage2(b)
        }
    }, [setPage2, text1, text2, text3])

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }

        if (!p1IsSet.current) {
            setPage1(a)
        }
        else if (!p2IsSet.current) {
            setPage2(b)
        }
        else if (!p3IsSet.current) {
            setPage3(c)
        }
        else {
            return
        }

    }, [setPage1, setPage2, setPage3, visibleText])

    /* const layoutRecalculate = useCallback(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }
        if (textContainerRef.current.clientHeight
            < innerTextContainerRef.current.clientHeight) {
            bottomIndex.current = bottomIndex.current - 2
            setVisibleText([topIndex.current, bottomIndex.current])
        }
    }, []) */

    /*  const trim = useCallback((element) => {
         if (!didMount.current) {
             didMount.current = true
             return
         }
         if (textContainerRef.current.clientHeight
             < element.current.clientHeight) {
             bottomIndex.current = bottomIndex.current - 2
             setVisibleText([topIndex.current, bottomIndex.current])
         }
     }, [setVisibleText]) */




    useLayoutEffect(() => {
        function pageForward() {
            if (bottomIndex.current >= totalText.length) {
                return
            }
            topIndex.current = bottomIndex.current
            bottomIndex.current = bottomIndex.current + 120
            setVisibleText([topIndex.current, bottomIndex.current])
        }

        function pageBack() {

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
        // window.addEventListener('resize', layoutInitialize)
        window.addEventListener('click', clickHandler)

        return () => {
            window.removeEventListener('keydown', keydownHandler)
            // window.removeEventListener('resize', layoutInitialize)
            window.removeEventListener('click', clickHandler)
        }
    }, [totalText.length, /* layoutInitialize */])

    return (
        <div id='textContainer' /* onScroll={e => e.target.scrollTo(0, 0)} */ ref={textContainerRef} style={{ fontFamily: font }}>
            {<div id='innerTextContainer' ref={innerTextContainerRef}>
                {/* displayText.slice(visibleText[0], visibleText[1]) */}
            </div>}
            <div ref={a} className='innerTextContainer' style={{ opacity: opacities.a }}>
                {visibleText.aText}
            </div>
            <div ref={b} className='innerTextContainer' style={{ opacity: opacities.b }}>
                {visibleText.bText}
            </div>
            <div ref={c} className='innerTextContainer' style={{ opacity: opacities.c }}>
                {visibleText.cText}
            </div>
        </div>
    )
}
