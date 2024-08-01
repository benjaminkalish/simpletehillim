import React from "react";
import "../css/Help.css";

export default function Help({ setHelpShown }) {
  return (
    <div id="modal">
      <div id="helpBox">
        <section>
          <h4>Desktop</h4>
          <p>
            To go forward one page, left-click, scroll down or press enter,
            space, left arrow, down arrow, or page down.
          </p>
          <p>
            To go back one page, right-click, scroll up or press right arrow, up
            arrow, or page up.
          </p>
        </section>
        <section>
          <h4>Mobile</h4>
          <p>To go forward one page, tap, swipe up, or swipe right.</p>
          <p>To go back one page, two-finger tap, swipe down, or swipe left.</p>
        </section>
        <button onClick={() => setHelpShown((h) => !h)}>Got it!</button>
      </div>
    </div>
  );
}
