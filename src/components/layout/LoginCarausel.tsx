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
import { ChevronRight, FileText, TrendingUp, Trophy, BookOpen } from "lucide-react"
import Image from "next/image"
import ExamInterfaceImage from '@/assets/image/test-player.png';
import ExamInterfaceAccessibilityImage from '@/assets/image/test-player-laptop-accessibility.png';

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
    Autoplay({ delay: 6000, stopOnInteraction: false })
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
          <CarouselItem key={slide.id} className="basis-[100%] h-full">
            <div className="p-4 h-screen">
              <Card 
                className="border-0 h-full relative overflow-hidden"
                style={{ background: slide.colorVar }}
              >
                {/* --- YOUR EXACT REQUESTED LAYOUT BLOCK --- */}
                <CardContent className="h-full flex flex-col items-center justify-start p-8 lg:p-8 text-white gap-16">
                  
                  {/* Top Text */}
                  <div className="flex justify-center items-center max-w-lg z-10 pt-12">
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-3xl lg:text-4xl font-bold leading-none tracking-tight text-center drop-shadow-sm"
                    >
                      {slide.heading}
                    </motion.h2>
                  </div>

                  {/* Bottom App Card Area */}
                  <div className="flex-1 w-full flex items-center justify-center perspective-1000 relative">
                     <InnerAppCard slideId={slide.id} />
                  </div>

                </CardContent>
                {/* ----------------------------------------- */}
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
  
  // SLIDE 1: STACKED CARD ANIMATION
  // The back card waits for the front card, then slides out.
  if (slideId === 1) {
    return (
      <div className="relative w-full max-w-[380px] h-[450px] flex items-center justify-center">
        
        {/* The Back Card (Hidden initially, then slides out) */}
        <motion.div
           initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
           whileInView={{ 
             rotate: -6, 
             x: -35, 
             y: -10, // Slight push up
             opacity: 1 
            }}
           transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15 }}
           className="absolute w-full h-full bg-[#FFF0EB] rounded-[24px] shadow-xl border border-orange-100 flex flex-col overflow-hidden z-0 scale-[0.95] origin-bottom-right"
        >
           {/* Decorative content for back card */}
           <div className="p-5 border-b border-orange-100/50 flex items-center gap-3 bg-orange-50/50">
              <BookOpen size={18} className="text-orange-400" />
              <span className="font-bold text-slate-600 text-sm">Chapter Wise</span>
           </div>
           <div className="p-5 space-y-3 opacity-50">
              <div className="h-2 w-1/3 bg-slate-300 rounded" />
              <div className="h-8 bg-white rounded-md w-full shadow-sm" />
              <div className="h-8 bg-white rounded-md w-full shadow-sm" />
           </div>
        </motion.div>

        {/* The Front Card (Main PYQ List) */}
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           transition={{ type: "spring", stiffness: 80, damping: 20 }}
           className="relative z-10 w-full h-full bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col text-slate-900 border border-slate-100"
        >
           <CardOnePYQ />
        </motion.div>
      </div>
    )
  }
if (slideId === 2) {
  return (
    <motion.div 
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="bg-white rounded-[24px] shadow-2xl w-full max-w-[380px] h-[450px] overflow-hidden flex flex-col text-slate-900 border border-slate-100 relative"
    >
        <CardTwoAnalytics />
    </motion.div>
  )
}

  return (
      <div className="relative w-full h-full flex items-center justify-center">
        <CardThreeExamImage />
      </div>
    )
}

// --- CARD 1 CONTENT: PYQ LIST ---
function CardOnePYQ() {
  const years = [2025, 2024, 2023, 2022, 2021];

  return (
    <div className="flex flex-col h-full font-sans bg-slate-50">
        <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 z-10 shadow-sm">
            <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <FileText size={20} />
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-800">JEE MAINS</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Select Year</p>
            </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden relative space-y-2">
            {years.map((year, i) => (
                <motion.div
                    key={year}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white shadow-sm border border-slate-100 hover:border-orange-200 cursor-pointer group"
                >
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-800 text-lg">{year}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide">
                            20 Tests
                        </span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                </motion.div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        </div>
    </div>
  )
}

// --- CARD 2 CONTENT: ANALYTICS ---
function CardTwoAnalytics() {
  const data = [
    { label: "Single", value: 82, color: "bg-blue-500" },
    { label: "Multi", value: 68, color: "bg-indigo-500" },
    { label: "Int", value: 74, color: "bg-violet-500" },
    { label: "Num", value: 59, color: "bg-purple-500" },
  ]

  return (
    <div className="p-6 h-full flex flex-col bg-white">
      <div className="mb-6 flex items-start justify-between">
        <div>
            <h3 className="text-xl font-bold text-slate-900">Performance</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Accuracy by Type</p>
        </div>
        <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
            className="px-3 py-1 bg-green-50 text-green-600 rounded-lg flex gap-2 items-center text-xs font-bold"
        >
            <TrendingUp size={14} />
            +12%
        </motion.div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-3 pb-4 border-b border-slate-100">
        {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-1 shadow-lg"
                >
                    {item.value}%
                </motion.div>
                
                <div className="w-full h-[180px] bg-slate-50 rounded-t-lg relative flex items-end overflow-hidden group">
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${item.value}%` }}
                        transition={{ duration: 1, ease: "circOut", delay: 0.2 + (i * 0.1) }}
                        className={`w-full ${item.color} rounded-t-md opacity-90 mx-auto group-hover:opacity-100 transition-opacity`}
                        style={{ width: '70%' }}
                    />
                </div>
            </div>
        ))}
      </div>

      <div className="pt-5 flex items-center gap-4">
        <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
            <Trophy size={20} />
        </div>
        <div>
             <p className="text-sm font-bold text-slate-900">Physics Mastery</p>
             <p className="text-xs text-slate-500">Top 5% among peers</p>
        </div>
      </div>
    </div>
  )
}

// --- CARD 3 CONTENT: EXAM IMAGE ---
function CardThreeExamImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">

      <div className="relative w-[90%] max-w-[760px] aspect-[16/10]">

        {/* Back Layer */}
        <motion.div
          initial={{ y: 70, rotate: 0, opacity: 0 }}
          whileInView={{ y: 20, rotate: -8, opacity: 0.25 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="
    absolute inset-0 z-0 overflow-hidden shadow-lg
    scale-[0.72] translate-x-[-120px] translate-y-[-80px]
    lg:scale-[0.68] lg:translate-x-[-170px] lg:translate-y-[-100px]
  "
        >
          <Image
            src={ExamInterfaceImage}
            alt="Exam UI"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Middle Layer */}
        <motion.div
          initial={{ y: 60, rotate: 0, opacity: 0 }}
          whileInView={{ y: 10, rotate: 8, opacity: 0.45 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
          className="absolute inset-0 z-10 overflow-hidden shadow-xl scale-[0.84] lg:translate-x-[120px] translate-x-[80px]"
        >
          <Image
            src={ExamInterfaceImage}
            alt="Exam UI"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Front Main Layer */}
        <motion.div
          initial={{ y: 50, scale: 0.92, opacity: 0 }}
          whileInView={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="relative z-20 overflow-hidden shadow-2xl border border-white/40"
        >
          <Image
            src={ExamInterfaceImage}
            alt="Real NTA Exam Interface"
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur px-5 py-2 shadow-xl flex items-center gap-3"
        >
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">
            Exact NTA Pattern
          </span>
        </motion.div>

      </div>
    </div>
  )
}
