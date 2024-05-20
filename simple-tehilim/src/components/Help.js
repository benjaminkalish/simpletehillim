import React from 'react'
import '../css/Help.css'

export default function Help({ setHelpShown }) {
    return (
        <div id='modal'>
            <div id='helpBox'>
                <section>
                <p>
                    To go forward one page, scroll down or press left arrow, down arrow, or page down.
                </p>
                <p>
                    To go back one page, scroll up or press right arrow, up arrow, or page up.
                </p>
                </section>             
                <button onClick={() => setHelpShown(h => !h)}>Got it!</button>
            </div>
        </div>
    )
}
