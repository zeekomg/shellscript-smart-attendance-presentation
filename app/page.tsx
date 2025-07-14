"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Maximize, Menu, X } from "lucide-react"

const slides = [
  { id: "title", title: "آلية ذكية لتوثيق الحضور والانصراف", file: "/title_slide.html" },
  { id: "introduction", title: "المقدمة", file: "/introduction.html" },
  { id: "methodology", title: "منهجية التطوير", file: "/methodology.html" },
  { id: "system_overview", title: "نظرة عامة على النظام", file: "/system_overview.html" },
  { id: "project_chapters", title: "فصول المشروع", file: "/project_chapters.html" },
  { id: "abstract", title: "المستخلص", file: "/abstract.html" },
  { id: "future_work", title: "التطويرات المستقبلية", file: "/future_work.html" },
  { id: "conclusion", title: "الخاتمة", file: "/conclusion.html" },
]

export default function ResponsivePresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNavigation, setShowNavigation] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isIdle, setIsIdle] = useState(false)

  // Auto-hide navigation after inactivity
  useEffect(() => {
    let idleTimer: NodeJS.Timeout

    const resetIdleTimer = () => {
      setIsIdle(false)
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setIsIdle(true), 3000)
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]
    events.forEach((event) => {
      document.addEventListener(event, resetIdleTimer, true)
    })

    resetIdleTimer()

    return () => {
      clearTimeout(idleTimer)
      events.forEach((event) => {
        document.removeEventListener(event, resetIdleTimer, true)
      })
    }
  }, [])

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoplay) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 10000)
    }
    return () => clearInterval(interval)
  }, [isAutoplay])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          nextSlide()
          break
        case "ArrowLeft":
          prevSlide()
          break
        case "Home":
          setCurrentSlide(0)
          break
        case "End":
          setCurrentSlide(slides.length - 1)
          break
        case "Escape":
          if (isAutoplay) setIsAutoplay(false)
          break
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const resetPresentation = () => {
    setCurrentSlide(0)
    setIsAutoplay(false)
  }

  const progress = ((currentSlide + 1) / slides.length) * 100

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden"
      dir="rtl"
    >
      {/* Background particles effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] animate-pulse"></div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 md:hidden transition-opacity duration-300 ${
          isIdle ? "opacity-0" : "opacity-100"
        }`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden">
          <Card className="absolute top-16 right-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 p-4">
            <div className="grid grid-cols-2 gap-2">
              {slides.map((slide, index) => (
                <Button
                  key={slide.id}
                  variant={currentSlide === index ? "default" : "ghost"}
                  size="sm"
                  className={`text-xs ${
                    currentSlide === index ? "bg-green-500 text-white" : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => {
                    setCurrentSlide(index)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {slide.title}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Desktop Navigation */}
      <div
        className={`hidden md:flex fixed top-1/2 right-6 -translate-y-1/2 z-30 transition-opacity duration-300 ${
          isIdle ? "opacity-0" : "opacity-100"
        }`}
      >
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-4">
          <div className="flex flex-col gap-2">
            {slides.map((slide, index) => (
              <Button
                key={slide.id}
                variant={currentSlide === index ? "default" : "ghost"}
                size="sm"
                className={`text-sm whitespace-nowrap ${
                  currentSlide === index ? "bg-green-500 text-white" : "text-white hover:bg-white/20"
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                {slide.title}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Control Panel */}
      <div
        className={`fixed top-4 left-4 z-30 flex gap-2 transition-opacity duration-300 ${
          isIdle ? "opacity-0" : "opacity-100"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          onClick={toggleFullscreen}
          title="ملء الشاشة"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          onClick={toggleAutoplay}
          title={isAutoplay ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"}
        >
          {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          onClick={resetPresentation}
          title="إعادة تشغيل"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Counter */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-300 ${
          isIdle ? "opacity-0" : "opacity-100"
        }`}
      >
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </Card>
      </div>

      {/* Main Slide Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-7xl">
          {/* Slide Frame */}
          <Card className="relative w-full aspect-video bg-white border-2 border-white/30 shadow-2xl overflow-hidden">
            <iframe
              src={slides[currentSlide].file}
              className="w-full h-full border-none"
              title={slides[currentSlide].title}
            />

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </Card>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Slide Title */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-300 ${
          isIdle ? "opacity-0" : "opacity-100"
        }`}
      >
        <Card className="bg-black/30 backdrop-blur-md border border-white/20 px-6 py-3">
          <h2 className="text-white text-lg font-bold text-center">{slides[currentSlide].title}</h2>
        </Card>
      </div>

      {/* Touch/Swipe Areas for Mobile */}
      <div className="md:hidden">
        <div className="absolute left-0 top-0 w-1/3 h-full z-20" onClick={prevSlide} />
        <div className="absolute right-0 top-0 w-1/3 h-full z-20" onClick={nextSlide} />
      </div>
    </div>
  )
}
