import React from "react";
import '../App.css';



export const handleEnterKeyPress = (event, onEnter, onShiftEnter) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      onEnter && onEnter();
    } else if (event.key === 'Enter' && event.shiftKey) {
      onShiftEnter && onShiftEnter();
    }
  };