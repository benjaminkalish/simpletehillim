import React, { useState } from 'react'
import lamnatzeach from '../lamnatzeach.jpeg'
import '../css/Main.css'
// import PerekSelect from './PerekSelect'

export default function Main() {

    const [perakimShown, setPerakimShown] = useState(false)
    const [sefarimShown, setSefarimShown] = useState(false)

    const perakim = new Array(150).fill(0).map((x, i) => x = <button>{i + 1}</button>)

    const sefarim = new Array(5).fill(0).map((x, i) => x = <button id='i+1'>Sefer {i + 1}</button>)


    return (
        <main id='home'>
            <div>
                <h1>Simple Tehilim</h1>
                <h3>Please don't launch the missiles.</h3>
                <div id='buttonContainer'>
                    <button onClick={() => {setPerakimShown(true); setSefarimShown(false);}}>Select Perek</button>
                    <button onClick={() => {setPerakimShown(false); setSefarimShown(true);}}>Select Sefer</button>
                    <button>Launch the Missiles</button>
                    <button>Reformat Hard drive</button>
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
