import React from 'react'

const BlueCircle = ({ top = "auto", left = "auto", right = "auto", bottom = "auto" }) => {
  return (
    <div 
      className="absolute -z-10 h-[230px] w-[230px] aspect-square rounded-full bg-blue-500/30 blur-3xl"
      style={{ top, left, right, bottom }}
    />
  )
}

export default BlueCircle
