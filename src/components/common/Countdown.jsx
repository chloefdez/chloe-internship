import React, { useEffect, useState } from "react";

export default function Countdown({ end, className = "de_countdown" }) {
  const getLeft = () => {
    const endMs = typeof end === "number" ? end : Date.parse(end || 0);
    const ms = Math.max(0, endMs - Date.now());
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const [left, setLeft] = useState(getLeft());

  useEffect(() => {
    const id = setInterval(() => setLeft(getLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return <div className={className}>{left}</div>;
}