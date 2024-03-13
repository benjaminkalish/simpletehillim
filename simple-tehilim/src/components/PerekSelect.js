import React from 'react'

export default function PerekSelect() {

    const perakim = new Array(150).fill(0).map((x, i) => x = <button>{i + 1}</button>)
    console.log(perakim)

  return (
    <div id='perekSelect'>{perakim}</div>
  )
}
