import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import '../css/Reader.css'

export default function Reader() {
  const [data, setData] = useState(useLoaderData());
  console.log(data)

  return (
    <div id='readerContainer'>
      <button id='menu'>☰</button>
      <div id='textContainer'>{data.text.join('  ')}</div>
    </div>
  )
}
