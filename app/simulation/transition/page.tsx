"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TransitionPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/simulation/intro");
  }, [router]);

  return null;
}
