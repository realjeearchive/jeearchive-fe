"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { motion } from "framer-motion"
import Image from "next/image"
import ExamInterfaceImage from '@/assets/image/test-player.png';
import { 
  TrendingUp, 
  BookOpen,
  Search, 
  Atom, 
  Calculator, 
  Beaker, 
  Clock, 
  CheckCircle2,
  ListFilter,
  AlertTriangle, 
  Layers, 
  ArrowRightLeft,
  Target,
  Zap,
  BarChart3,
  ChevronRight,
  Star,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  Filter,
  BookMarked,
  TrendingDown,
} from "lucide-react"

// --- Slide Data ---
const onboardingSlides = [
  {
    id: 1,
    heading: "Organize your prep with structured PYQ archives",
    colorVar: "#F94F39", // Red/Orange
  },
  {
    id: 2,
    heading: "Deep performance analytics across all subjects",
    colorVar: "#1E7CD3", // Blue
  },
  {
    id: 3,
    heading: "Experience the real NTA exam interface",
    colorVar: "#6B66DA", // Purple
  }
]

export function OnboardingCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 8000, stopOnInteraction: false })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-[71%] max-lg:w-full h-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="h-full ">
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
  )
}

// --- The "App Window" Container ---
function InnerAppCard({ slideId }: { slideId: number }) {
  const containerClass = "relative w-full max-w-[380px] flex-1 min-h-0 flex items-center justify-center scale-[0.75] sm:scale-[0.85] lg:scale-100 origin-center";
  if (slideId === 1) {
    return (
<div className={containerClass}>        
        <motion.div
           initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
           whileInView={{ 
             rotate: -6, 
             x: -35, 
             y: -10, 
             opacity: 1 
            }}
           transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15 }}
           className="absolute w-full h-full bg-orange-50 rounded-3xl shadow-xl border border-orange-100 flex flex-col overflow-hidden z-0 scale-[0.95] origin-bottom-right"
        >
           <div className="p-5 border-b border-orange-100/50 flex items-center gap-3 bg-orange-50">
              <BookOpen size={18} className="text-orange-400" />
              <span className="font-bold text-slate-600 text-sm">Chapter Wise</span>
           </div>
           <div className="p-5 space-y-3 opacity-50">
              <div className="h-2 w-1/3 bg-slate-300 rounded" />
              <div className="h-8 bg-white rounded-md w-full shadow-sm" />
              <div className="h-8 bg-white rounded-md w-full shadow-sm" />
           </div>
        </motion.div>

        <motion.div
           initial={{ y: 100, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           transition={{ type: "spring", stiffness: 80, damping: 20 }}
           className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 border border-slate-100"
        >
           <CardOnePYQ />
        </motion.div>
      </div>
    )
  }

if (slideId === 2) {
  return (
    <div className="relative w-full max-w-[380px] h-[450px] flex items-center justify-center scale-[0.75] sm:scale-[0.85] lg:scale-100 origin-top lg:origin-center">
      
      <motion.div
         initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
         whileInView={{ 
           rotate: 6, 
           x: 35, 
           y: -10,
           opacity: 1 
          }}
         transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15 }}
         className="absolute w-full h-full bg-blue-50 rounded-3xl shadow-xl border border-blue-100 flex flex-col overflow-hidden z-0 scale-[0.95] origin-bottom-left"
      >
          <CardTwoBackHeatmap />
      </motion.div>

      <motion.div
         initial={{ y: 100, opacity: 0 }}
         whileInView={{ y: 0, opacity: 1 }}
         transition={{ type: "spring", stiffness: 80, damping: 20 }}
         className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 border border-slate-100"
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

// ─── CARD 1: PYQ Topic Explorer (Light Mode, feature-driven) ───────────────
function CardOnePYQ() {
  const topics = [
    {
      id: 1,
      subject: "Physics",
      topic: "Current Electricity",
      questions: 238,
      yearRange: "2018–2026",
      solved: 2,
      icon: Atom,
      accentColor: "#F94F39",
      bgColor: "#FFF4F2",
      badgeColor: "#FFEDE9",
      badgeText: "#F94F39",
    },
    {
      id: 2,
      subject: "Maths",
      topic: "Vector 3D",
      questions: 176,
      yearRange: "2019–2026",
      solved: 31,
      icon: Calculator,
      accentColor: "#1E7CD3",
      bgColor: "#EFF6FF",
      badgeColor: "#DBEAFE",
      badgeText: "#1E4EA1",
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Electrochemistry",
      questions: 193,
      yearRange: "2018–2026",
      solved: 58,
      icon: Beaker,
      accentColor: "#7C3AED",
      bgColor: "#F5F3FF",
      badgeColor: "#EDE9FE",
      badgeText: "#5B21B6",
    },
  ];

  return (
    <div className="flex flex-col h-full font-sans bg-[#FAFAFA] relative overflow-hidden">

      {/* Header */}
      <div className="px-5 pt-5 pb-3 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
              <BookMarked size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-[13px] leading-none">JEE Archive</p>
              <p className="text-[10px] text-slate-400 mt-0.5">13,407 questions · 2018–2026</p>
            </div>
          </div>
          {/* Live badge */}
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75 rounded-full" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-emerald-500 rounded-full" />
            </span>
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Updated</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={14} className="text-slate-400" />
          </div>
          <div className="w-full bg-slate-50 text-sm text-slate-500 rounded-xl py-2.5 pl-9 pr-4 border border-slate-200 text-[12px] font-medium flex items-center gap-1">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-600"
            >
              Weightage: High Yield
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[1.5px] h-3.5 bg-orange-500 align-middle ml-0.5"
            />
          </div>
        </div>
      </div>

      {/* Topic Cards */}
      <div className="flex-1 px-4 pt-3 pb-4 space-y-2.5 overflow-hidden">
        {topics.map((item, i) => {
          const solvedPercent = Math.round((item.solved / item.questions) * 100);
          return (
            <motion.div
              key={item.id}
              initial={{ y: 18, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.13, type: "spring", stiffness: 100, damping: 22 }}
              whileHover={{ scale: 1.015, y: -1 }}
              className="group bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-250 cursor-default"
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
                  style={{ background: item.bgColor }}
                >
                  <item.icon size={19} style={{ color: item.accentColor }} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-[13px] truncate">{item.topic}</span>
                    <span
                      className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border"
                      style={{ background: item.badgeColor, color: item.badgeText, borderColor: item.badgeColor }}
                    >
                      {item.subject}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${solvedPercent}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: item.accentColor }}
                      />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: item.accentColor }}>{solvedPercent}%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-500" />
                      <span className="text-[10px] font-medium text-slate-500">{item.solved}/{item.questions} solved</span>
                    </div>
                    <div className="h-2.5 w-px bg-slate-200" />
                    <div className="flex items-center gap-1">
                      <Clock size={11} className="text-slate-400" />
                      <span className="text-[10px] text-slate-400">{item.yearRange}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
              </div>
            </motion.div>
          );
        })}

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex items-center justify-between px-1 pt-1"
        >
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-orange-300 animate-bounce" style={{ animationDelay: "0.15s" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-orange-200 animate-bounce" style={{ animationDelay: "0.3s" }} />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">JEE Main · JEE Advanced</span>
        </motion.div>
      </div>
    </div>
  );
}

