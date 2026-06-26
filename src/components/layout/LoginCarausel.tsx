"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { LazyMotion, domAnimation, m as motion } from "framer-motion"
import Image from "next/image"
import ExamInterfaceImage from '@/assets/image/test-player.png';
import {
  TrendingDown,
  Search,
  Atom,
  CheckCircle2,
  Layers,
  Target,
  Zap,
  BarChart3,
  Activity,
  Filter,
  Play,
} from "lucide-react"

// --- Slide Data ---
const onboardingSlides = [
  {
    id: 1,
    heading: "Organize your prep with structured PYQ archives",
    colorVar: "#F94F39",
  },
  {
    id: 2,
    heading: "Deep performance analytics across all subjects",
    colorVar: "#1E7CD3",
  },
  {
    id: 3,
    heading: "Experience the real NTA exam interface",
    colorVar: "#6B66DA",
  },
]

export function OnboardingCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )

  return (
    <LazyMotion features={domAnimation}>
      <Carousel
        plugins={[plugin.current]}
        className="w-[71%] max-lg:w-full h-full"
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="h-full">
        {onboardingSlides.map((slide) => (
          <CarouselItem key={slide.id} className="basis-full h-full">
            <div className="py-2 px-0 md:px-4 h-[100dvh] lg:h-screen">
              <Card
                className="border-0 h-full relative overflow-hidden"
                style={{ background: slide.colorVar }}
              >
                <CardContent className="h-full flex flex-col items-center justify-start p-4 lg:p-4 text-white gap-16 lg:gap-5">

                  {/* Top Text */}
                  <div className="flex justify-center items-center max-w-lg z-10 pt-8 lg:pt-12 px-4 lg:px-0">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-none tracking-tight text-center drop-shadow-sm"
                    >
                      {slide.heading}
                    </motion.h2>
                  </div>

                  {/* Bottom App Card Area */}
                  <div className="flex-1 w-full flex items-center justify-center perspective-1000 relative">
                    <InnerAppCard slideId={slide.id} />
                  </div>

                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    </LazyMotion>
  )
}

// ─── App Window Container ──────────────────────────────────────────────────
function InnerAppCard({ slideId }: { slideId: number }) {
  // Both cards share the same fixed height so they're perfectly uniform
  const CARD_H = "h-[480px]"

  if (slideId === 1) {
    return (
      <div className={`relative w-full max-w-[360px] ${CARD_H} flex items-center justify-center scale-[0.75] sm:scale-[0.85] lg:scale-100 origin-top lg:origin-center`}>
        {/* Back ghost card */}
        <motion.div
          initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
          whileInView={{ rotate: -5, x: -28, y: -8, opacity: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 60, damping: 15 }}
          className="absolute inset-0 bg-orange-50 rounded-3xl shadow-lg border border-orange-100 overflow-hidden z-0"
        >
          <div className="p-4 border-b border-orange-100/60 flex items-center gap-2 bg-orange-50/80">
            <div className="h-5 w-5 rounded-md bg-orange-100 flex items-center justify-center">
              <Atom size={11} className="text-orange-500" />
            </div>
            <span className="font-bold text-slate-500 text-xs">Chapter Wise</span>
          </div>
          <div className="p-4 space-y-2.5 opacity-40">
            <div className="h-1.5 w-1/3 bg-slate-300 rounded" />
            <div className="h-7 bg-white rounded-lg w-full" />
            <div className="h-7 bg-white rounded-lg w-full" />
            <div className="h-7 bg-white rounded-lg w-4/5" />
          </div>
        </motion.div>

        {/* Front main card */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 75, damping: 18 }}
          className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100/80"
        >
          <CardOnePYQ />
        </motion.div>
      </div>
    )
  }

  if (slideId === 2) {
    return (
      <div className={`relative w-full max-w-[360px] ${CARD_H} flex items-center justify-center scale-[0.75] sm:scale-[0.85] lg:scale-100 origin-top lg:origin-center`}>
        {/* Back ghost card */}
        <motion.div
          initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
          whileInView={{ rotate: 5, x: 28, y: -8, opacity: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 60, damping: 15 }}
          className="absolute inset-0 bg-blue-50 rounded-3xl shadow-lg border border-blue-100 overflow-hidden z-0"
        >
          <CardTwoBackHeatmap />
        </motion.div>

        {/* Front main card */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 75, damping: 18 }}
          className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100/80"
        >
          <CardTwoFrontDNA />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <CardThreeExamImage />
    </div>
  )
}

// ─── CARD 1: PYQ Topic Detail ─────────────────────────────────────────────
function CardOnePYQ() {
  const totalQ = 238
  const solved = 163
  const mainsTotal = 191
  const advTotal = 47
  const advSolved = 2

  const r = 32
  const circ = 2 * Math.PI * r
  const solvedDash = (solved / totalQ) * circ

  const questions = [
    { id: 1, text: "An electric power line having t...", year: "2026", type: "Single Choice" },
    { id: 2, text: "The following diagram shows a Z...", year: "2026", type: "Single Choice" },
    { id: 3, text: "The current passing through a c...", year: "2025", type: "Single Choice" },
  ]

  return (
    <div className="flex flex-col h-full font-sans bg-[#F8F9FB] overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3.5 bg-white border-b border-slate-100/80 shrink-0">
        {/* Topic row */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 18 }}
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0 shadow-sm"
          >
            <Atom size={20} className="text-orange-500" strokeWidth={1.8} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="font-bold text-slate-900 text-[15px] leading-tight"
            >
              Current Electricity
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-[10.5px] text-slate-400 font-medium mt-0.5"
            >
              JEE Archive · {totalQ} Questions
            </motion.p>
          </div>
        </div>

        {/* Pills */}
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, type: "spring" }}
            className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-200"
          >
            <CheckCircle2 size={9} strokeWidth={3} /> JEE Main
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, type: "spring" }}
            className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border-2 border-orange-400 text-orange-500 bg-orange-50"
          >
            <CheckCircle2 size={9} strokeWidth={3} /> JEE Advanced
          </motion.span>
        </div>

        {/* Practice CTA — orange gradient, no black */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.4 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 text-[12.5px] font-bold shadow-md shadow-orange-200/60 cursor-pointer select-none"
          style={{ background: "linear-gradient(135deg, #FF6B4A 0%, #F94F39 60%, #E8381E 100%)" }}
        >
          <Play size={11} className="text-white fill-white" />
          <span className="text-white tracking-wide">Practice Main</span>
        </motion.div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-2.5 pb-2 shrink-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="relative group"
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={12} className="text-slate-400 group-hover:text-orange-400 transition-colors duration-200" />
          </div>
          <div className="w-full bg-white rounded-xl py-2 pl-8 pr-3 border border-slate-200/80 text-[11px] text-slate-400 font-medium shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-orange-200 hover:shadow-[0_2px_8px_rgba(249,79,57,0.08)] transition-all duration-200">
            Search questions...
          </div>
        </motion.div>
      </div>

      {/* ── Progress ── */}
      <div className="px-4 pb-2.5 shrink-0">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Progress</p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, type: "spring", stiffness: 100 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-3 flex items-center gap-3"
        >
          {/* Circular ring */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width="72" height="72" viewBox="0 0 80 80" className="-rotate-90">
              <circle cx="40" cy="40" r={r} fill="none" stroke="#F1F5F9" strokeWidth="4" />
              <motion.circle
                cx="40" cy="40" r={r}
                fill="none"
                stroke="#1E7CD3"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circ}` }}
                whileInView={{ strokeDasharray: `${solvedDash} ${circ}` }}
                transition={{ duration: 1.4, delay: 0.7, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center ">
              <motion.span
                className="text-[14px] font-bold text-blue-600 leading-none"
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                {solved}
              </motion.span>
              <span className="text-[8.5px] text-slate-400 font-medium leading-none mt-0.5">/{totalQ}</span>
              <span className="text-[7.5px] text-emerald-500 font-bold mt-1 leading-none">✓ Solved</span>
            </div>
          </div>

          {/* Mains / Advanced breakdown */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.72 }}
              className="bg-blue-50/80 rounded-xl px-2.5 py-2 border border-blue-100/60"
            >
              <p className="text-[9.5px] font-bold text-blue-500 mb-0.5">Mains</p>
              <p className="text-[13px] font-bold text-slate-700 leading-none">0/{mainsTotal}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-orange-50/80 rounded-xl px-2.5 py-2 border border-orange-100/60"
            >
              <p className="text-[9.5px] font-bold text-orange-500 mb-0.5">Advanced</p>
              <p className="text-[13px] font-bold text-slate-700 leading-none">{advSolved}/{advTotal}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Question List ── */}
      <div className="flex-1 px-4 pb-3 overflow-hidden flex flex-col">
        {/* Toggle tabs */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.62 }}
            className="h-6 w-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            <Filter size={11} className="text-slate-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <span
              className="px-3 py-1.5 text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #FF6B4A, #F94F39)" }}
            >
              JEE Main
            </span>
            <span className="px-3 py-1.5 text-[10px] font-bold text-slate-400">JEE Advanced</span>
          </motion.div>
        </div>

        {/* Rows */}
        <div className="space-y-1.5 flex-1">
          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ x: -14, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.72 + i * 0.11, type: "spring", stiffness: 130, damping: 22 }}
              whileHover={{ x: 3, backgroundColor: "#FFF8F7" }}
              className="flex items-center justify-between gap-2 bg-white rounded-xl px-3 py-2 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] cursor-default transition-colors duration-150"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 text-[9.5px] font-bold text-slate-300">{q.id}.</span>
                <span className="text-[10.5px] text-slate-700 font-medium truncate">{q.text}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{q.year}</span>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/80">{q.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CARD 2 BACK: Heatmap ─────────────────────────────────────────────────
function CardTwoBackHeatmap() {
  const grid = [
    0, 0, 1, 0, 2, 0,
    0, 1, 2, 2, 0, 1,
    0, 0, 0, 1, 2, 0,
    1, 1, 0, 0, 0, 0,
    2, 0, 1, 0, 0, 1,
  ]

  return (
    <div className="flex flex-col h-full w-full bg-blue-50">
      <div className="p-4 border-b border-blue-100/70 flex items-center gap-2">
        <Layers size={15} className="text-blue-500" />
        <span className="font-bold text-slate-600 text-xs">Chapter Heatmap</span>
      </div>
      <div className="p-4 flex-1">
        <p className="text-[9px] text-slate-400 font-bold mb-3 uppercase tracking-wider">Weakness Detection</p>
        <div className="grid grid-cols-6 gap-1.5">
          {grid.map((status, i) => {
            let color = "bg-emerald-200"
            if (status === 1) color = "bg-amber-200"
            if (status === 2) color = "bg-rose-300"
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.018, type: "spring", stiffness: 200 }}
                className={`aspect-square rounded-md ${color}`}
              />
            )
          })}
        </div>
        <div className="mt-4 flex gap-3">
          {[["bg-emerald-300", "Strong"], ["bg-amber-200", "Review"], ["bg-rose-300", "Weak"]].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold">
              <span className={`h-2 w-2 rounded-sm ${c} inline-block`} />{l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── CARD 2 FRONT: Performance Analytics ─────────────────────────────────
function CardTwoFrontDNA() {
  const metrics = [
    { label: "Tests Taken", value: "4",     sub: "+2 this month",   icon: Activity,     color: "#F94F39", bg: "#FFF4F2", arc: 0.40 },
    { label: "Avg Score",   value: "125",   sub: "out of 300",      icon: Target,       color: "#1E7CD3", bg: "#EFF6FF", arc: 0.42 },
    { label: "Accuracy",    value: "72.7%", sub: "Above average",   icon: CheckCircle2, color: "#059669", bg: "#F0FDF4", arc: 0.73 },
    { label: "Consistency", value: "8.5",   sub: "Score stability", icon: Zap,          color: "#7C3AED", bg: "#F5F3FF", arc: 0.85 },
  ]

  const trendPoints = [
    { x: 30,  y: 22,  label: "T1", score: 190 },
    { x: 102, y: 148, label: "T2", score: 5   },
    { x: 176, y: 10,  label: "T3", score: 225 },
    { x: 250, y: 116, label: "T4", score: 70  },
  ]
  const svgPath = trendPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")

  return (
    <div className="flex flex-col h-full font-sans bg-white overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100/80 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-bold text-slate-800 text-[14px] leading-none"
            >
              Performance
            </motion.h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Last 5 Tests · Overall</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-2.5 py-1.5"
          >
            <BarChart3 size={11} className="text-blue-500" />
            <span className="text-[9.5px] font-bold text-blue-600">Analytics</span>
          </motion.div>
        </div>
      </div>

      {/* ── 2×2 Metric Grid ── */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-3 pb-2 shrink-0">
        {metrics.map((m, i) => {
          const C = 2 * Math.PI * 7
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.09, type: "spring", stiffness: 130, damping: 20 }}
              whileHover={{ scale: 1.04, y: -1 }}
              className="rounded-2xl p-2.5 border border-slate-100 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.09)] transition-all duration-200 cursor-default"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="h-5 w-5 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                  <m.icon size={11} style={{ color: m.color }} />
                </div>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="7" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
                  <motion.circle
                    cx="9" cy="9" r="7"
                    fill="none"
                    stroke={m.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 ${C}` }}
                    whileInView={{ strokeDasharray: `${C * m.arc} ${C}` }}
                    transition={{ duration: 1.1, delay: 0.55 + i * 0.09, ease: "easeOut" }}
                    transform="rotate(-90 9 9)"
                  />
                </svg>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-none">{m.label}</p>
              <motion.p
                className="text-[17px] font-bold leading-tight mt-0.5"
                style={{ color: m.color }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.09, duration: 0.35 }}
              >
                {m.value}
              </motion.p>
              <p className="text-[9px] text-slate-400 leading-none mt-0.5">{m.sub}</p>
            </motion.div>
          )
        })}
      </div>

      {/* ── Trend Chart ── */}
      <div className="flex-1 px-4 pb-3.5 overflow-hidden">
        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 h-full flex flex-col">
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Performance Trend</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingDown size={9} className="text-rose-500" />
                <span className="text-[9.5px] text-rose-500 font-semibold">121 pts decline</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-4 rounded-full bg-gradient-to-r from-orange-400 to-rose-500" />
              <span className="text-[9px] text-slate-400 font-medium">Score</span>
            </div>
          </div>

          <div className="flex-1 relative min-h-0">
            <svg viewBox="0 0 284 158" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 50, 100, 150, 200].map((val) => {
                const yPos = 145 - (val / 225) * 130
                return (
                  <g key={val}>
                    <line x1="24" y1={yPos} x2="260" y2={yPos} stroke="#e2e8f0" strokeWidth="0.7" strokeDasharray="3,3" />
                    <text x="20" y={yPos + 3} fontSize="7.5" fill="#cbd5e1" textAnchor="end">{val}</text>
                  </g>
                )
              })}

              {/* Area */}
              <defs>
                <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E7CD3" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1E7CD3" stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                d={`${svgPath} L 250 150 L 30 150 Z`}
                fill="url(#areaGrad2)"
              />

              {/* Line */}
              <motion.path
                d={svgPath}
                fill="none"
                stroke="url(#lineGrad2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.3, delay: 0.55, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1E7CD3" />
                  <stop offset="100%" stopColor="#F94F39" />
                </linearGradient>
              </defs>

              {/* Dots + labels */}
              {trendPoints.map((p, i) => (
                <g key={p.label}>
                  <motion.circle
                    cx={p.x} cy={p.y} r="4"
                    fill="white"
                    stroke={i < 2 ? "#1E7CD3" : i === 2 ? "#059669" : "#F94F39"}
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.95 + i * 0.11, type: "spring", stiffness: 260, damping: 20 }}
                  />
                  <text x={p.x} y={154} fontSize="8" fill="#94a3b8" textAnchor="middle" fontWeight="600">{p.label}</text>
                  <motion.text
                    x={p.x}
                    y={i === 1 ? p.y + 13 : p.y - 7}
                    fontSize="7.5"
                    fill={i === 1 ? "#F94F39" : "#1E7CD3"}
                    textAnchor="middle"
                    fontWeight="700"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.1 + i * 0.11 }}
                  >
                    {p.score}
                  </motion.text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CARD 3: Exam Interface ────────────────────────────────────────────────
function CardThreeExamImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[90%] sm:w-[80%] max-w-[760px] aspect-[16/10]">

        <motion.div
          initial={{ y: 70, rotate: 0, opacity: 0 }}
          whileInView={{ y: 20, rotate: -8, opacity: 0.25 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="
            absolute inset-0 z-0 overflow-hidden shadow-lg
            scale-[0.85] -translate-x-4 translate-y-6
            lg:scale-[0.68] lg:translate-x-[-170px] lg:translate-y-[-100px]
          "
        >
          <Image
            src={ExamInterfaceImage}
            alt="Exam UI Back"
            className="w-full h-full object-cover grayscale opacity-70"
          />
        </motion.div>

        <motion.div
          initial={{ y: 60, rotate: 0, opacity: 0 }}
          whileInView={{ y: 10, rotate: 8, opacity: 0.45 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
          className="
             absolute inset-0 z-10 overflow-hidden shadow-xl
             scale-[0.92] translate-x-4 translate-y-2
             lg:scale-[0.84] lg:translate-x-[120px] lg:translate-y-0
          "
        >
          <Image
            src={ExamInterfaceImage}
            alt="Exam UI Middle"
            className="w-full h-full object-cover grayscale opacity-50"
          />
        </motion.div>

        <motion.div
          initial={{ y: 50, scale: 0.92, opacity: 0 }}
          whileInView={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="relative z-20 w-full h-full overflow-hidden shadow-2xl border border-white/40 bg-slate-900"
        >
          <Image
            src="/images/nta-interface.webp"
            alt="NTA Interface Live Preview"
            fill
            className="w-full h-full object-cover"
            priority={true}
            sizes="(max-width: 768px) 100vw, 760px"
          />
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-xl" />
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur px-5 py-2 shadow-xl flex items-center gap-3 rounded-full border border-white/50"
        >
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75 rounded-full" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-green-500 rounded-full" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest whitespace-nowrap">
            Live Preview
          </span>
        </motion.div>

      </div>
    </div>
  )
}