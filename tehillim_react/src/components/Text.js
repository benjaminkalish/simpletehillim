import React, { useRef, useState, useEffect, useCallback } from "react";
import "../css/Text.css";
import PropTypes from "prop-types";

export default function Text({ formattedText, font, fontSizeCoefficient }) {
  const [visibleText, setVisibleText] = useState([0, 0]);
  const [opacity, setOpacity] = useState();
  const textContainerRef = useRef();
  const innerTextContainerRef = useRef();
  const topIndex = useRef(0);
  const bottomIndex = useRef(0);
  const didMount = useRef(false);
  const maxWords = 60;

  let defaultFontSize;
  let fontUnit;

  if (window.innerWidth > 500) {
    defaultFontSize = 3.5;
    fontUnit = "vw";
  } else {
    defaultFontSize = 5;
    fontUnit = "vh";
  }

  const innerTextContainerStyle = {
    opacity: opacity,
    fontFamily: font,
    fontSize: defaultFontSize * fontSizeCoefficient + fontUnit,
  };

  const layoutInitialize = useCallback(async () => {
    await document.fonts.load(`${innerTextContainerStyle.fontSize} ${font}`);
    bottomIndex.current = maxWords + topIndex.current;
    setVisibleText([topIndex.current, bottomIndex.current]);
  }, [font, innerTextContainerStyle.fontSize]);

  useEffect(() => {
    topIndex.current = 0;
  }, [formattedText]);

  useEffect(() => {
    setOpacity(0);
    layoutInitialize();
  }, [layoutInitialize, font, fontSizeCoefficient, formattedText]);

  const initialInterval = Math.ceil(maxWords / 6);
  const interval = useRef(initialInterval);
  const topDown = useRef(true);

  const layoutRecalculate = useCallback(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (
      textContainerRef.current.clientHeight <
      innerTextContainerRef.current.clientHeight
    ) {
      interval.current = Math.ceil(interval.current / 2);
      topDown.current
        ? (bottomIndex.current = bottomIndex.current - interval.current)
        : (topIndex.current = topIndex.current + interval.current);
      setVisibleText([topIndex.current, bottomIndex.current]);
    } else if (
      textContainerRef.current.clientHeight >
        innerTextContainerRef.current.clientHeight &&
      interval.current > 1 &&
      bottomIndex.current < formattedText.length
    ) {
      if (topIndex.current === 0) {
        topDown.current = true;
      }
      topDown.current
        ? (bottomIndex.current = bottomIndex.current + interval.current)
        : (topIndex.current = Math.max(topIndex.current - interval.current, 0));
      setVisibleText([topIndex.current, bottomIndex.current]);
    } else {
      interval.current = initialInterval;
      topDown.current = true;
      setOpacity(1);
    }
  }, [formattedText.length, initialInterval]);

  useEffect(() => {
    layoutRecalculate();
  }, [visibleText, textContainerRef, innerTextContainerRef, layoutRecalculate]);

  useEffect(() => {
    function isWrongClickTarget(e) {
      return (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "SECTION" ||
        e.target.tagName === "UL" ||
        e.target.tagName === "LI" ||
        e.target.tagName === "A" ||
        e.target.tagName === "P" ||
        e.target.id === "modal" ||
        e.target.id === "helpBox"
      );
    }

    function pageForward() {
      if (bottomIndex.current >= formattedText.length) {
        return;
      }
      setOpacity(0);
      topIndex.current = bottomIndex.current;
      bottomIndex.current =
        bottomIndex.current +
        Math.min(maxWords, formattedText.length - bottomIndex.current);
      setVisibleText([topIndex.current, bottomIndex.current]);
    }

    function pageBack() {
      if (topIndex.current === 0) {
        return;
      }
      setOpacity(0);
      topDown.current = false;
      bottomIndex.current = topIndex.current;
      topIndex.current = Math.max(bottomIndex.current - maxWords, 0);
      setVisibleText([topIndex.current, bottomIndex.current]);
    }

    function clickHandler(e) {
      if (isWrongClickTarget(e)) {
        return;
      }
      pageForward();
    }

    function rightClickHandler(e) {
      if (isWrongClickTarget(e)) {
        return;
      }
      e.preventDefault();
      pageBack();
    }

    function keydownHandler(e) {
      if (
        e.code === "Enter" ||
        e.code === "Space" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowDown" ||
        e.code === "PageDown"
      ) {
        pageForward();
      } else if (
        e.code === "ArrowRight" ||
        e.code === "PageUp" ||
        e.code === "ArrowUp"
      ) {
        pageBack();
      }
    }

    let time = Date.now();

    function wheelHandler(e) {
      if (isWrongClickTarget(e)) {
        return;
      }
      let now = Date.now();
      let deadZone = 3;
      if (time + 250 - now > 0) {
        return;
      } else if (e.deltaX < -deadZone || e.deltaY > deadZone) {
        pageForward();
      } else if (e.deltaX > deadZone || e.deltaY < -deadZone) {
        pageBack();
      }
      time = now;
    }

    const swipeDistance = 50;
    let swipeStart, swipeEnd;

    function handleStart(e) {
      if (isWrongClickTarget(e)) {
        return;
      }
      swipeStart = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    }

    function handleMove(e) {
      e.preventDefault();
      swipeEnd = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    }

    function handleEnd(e) {
      if (!swipeStart || !swipeEnd) {
        return;
      }

      const yDistance = swipeEnd.y - swipeStart.y;
      const xDistance = swipeEnd.x - swipeStart.x;
      const absX = Math.abs(xDistance);
      const absY = Math.abs(yDistance);

      if (
        !xDistance ||
        !yDistance ||
        (absX < swipeDistance && absY < swipeDistance)
      ) {
        return;
      }

      if (absY > absX) {
        if (yDistance > 0) {
          pageBack();
        } else {
          pageForward();
        }
      } else {
        if (xDistance < 0) {
          pageBack();
        } else {
          pageForward();
        }
      }
    }

    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("resize", layoutInitialize);
    window.addEventListener("click", clickHandler);
    window.addEventListener("contextmenu", rightClickHandler);
    window.addEventListener("wheel", wheelHandler);
    window.addEventListener("touchstart", handleStart);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("resize", layoutInitialize);
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("contextmenu", rightClickHandler);
      window.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [formattedText.length, layoutInitialize]);

  return (
    <div id="textContainer" ref={textContainerRef}>
      <div
        id="innerTextContainer"
        ref={innerTextContainerRef}
        style={innerTextContainerStyle}
      >
        {formattedText.slice(visibleText[0], visibleText[1])}
      </div>
    </div>
  );
}

Text.propTypes = {
  formattedText: PropTypes.array,
  font: PropTypes.string,
  fontSizeCoefficient: PropTypes.number,
};
