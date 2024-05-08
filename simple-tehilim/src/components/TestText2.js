import React, { useRef, useState, useEffect, useCallback } from 'react'
import { gematriya } from '@hebcal/core';
import PropTypes from 'prop-types';
import '../css/TrippleText.css'

export default function TestText2({ text, font }) {
    const [fullText/* , setFullText */] = useState(
        text.flatMap(datum => [<h2 className='perekHeading' key={datum.perek}>{perekName(datum.perek)}</h2>]
            .concat(datum.text.join(' ').split(' ').map(x => x + ' ')))/* .map(x => typeof(x) === 'string' ? x + ' ' : x) */
    )
    const [opacities, setOpacities] = useState({ a: 0, b: 0, c: 0 })
    const textContainerRef = useRef()
    const innerTextContainerRef = useRef()
    const page = useRef(1)
    const top1 = useRef(0)
    const maxWords = 60
    const bottom1 = useRef(maxWords)
    const bottom2 = useRef(maxWords * 2)
    const bottom3 = useRef(maxWords * 3)
    const p1IsSet = useRef(false)
    const p2IsSet = useRef(false)
    const p3IsSet = useRef(false)
    /* const topIndex = useRef(0)
    const bottomIndex = useRef(0) */
    const a = useRef()
    const b = useRef()
    const c = useRef()


    function perekName(n) {
        return `פרק ${gematriya(n).replaceAll('׳', '')}`
    }

    const text1 = useCallback(() => {
        return fullText.slice(top1.current, bottom1.current)
    }, [fullText])

    const text2 = useCallback(() => {
        return fullText.slice(bottom1.current, bottom2.current)
    }, [fullText])

    const text3 = useCallback(() => {
        return fullText.slice(bottom2.current, bottom3.current)
    }, [fullText])

    const aTextFunction = useRef(text1)
    const bTextFunction = useRef(text2)
    const cTextFunction = useRef(text3)

    const [visibleText, setVisibleText] = useState({})

    const didMount = useRef(false)

    /* const layoutInitialize = useCallback(() => {
        bottomIndex.current = 120 + topIndex.current
        setVisibleText([topIndex.current, bottomIndex.current])
    }, []) */

    useEffect(() => {
        setVisibleText({ aText: aTextFunction.current(), bText: bTextFunction.current(), cText: cTextFunction.current() })
    }, [])

    /* const setPage3 = useCallback((element) => {
        if (textContainerRef.current.clientHeight
            < element.current.clientHeight) {
            bottom3.current = bottom3.current - 2

        }
        else {
            p3IsSet.current = true
        }
    }, [])

    const setPage2 = useCallback((element) => {
        if (textContainerRef.current.clientHeight
            < element.current.clientHeight) {
            bottom2.current = bottom2.current - 2
            bottom3.current = bottom2.current + maxWords

        }
        else {
            p2IsSet.current = true
            setPage3(c)
        }
    }, [setPage3])

    const setPage1 = useCallback((element) => {
        if (textContainerRef.current.clientHeight
            < element.current.clientHeight) {
            bottom1.current = bottom1.current - 2
            bottom2.current = bottom1.current + maxWords
            bottom3.current = bottom2.current + maxWords

        }
        else {
            showPage()
            p1IsSet.current = true
            setPage2(b)
        }
    }, [setPage2]) */

    const interval = useRef(maxWords / 3)

    const setTextLayout = useCallback((container, bottomIndexRef, boolRef) => {
        if (textContainerRef.current.clientHeight
            < container.current.clientHeight) {
            interval.current = Math.ceil(interval.current / 2)
            bottomIndexRef.current = bottomIndexRef.current - interval.current
        }
        else if (textContainerRef.current.clientHeight
            > container.current.clientHeight && interval.current > 1) {
            bottomIndexRef.current = bottomIndexRef.current + interval.current
        }
        else {
            interval.current = maxWords
            boolRef.current = true
        }
    }, [])


    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }

        if (!p1IsSet.current) {
            // setPage1(a)
            setTextLayout(a, bottom1, p1IsSet)
            setVisibleText({ ...visibleText, aText: aTextFunction.current() })
        }
        else if (!p2IsSet.current) {
            showPage()
            // setPage2(b)
            setTextLayout(b, bottom2, p2IsSet)
            setVisibleText({ ...visibleText, bText: bTextFunction.current() })
        }
        else if (!p3IsSet.current) {
            // setPage3(c)
            setTextLayout(c, bottom3, p3IsSet)
            setVisibleText({ ...visibleText, cText: cTextFunction.current() })
        }

    }, [setTextLayout, text1, text2, text3, visibleText])

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

    function showPage() {
        const p = page.current

        if (p % 3 === 0) {
            setOpacities({ a: 0, b: 0, c: 1 })
        }
        else if (p % 3 === 2) {
            setOpacities({ a: 0, b: 1, c: 0 })
        }
        else {
            setOpacities({ a: 1, b: 0, c: 0 })
        }
    }

    useEffect(() => {
        function pageForward() {

            /*  if (bottomIndex.current >= fullText.length) {
                 return
             }
             topIndex.current = bottomIndex.current
             bottomIndex.current = bottomIndex.current + 120
             setVisibleText([topIndex.current, bottomIndex.current]) */
            page.current = page.current + 1
            showPage()

            if (top1.current === 0 && page.current === 2) {
                return
            }

            bottom2.current = bottom3.current
            bottom3.current = bottom3.current + maxWords

            if (page.current % 3 === 0) {
                p1IsSet.current = false
                aTextFunction.current = text3
                
                setVisibleText(v => {return { ...v, aText: aTextFunction.current() }})
            }
            else if (page.current % 3 === 2) {
                p3IsSet.current = false
                cTextFunction.current = text3
                setVisibleText(v => {return { ...v, cText: cTextFunction.current() }})
            }
            else {
                // setPage3(b)
                p2IsSet.current = false
                bTextFunction.current = text3
                setVisibleText(v => {return { ...v, bText: bTextFunction.current() }})
            }
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
    }, [text3])

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

TestText2.propTypes = {
    text: PropTypes.arrayOf(PropTypes.shape({
        dayMonth: PropTypes.number,
        dayWeek: PropTypes.number,
        perek: PropTypes.number,
        sefer: PropTypes.number,
        text: PropTypes.arrayOf(PropTypes.string)
    })),
    font: PropTypes.string
}