// ─── CARD 2 BACK: Subject Heatmap (Light Mode) ─────────────────────────────
function CardTwoBackHeatmap() {
  // 0 = strong, 1 = medium, 2 = weak
  const grid = [
    0, 0, 1, 0, 2, 0,
    0, 1, 2, 2, 0, 1,
    0, 0, 0, 1, 2, 0,
    1, 1, 0, 0, 0, 0,
    2, 0, 1, 0, 0, 1
  ];

  return (
    <div className="flex flex-col h-full w-full bg-blue-50">
      <div className="p-5 border-b border-blue-100 flex items-center gap-3">
        <Layers size={18} className="text-blue-500" />
        <span className="font-bold text-slate-700 text-sm">Chapter Heatmap</span>
      </div>
      <div className="p-5 flex-1">
        <p className="text-[10px] text-slate-500 font-bold mb-4 uppercase tracking-wider">Weakness Detection</p>
        <div className="grid grid-cols-6 gap-2">
          {grid.map((status, i) => {
            let color = "bg-emerald-200";
            if (status === 1) color = "bg-amber-200";
            if (status === 2) color = "bg-rose-300";
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.02 }}
                className={`aspect-square rounded-md ${color}`}
              />
            );
          })}
        </div>
        <div className="mt-4 flex gap-3 text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-300 inline-block" />Strong</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-200 inline-block" />Review</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-rose-300 inline-block" />Weak</span>
        </div>
      </div>
    </div>
  );
}

