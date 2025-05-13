"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  endDate: string
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className="bg-purple-100 rounded-lg p-2">
        <div className="text-2xl font-bold text-purple-600">{timeLeft.days}</div>
        <div className="text-xs text-purple-500">Days</div>
      </div>
      <div className="bg-purple-100 rounded-lg p-2">
        <div className="text-2xl font-bold text-purple-600">{timeLeft.hours}</div>
        <div className="text-xs text-purple-500">Hours</div>
      </div>
      <div className="bg-purple-100 rounded-lg p-2">
        <div className="text-2xl font-bold text-purple-600">{timeLeft.minutes}</div>
        <div className="text-xs text-purple-500">Mins</div>
      </div>
      <div className="bg-purple-100 rounded-lg p-2">
        <div className="text-2xl font-bold text-purple-600">{timeLeft.seconds}</div>
        <div className="text-xs text-purple-500">Secs</div>
      </div>
    </div>
  )
}
