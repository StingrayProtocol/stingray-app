"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { push } = useRouter();
  useEffect(() => {
    push("/pools");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}
