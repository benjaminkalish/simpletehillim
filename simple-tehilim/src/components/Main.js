import React, { useState } from 'react'
import lamnatzeach from '../lamnatzeach.jpeg'
import '../css/Main.css'
import { HDate, gematriya } from '@hebcal/core'

export default function Main() {

    const [perakimShown, setPerakimShown] = useState(false)
    const [sefarimShown, setSefarimShown] = useState(false)

    const perakim = new Array(150).fill(0).map((x, i) => x = <button>{gematriya(i + 1)}</button>)

    const sefarim = new Array(5).fill(0).map((x, i) => x = <button id='i+1'>ספר {gematriya(i + 1)}</button>)

    const date = new Date()

    if(date.getHours() > 20){
        date.setDate(date.getDate() + 1)
    }

    const hebDay = new HDate(date)

    return (
        <main id='home'>
            <div>
                <h1>Simple Tehilim</h1>
                <h3>Clear. Readable. Usable.</h3>
                <div id='buttonContainer'>
                    <button onClick={() => { setPerakimShown(true); setSefarimShown(false); }}>Select Perek</button>
                    <button onClick={() => { setPerakimShown(false); setSefarimShown(true); }}>Select Sefer</button>
                    <button>Tehilim for {hebDay.renderGematriya().split(' ').slice(0, -1).join(' ')}</button>
                    <button>Tehilim for יום {gematriya(date.getDay() + 1)}</button>
                </div>
            </div>
            <section>
                {perakimShown && <div className='selector'>{perakim}</div>}
                {sefarimShown && <div className='selector' id='sefer'>{sefarim}</div>}
                <img src={lamnatzeach} alt='foo'></img>
            </section>
        </main>
    )
}
