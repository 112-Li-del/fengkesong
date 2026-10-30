"use client";

import { useState } from "react";
import { HistoryChat } from "@/components/history/history-chat";
import { Landing } from "@/components/home/landing";

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {/* 地图/伴游区始终挂载：在落地页背后后台预加载高德地图与景点数据，
          点击“进入栖霞山”后烧屏特效一结束即可直接看到已就绪的地图。 */}
      <HistoryChat />
      {!entered && <Landing onLeaveDone={() => setEntered(true)} />}
    </>
  );
}
