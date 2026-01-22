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
import { 
  Search, 
  Atom, 
  Calculator, 
  Beaker, 
  Zap, 
  Clock, 
  CheckCircle2,
  ListFilter
} from "lucide-react"

import { 
  AlertTriangle, 
  XCircle,
  BarChart2
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

// --- CARD 1: SMART ARCHIVE DASHBOARD (CLEAN & SMOOTH) ---
function CardOnePYQ() {
  const topics = [
    {
      id: 1,
      subject: "Physics",
      topic: "Rotational Motion",
      questions: 142,
      yearRange: "2019-2024",
      icon: Atom,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "group-hover:border-rose-200"
    },
    {
      id: 2,
      subject: "Maths",
      topic: "Vector 3D",
      questions: 98,
      yearRange: "2020-2024",
      icon: Calculator,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "group-hover:border-blue-200"
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Electrochemistry",
      questions: 115,
      yearRange: "2018-2024",
      icon: Beaker,
      color: "text-violet-500",
      bg: "bg-violet-50",
      border: "group-hover:border-violet-200"
    },
  ];

  return (
    <div className="flex flex-col h-full font-sans bg-white relative overflow-hidden">
      
      {/* --- Header: Clean Search Simulation --- */}
      <div className="p-6 pb-2 z-10 bg-white">
        <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <ListFilter size={14} />
                </div>
                <span className="font-bold text-slate-800 text-sm">Topic Explorer</span>
             </div>
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75 rounded-full"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Live</span>
             </div>
        </div>

        {/* Search Bar Visual */}
        <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="w-full bg-slate-50 text-sm text-slate-800 rounded-xl py-3 pl-10 pr-4 border border-slate-100 shadow-sm font-medium">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Weightage: High Yield...
                </motion.span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[1.5px] h-4 bg-orange-500 align-middle ml-0.5"
                />
            </div>
        </div>
      </div>

      {/* --- Body: Smooth List --- */}
      <div className="flex-1 px-6 pt-2 pb-6 space-y-3 relative overflow-hidden">
        {/* Subtle Fade for scroll (aesthetic only) */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

        {topics.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            // Smoother Spring Animation
            transition={{ delay: 0.4 + (i * 0.15), type: "spring", stiffness: 100, damping: 20 }}
            className={`group relative bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 cursor-default ${item.border}`}
          >
            <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className={`h-11 w-11 shrink-0 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-sm`}>
                    <item.icon size={22} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-[15px] truncate pr-2">{item.topic}</h4>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            {item.subject}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-slate-500">
                             <CheckCircle2 size={12} className="text-emerald-500" />
                             <span className="text-xs font-medium">{item.questions} Qs</span>
                        </div>
                        <div className="h-3 w-[1px] bg-slate-200" />
                        <div className="flex items-center gap-1 text-slate-400">
                             <Clock size={12} />
                             <span className="text-[11px] font-medium">{item.yearRange}</span>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        ))}

        {/* --- Footer Visual: "More Loading" --- */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="pt-2 flex justify-center items-center gap-2"
        >
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: "0.15s" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: "0.3s" }} />
        </motion.div>

      </div>
    </div>
  )
}

