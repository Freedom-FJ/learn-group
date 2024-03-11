import React, { useState, useEffect, useRef } from "react";
const [count, setCount] = useState<number>(0)
const [duration, setTotalDuration] = useState<number>(0)
const requestRef = useRef(null);
const previousTimeRef = useRef(null);
const currentCountRef = useRef<number>(0);

const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (deltaTime > 1000) {
        if (currentCountRef.current > 0) {
          previousTimeRef.current = time;
          setCount(prevCount => {
            currentCountRef.current = prevCount - 1000
            return prevCount - 1000
          });
        } else {
          setCount(0)
          cancelAnimationFrame(requestRef.current);
          return
        }
      }
    } else {
      previousTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    const totalDuration = 60 * 1000
    setCount(totalDuration)
    setTotalDuration(totalDuration)
  }, [])

  useEffect(() => {
    if (duration <= 0) {
      return
    }
    currentCountRef.current = duration
    previousTimeRef.current = undefined
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current)
  }, [duration])
