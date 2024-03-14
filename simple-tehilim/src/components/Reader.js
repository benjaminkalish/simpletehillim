import { useLoaderData } from 'react-router-dom'
import myGematriya from '../myGematriya';
import '../css/Reader.css'

export default function Reader() {
  const data = useLoaderData()
  let text;

  if (data.length) {
    text = data.map((datum, i) => <div key={i}><h2>{perekName(datum.perek)}</h2><p>{datum.text.join('  ')}</p></div>)
  }
  else {
    text = <div><h2>{perekName(data.perek)}</h2><p>{data.text.join('  ')}</p></div>
  }

  function perekName(n) {
    return `פרק ${myGematriya(n)}`
  }

  return (
    <div id='readerContainer'>
      <button id='menu'>☰</button>
      <div id='textContainer'>{text}</div>
    </div>
  )
}
