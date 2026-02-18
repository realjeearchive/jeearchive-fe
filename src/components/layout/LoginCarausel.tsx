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
import { TrendingUp, BookOpen } from "lucide-react"
import Image from "next/image"
import ExamInterfaceImage from '@/assets/image/test-player.png';
import { 
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
  

  if (slideId === 1) {
    return (
      <div className="relative w-full max-w-[380px] h-[450px] flex items-center justify-center">
        

        <motion.div
           initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
           whileInView={{ 
             rotate: -6, 
             x: -35, 
             y: -10, 
             opacity: 1 
            }}
           transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15 }}
           className="absolute w-full h-full bg-[#FFF0EB] rounded-3xl shadow-xl border border-orange-100 flex flex-col overflow-hidden z-0 scale-[0.95] origin-bottom-right"
        >

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
    <div className="relative w-full max-w-[380px] h-[450px] flex items-center justify-center">
      

      <motion.div
         initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
         whileInView={{ 
           rotate: 6, 
           x: 35, 
           y: -10,
           opacity: 1 
          }}
         transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15 }}
         className="absolute w-full h-full bg-indigo-50 rounded-3xl shadow-xl border border-indigo-100 flex flex-col overflow-hidden z-0 scale-[0.95] origin-bottom-left"
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


      <div className="flex-1 px-6 pt-2 pb-6 space-y-3 relative overflow-hidden">

        <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-white to-transparent z-10 pointer-events-none" />

        {topics.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}

            transition={{ delay: 0.4 + (i * 0.15), type: "spring", stiffness: 100, damping: 20 }}
            className={`group relative bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 cursor-default ${item.border}`}
          >
            <div className="flex items-start gap-4">

                <div className={`h-11 w-11 shrink-0 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-sm`}>
                    <item.icon size={22} strokeWidth={2} />
                </div>


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
                        <div className="h-3 w-px bg-slate-200" />
                        <div className="flex items-center gap-1 text-slate-400">
                             <Clock size={12} />
                             <span className="text-[11px] font-medium">{item.yearRange}</span>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        ))}


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


function CardTwoBackHeatmap() {

    const grid = [
        0, 0, 1, 0, 2, 0,
        0, 1, 2, 2, 0, 1,
        0, 0, 0, 1, 2, 0,
        1, 1, 0, 0, 0, 0,
        2, 0, 1, 0, 0, 1
    ];

    return (
        <div className="flex flex-col h-full w-full">
            <div className="p-5 border-b border-indigo-100/50 flex items-center gap-3 bg-indigo-100/30">
                <Layers size={18} className="text-indigo-500" />
                <span className="font-bold text-slate-600 text-sm">Chapter Heatmap</span>
            </div>
            
            <div className="p-5 flex-1">
                <p className="text-xs text-slate-400 font-bold mb-4 uppercase tracking-wider">Weakness Detection</p>
                <div className="grid grid-cols-6 gap-2">
                    {grid.map((status, i) => {
                        let color = "bg-emerald-200/50"; 
                        if (status === 1) color = "bg-amber-200/50"; 
                        if (status === 2) color = "bg-rose-300"; 

                        return (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: 0.6 + (i * 0.02) }}
                                className={`aspect-square rounded-md ${color}`}
                            />
                        )
                    })}
                </div>
                
                {/* Simulated Analysis Text */}
                <div className="mt-6 flex items-start gap-2 opacity-60">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <div className="space-y-1 w-full">
                         <div className="h-1.5 bg-slate-300 rounded w-3/4" />
                         <div className="h-1.5 bg-slate-300 rounded w-1/2" />
                    </div>
                </div>
            </div>
        </div>
    )
}


function CardTwoFrontDNA() {

    const subjects = [
        { name: "Phy", timePercent: 30, marksPercent: 45, status: "High ROI", color: "text-emerald-500" },
        { name: "Chem", timePercent: 20, marksPercent: 40, status: "Best", color: "text-emerald-500" },
        { name: "Math", timePercent: 50, marksPercent: 15, status: "Inefficient", color: "text-rose-500" },
    ];

    return (
        <div className="flex flex-col h-full font-sans bg-white relative">
            
            {/* Header */}
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-1">
                     <h3 className="font-bold text-slate-800 text-lg">Time Strategy</h3>
                     <span className="text-[10px] font-bold bg-indigo-50 px-2 py-1 rounded text-indigo-600 border border-indigo-100 flex items-center gap-1">
                        <ArrowRightLeft size={10} /> ROI Analysis
                     </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Are you spending time wisely?</p>
            </div>

            <div className="flex-1 px-6 space-y-6 pt-2">
                

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Time Invested</span>
                        <span>Marks Output</span>
                    </div>

                    {subjects.map((sub, i) => (
                        <div key={sub.name} className="relative grid grid-cols-[1fr_40px_1fr] items-center gap-2">
                            

                            <div className="flex justify-end items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400">{sub.timePercent}%</span>
                                <div className="h-1.5 w-full bg-slate-50 rounded-l-full flex justify-end overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        whileInView={{ width: `${sub.timePercent}%` }} 
                                        transition={{ duration: 0.8, delay: 0.2 + (i*0.1) }}
                                        className={`h-full rounded-full ${sub.timePercent > 40 ? 'bg-rose-300' : 'bg-slate-300'}`} 
                                    />
                                </div>
                            </div>


                            <div className="text-center">
                                <span className="text-xs font-bold text-slate-700 block">{sub.name}</span>
                                <span className={`text-[8px] font-bold block leading-none ${sub.color}`}>{sub.status}</span>
                            </div>


                            <div className="flex justify-start items-center gap-2">
                                <div className="h-1.5 w-full bg-slate-50 rounded-r-full flex justify-start overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        whileInView={{ width: `${sub.marksPercent}%` }} 
                                        transition={{ duration: 0.8, delay: 0.2 + (i*0.1) }}
                                        className="h-full bg-indigo-500 rounded-full" 
                                    />
                                </div>
                                <span className="text-[9px] font-bold text-indigo-600">{sub.marksPercent}%</span>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-white text-rose-500 rounded-lg flex items-center justify-center shadow-sm border border-rose-100">
                            <AlertTriangle size={16} />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-rose-400 uppercase tracking-wide">Score Leakage</span>
                            <span className="block text-xs font-bold text-rose-900">-12 Marks Negative</span>
                        </div>
                    </div>

                    <div className="relative flex h-2 w-2 mr-2">
                       <span className="animate-ping absolute inline-flex h-full w-full bg-rose-400 opacity-75 rounded-full"></span>
                       <span className="relative inline-flex h-2 w-2 bg-rose-500 rounded-full"></span>
                    </div>
                </div>


                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <Clock size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Speed</span>
                            <span className="text-xs font-bold text-slate-700">1m 42s / Question</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <TrendingUp size={12} /> Faster
                        </span>
                        <span className="text-[9px] text-slate-400">than peer avg</span>
                    </div>
                </div>

            </div>
        </div>
    )
}


function CardThreeExamImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">

      <div className="relative w-[90%] max-w-[760px] aspect-16/10">


        <motion.div
          initial={{ y: 70, rotate: 0, opacity: 0 }}
          whileInView={{ y: 20, rotate: -8, opacity: 0.25 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="
            absolute inset-0 z-0 overflow-hidden shadow-lg
            scale-[0.72] translate-x-[-120px] translate-y-20
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
          className="absolute inset-0 z-10 overflow-hidden shadow-xl scale-[0.84] lg:translate-x-[120px] translate-x-20"
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
