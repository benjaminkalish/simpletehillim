import React, { useState } from "react";
import lamnatzeach from "../lamnatzeach.jpeg";
import "../css/Main.css";
import { HDate, gematriya } from "@hebcal/core";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const [perakimShown, setPerakimShown] = useState(false);
  const [sefarimShown, setSefarimShown] = useState(false);

  const navigate = useNavigate();

  function navigateTo(e, url) {
    e.preventDefault();
    navigate(url);
  }

  const perakim = new Array(150).fill(0).map(
    (x, i) =>
      (x = (
        <a
          className="buttonLink"
          key={i}
          href={`/perek/${i + 1}`}
          onClick={(e) => navigateTo(e, `/perek/${i + 1}`)}
        >
          <button>{gematriya(i + 1)}</button>
        </a>
      ))
  );

  const sefarim = new Array(5).fill(0).map(
    (x, i) =>
      (x = (
        <a
          className="buttonLink"
          href={`/sefer/${i + 1}`}
          onClick={(e) => navigateTo(e, `/sefer/${i + 1}`)}
          key={i}
        >
          <button>ספר {gematriya(i + 1)}</button>
        </a>
      ))
  );

  const date = new Date();

  if (date.getHours() >= 20) {
    date.setDate(date.getDate() + 1);
  }

  const hebDay = new HDate(date);

  return (
    <main id="home">
      <div>
        <h1>Simple Tehillim</h1>
        <h3>Simple to use. Easy to read.</h3>
        <div id="buttonContainer">
          <button
            onClick={() => {
              setPerakimShown(true);
              setSefarimShown(false);
            }}
          >
            Select Perek
          </button>
          <button
            onClick={() => {
              setPerakimShown(false);
              setSefarimShown(true);
            }}
          >
            Select Sefer
          </button>
          <a
            className="buttonLink"
            href={`/month/${hebDay.getDate()}`}
            onClick={(e) => navigateTo(e, `/month/${hebDay.getDate()}`)}
          >
            <button>
              Tehillim for{" "}
              {
                hebDay
                  .renderGematriya()
                  .split(" ")
                  .slice(0, -1)
                  .join(" ") /* .replaceAll('׳', '') */
              }
            </button>
          </a>
          <a
            className="buttonLink"
            href={`/week/${date.getDay() + 1}`}
            onClick={(e) => navigateTo(e, `/week/${date.getDay() + 1}`)}
          >
            <button>Tehillim for יום {gematriya(date.getDay() + 1)}</button>
          </a>
        </div>
        <small></small>
      </div>
      <section>
        {perakimShown && <div className="selector">{perakim}</div>}
        {sefarimShown && (
          <div className="selector" id="sefer">
            {sefarim}
          </div>
        )}
        <img src={lamnatzeach} alt="lamnatzeach menorah"></img>
      </section>
    </main>
  );
}
