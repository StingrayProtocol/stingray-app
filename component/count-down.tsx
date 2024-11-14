import { getFuturePeriod } from "@/common";
import React, { useEffect, useState } from "react";

const CountDown = ({ timestamp }: { timestamp?: number }) => {
  const [, setRender] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRender((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return <>{getFuturePeriod(timestamp ?? 0)}</>;
};

export default CountDown;