// --- CARD 2: PRECISE SVG ANALYTICS ---
function CardTwoAnalytics() {
  const subjectPerformance = [
    { subject: 'P', score: 72, total: 100, color: 'bg-blue-500', text: 'text-blue-600' },
    { subject: 'C', score: 84, total: 100, color: 'bg-emerald-500', text: 'text-emerald-600' },
    { subject: 'M', score: 45, total: 100, color: 'bg-rose-500', text: 'text-rose-600' },
  ];

  // Gauge Calculations
  // Score: 201/300
  // Radius: 85
  // Semi-Circle Circumference (Pi * R) approx 267
  // Fill Percentage: 0.67
  // Stroke Dash Offset = 267 * (1 - 0.67) = 88
  const circleRadius = 85;
  const circumference = Math.PI * circleRadius;
  const fillPercentage = 201 / 300; 
  const strokeDashoffset = circumference * (1 - fillPercentage);

  return (
    <div className="flex flex-col h-full font-sans bg-white relative overflow-hidden">
      
      {/* --- Header --- */}
      <div className="px-6 pt-6 pb-2 z-10 flex justify-between items-center">
         <div>
            <h3 className="font-bold text-slate-800 text-lg">Full Mock Test #04</h3>
            <p className="text-xs text-slate-400 font-medium">Attempted on 24 Jan</p>
         </div>
         <div className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase">
            Analysis
         </div>
      </div>

      {/* --- Hero: SVG Precise Gauge --- */}
      <div className="flex flex-col items-center justify-center pt-4 pb-4 relative z-10">
         <div className="relative w-64 h-32 flex items-end justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 100">
               {/* 1. Background Track (Gray) */}
               <path 
                 d="M 20 100 A 80 80 0 0 1 180 100" 
                 fill="none" 
                 stroke="#f1f5f9" // slate-100
                 strokeWidth="12" 
                 strokeLinecap="round"
               />
               
               {/* 2. Foreground Data (Blue Gradient) */}
               <defs>
                 <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
                   <stop offset="100%" stopColor="#6366f1" /> {/* indigo-500 */}
                 </linearGradient>
               </defs>
               
               <motion.path 
                 d="M 20 100 A 80 80 0 0 1 180 100" 
                 fill="none" 
                 stroke="url(#gaugeGradient)" 
                 strokeWidth="12" 
                 strokeLinecap="round"
                 // The magic numbers for SVG animation
                 strokeDasharray={circumference} // Total length
                 initial={{ strokeDashoffset: circumference }} // Start Empty
                 whileInView={{ strokeDashoffset: strokeDashoffset }} // Animate to Score
                 transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
               />
            </svg>

            {/* Score Text */}
            <div className="absolute bottom-0 text-center mb-1">
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center"
                 >
                    <span className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                        201
                        <span className="text-lg text-slate-400 font-semibold ml-1">/300</span>
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-2 bg-indigo-50 px-2 py-0.5 rounded">
                        Good Score
                    </span>
                 </motion.div>
            </div>
         </div>
      </div>

      {/* --- Middle: Proper Breakdown Charts --- */}
      <div className="flex-1 px-6 flex gap-4">
         
         {/* Left: Bar Chart */}
         <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Subject Split</span>
                <BarChart2 size={12} className="text-slate-400" />
            </div>
            
            <div className="flex items-end justify-between flex-1 gap-2 px-1">
                {subjectPerformance.map((sub, i) => (
                    <div key={sub.subject} className="flex flex-col items-center w-full h-full justify-end group">
                        
                        {/* Bar Container (Full Height Reference) */}
                        <div className="w-full h-full bg-slate-200/50 rounded-t-sm relative overflow-hidden flex items-end">
                            {/* Filled Bar */}
                            <motion.div 
                               initial={{ height: 0 }}
                               whileInView={{ height: `${sub.score}%` }}
                               transition={{ duration: 0.8, delay: 0.6 + (i * 0.1) }}
                               className={`w-full ${sub.color} relative`}
                            >
                                {/* Tooltip on Hover */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {sub.score}/100
                                </div>
                            </motion.div>
                        </div>

                        <span className={`text-[10px] font-bold mt-1.5 ${sub.text}`}>{sub.subject}</span>
                    </div>
                ))}
            </div>
         </div>

         {/* Right: Key Stats */}
         <div className="w-[40%] flex flex-col gap-3">
             {/* Accuracy */}
             <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-2xl p-3 flex flex-col justify-center items-center gap-1">
                <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                    <CheckCircle2 size={16} />
                </div>
                <span className="text-xl font-bold text-slate-800 leading-none">84%</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Accuracy</span>
             </div>

             {/* Negative Marks */}
             <div className="flex-1 bg-rose-50 border border-rose-100 rounded-2xl p-3 flex flex-col justify-center items-center gap-1 relative overflow-hidden">
                <div className="absolute -right-3 -top-3 text-rose-100/50 z-0">
                    <AlertTriangle size={48} />
                </div>
                <div className="text-rose-500 mb-0.5 z-10">
                    <XCircle size={16} />
                </div>
                <span className="text-xl font-bold text-rose-600 relative z-10 leading-none">-12</span>
                <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wide z-10">Lost Marks</span>
             </div>
         </div>
      </div>

      {/* --- Footer --- */}
      <div className="p-4 pt-1">
         <div className="bg-slate-900 rounded-xl px-4 py-3 flex items-center justify-between text-white shadow-lg shadow-slate-200">
             <div className="flex items-center gap-3">
                 <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                    <Clock size={14} className="text-orange-400" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg Time/Q</span>
                    <span className="text-sm font-bold">1m 42s</span>
                 </div>
             </div>
             {/* Mini Sparkline Visualization */}
             <div className="flex gap-0.5 items-end h-4 opacity-50">
                <div className="w-1 bg-white h-[60%]" />
                <div className="w-1 bg-white h-[40%]" />
                <div className="w-1 bg-white h-[80%]" />
                <div className="w-1 bg-orange-400 h-[100%]" />
             </div>
         </div>
      </div>

    </div>
  )
}

// --- CARD 3 CONTENT: EXAM IMAGE (UPDATED WITH VIDEO) ---
function CardThreeExamImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">

      <div className="relative w-[90%] max-w-[760px] aspect-[16/10]">

        {/* Back Layer (Keep as Image for Performance) */}
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
            alt="Exam UI Back"
            className="w-full h-full object-cover grayscale opacity-70"
          />
        </motion.div>

        {/* Middle Layer (Keep as Image for Performance) */}
        <motion.div
          initial={{ y: 60, rotate: 0, opacity: 0 }}
          whileInView={{ y: 10, rotate: 8, opacity: 0.45 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.05 }}
          className="absolute inset-0 z-10 overflow-hidden shadow-xl scale-[0.84] lg:translate-x-[120px] translate-x-[80px]"
        >
          <Image
            src={ExamInterfaceImage}
            alt="Exam UI Middle"
            className="w-full h-full object-cover grayscale opacity-50"
          />
        </motion.div>

        {/* Front Main Layer (VIDEO) */}
        <motion.div
          initial={{ y: 50, scale: 0.92, opacity: 0 }}
          whileInView={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="relative z-20 w-full h-full overflow-hidden shadow-2xl border border-white/40 bg-slate-900"
        >
          {/* PRO TIP: If your .mov file is not H.264 encoded, it might not play on all browsers. 
             Ideally convert to .mp4 for 100% compatibility.
          */}
          <video
            src="/videos/interfaceRec.mov"
            poster={ExamInterfaceImage.src} // Shows image while video loads
            autoPlay
            loop
            muted
            playsInline // Essential for iOS to prevent fullscreen
            className="w-full h-full object-cover"
          />
          
          {/* Subtle inner shadow to blend video edges */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-xl" />
        </motion.div>

        {/* Trust Badge */}
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