// ─── CARD 2 FRONT: Performance Analytics (Light Mode, real data) ────────────
function CardTwoFrontDNA() {
  // Mirrors the real analytics screen data
  const metrics = [
    { label: "Tests Taken", value: "4", sub: "+2 this month", icon: Activity, color: "#F94F39", bg: "#FFF4F2" },
    { label: "Avg Score", value: "125", sub: "out of 300", icon: Target, color: "#1E7CD3", bg: "#EFF6FF" },
    { label: "Accuracy", value: "72.7%", sub: "Above average", icon: CheckCircle2, color: "#059669", bg: "#F0FDF4" },
    { label: "Consistency", value: "8.5", sub: "Score stability", icon: Zap, color: "#7C3AED", bg: "#F5F3FF" },
  ];

  // Sparkline for performance trend: T1=190, T2=5, T3=225, T4=70
  const trendPoints = [
    { x: 28, y: 24, label: "T1", score: 190 },
    { x: 100, y: 152, label: "T2", score: 5 },
    { x: 175, y: 12, label: "T3", score: 225 },
    { x: 248, y: 118, label: "T4", score: 70 },
  ];

  // Build SVG path
  const svgPath = trendPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className="flex flex-col h-full font-sans bg-white relative overflow-hidden">

      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-[14px] leading-none">Performance</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Last 5 Tests · Overall</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <BarChart3 size={12} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600">Analytics</span>
          </div>
        </div>
      </div>

      {/* 2×2 Metric Grid */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-3 pb-2">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1, type: "spring", stiffness: 120, damping: 20 }}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl p-3 border border-slate-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-default"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="h-6 w-6 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                <m.icon size={13} style={{ color: m.color }} />
              </div>
              {/* Mini circular progress stand-in */}
              <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-40">
                <circle cx="10" cy="10" r="7" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                <circle
                  cx="10" cy="10" r="7"
                  fill="none"
                  stroke={m.color}
                  strokeWidth="2.5"
                  strokeDasharray={`${44 * (i === 0 ? 0.4 : i === 1 ? 0.42 : i === 2 ? 0.73 : 0.85)} 44`}
                  strokeLinecap="round"
                  transform="rotate(-90 10 10)"
                />
              </svg>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none">{m.label}</p>
            <motion.p
              className="text-[18px] font-bold leading-tight mt-0.5"
              style={{ color: m.color }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            >
              {m.value}
            </motion.p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Trend Chart */}
      <div className="flex-1 px-4 pb-4">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Performance Trend</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingDown size={10} className="text-rose-500" />
                <span className="text-[10px] text-rose-500 font-medium">121 pts decline</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-[9px] text-slate-400 font-medium">Score</span>
            </div>
          </div>

          {/* SVG Trend Line */}
          <div className="flex-1 relative">
            <svg
              viewBox="0 0 280 170"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Y-axis labels */}
              {[0, 50, 100, 150, 200].map((val) => {
                const yPos = 155 - (val / 225) * 140;
                return (
                  <g key={val}>
                    <line x1="22" y1={yPos} x2="255" y2={yPos} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3" />
                    <text x="18" y={yPos + 3.5} fontSize="8" fill="#94a3b8" textAnchor="end">{val}</text>
                  </g>
                );
              })}

              {/* Area fill */}
              <motion.path
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                d={`${svgPath} L 248 160 L 28 160 Z`}
                fill="url(#trendGrad)"
                opacity="0.3"
              />
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F94F39" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F94F39" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Trend line */}
              <motion.path
                d={svgPath}
                fill="none"
                stroke="#F94F39"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              />

              {/* Data points + labels */}
              {trendPoints.map((p, i) => (
                <g key={p.label}>
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="white"
                    stroke="#F94F39"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9 + i * 0.12, type: "spring" }}
                  />
                  <text x={p.x} y={165} fontSize="8.5" fill="#94a3b8" textAnchor="middle" fontWeight="600">{p.label}</text>
                  {/* Score label above/below point */}
                  <motion.text
                    x={p.x}
                    y={i === 1 ? p.y + 14 : p.y - 8}
                    fontSize="8"
                    fill="#F94F39"
                    textAnchor="middle"
                    fontWeight="700"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.1 + i * 0.12 }}
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
  );
}

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
          <video
            src="/videos/interfaceRec.mov"
            poster={ExamInterfaceImage.src} 
            autoPlay
            loop
            muted
            playsInline 
            className="w-full h-full object-cover"
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
            <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75 rounded-full"></span>
            <span className="relative inline-flex h-2.5 w-2.5 bg-green-500 rounded-full"></span>
          </div>
          <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest whitespace-nowrap">
            Live Preview
          </span>
        </motion.div>

      </div>
    </div>
  )
}