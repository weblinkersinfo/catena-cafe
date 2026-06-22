import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Coffee, 
  MapPin, 
  Star, 
  Clock, 
  Compass, 
  Eye, 
  Heart, 
  Mail, 
  ArrowUpRight, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles,
  Calendar
} from 'lucide-react'

// Premium Images loaded from user's assets
const images = [
  {
    url: '/images/img1.jpg',
    title: 'Cozy Courtyard Seating',
    desc: 'Our iconic green chairs under string lighting, with a flower-adorned bicycle.'
  },
  {
    url: '/images/img2.jpg',
    title: 'Café Storefront & Dining',
    desc: 'The clean service window, glowing signboard, and delicious wood-fired garden pizza.'
  },
  {
    url: '/images/img3.jpg',
    title: 'Canopy Lounge',
    desc: 'Elegant deep velvet armchairs surrounded by lush hanging garden vines.'
  },
  {
    url: '/images/img4.jpg',
    title: 'Warm Dusk Ambience',
    desc: 'Hanging circular signboard at sunset, capturing the true mood of Nagalapark.'
  }
]

// Fallback Menu Items in case backend is loading/unreachable
const fallbackMenuItems = [
  {
    name: "Brass Filter Coffee",
    price: "₹70",
    desc: "Traditional brass filter decoction blended with foaming, thick hot milk.",
    tag: "Traditional"
  },
  {
    name: "Anglo-Indian Espresso",
    price: "₹90",
    desc: "Espresso extraction using pure filter decoction. High pressure, deep body.",
    tag: "House Special"
  },
  {
    name: "Decoction Iced Latte",
    price: "₹110",
    desc: "Concentrated decoction over texturized chilled milk & premium brown sugar syrup.",
    tag: "Chilled"
  },
  {
    name: "Cardamom Cold Foam",
    price: "₹130",
    desc: "12-hour cold-brewed chicory coffee topped with velvety cardamom-spiced cream foam.",
    tag: "Cold Brew"
  },
  {
    name: "Wood-Fired Garden Pizza",
    price: "₹180",
    desc: "Fresh sourdough crust topped with homegrown basil, cherry tomatoes, and local mozzarella.",
    tag: "Bites"
  }
]

const fallbackReviews = [
  {
    text: "Ambience and vibe is best. The outdoor seating is absolutely cozy.",
    author: "Shreya Patil",
    role: "Google Local Guide",
    rating: 5
  },
  {
    text: "Cozy aesthetic place for coffee lovers. Anglo-Indian espresso style decoction is exceptionally unique!",
    author: "Rahul Deshmukh",
    role: "Coffee Connoisseur",
    rating: 4.5
  },
  {
    text: "Great night vibe and peaceful seating. Ideal for romantic evening coffee dates in Nagalapark.",
    author: "Ananya Kulkarni",
    role: "Instagram Creator",
    rating: 5
  }
]

function App() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [reserveModal, setReserveModal] = useState(false)
  
  // Interactive Coffee Customizer State
  const [brewStyle, setBrewStyle] = useState('anglo') // traditional, anglo, latte
  const [milkRatio, setMilkRatio] = useState(50) // percentage
  const [sweetness, setSweetness] = useState('Medium') // Low, Medium, High
  const [brewing, setBrewing] = useState(false)
  const [brewComplete, setBrewComplete] = useState(false)
  
  // Dynamic Menu and Reviews State loaded from Backend
  const [menuItems, setMenuItems] = useState(fallbackMenuItems)
  const [reviews, setReviews] = useState(fallbackReviews)
  const [activeReview, setActiveReview] = useState(0)

  // Booking details form states
  const [resDate, setResDate] = useState("2026-05-22")
  const [resTime, setResTime] = useState("05:00 PM - 07:00 PM (Sunset Dusk)")
  const [resArea, setResArea] = useState("Patio Table (Near Flower Bicycle)")

  // Message note form states
  const [noteName, setNoteName] = useState("")
  const [notePhone, setNotePhone] = useState("")
  const [noteMsg, setNoteMsg] = useState("")

  // Define API server target
  const API_BASE_URL = "https://catena-cafe-api.onrender.com";

  // Fetch Menu and Reviews from Express backend on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const menuRes = await fetch(`${API_BASE_URL}/api/menu`)
        if (menuRes.ok) {
          const menuData = await menuRes.json()
          if (Array.isArray(menuData) && menuData.length > 0) {
            setMenuItems(menuData)
          }
        }
      } catch (err) {
        console.warn("Failed to fetch menu from backend, using fallback items:", err)
      }

      try {
        const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews`)
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          if (Array.isArray(reviewsData) && reviewsData.length > 0) {
            setReviews(reviewsData)
          }
        }
      } catch (err) {
        console.warn("Failed to fetch reviews from backend, using fallback reviews:", err)
      }
    }
    fetchBackendData()
  }, [])

  // Reservation request handler
  const handleReserve = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: resDate, timeSlot: resTime, seatingArea: resArea })
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
        setReserveModal(false)
      } else {
        alert("Reservation failed: " + (data.error || "Unknown error"))
      }
    } catch (err) {
      console.error(err)
      alert("Could not connect to the backend server. Reservation not saved.")
    }
  }

  // Message request handler
  const handleSendNote = async () => {
    if (!noteName.trim() || !notePhone.trim() || !noteMsg.trim()) {
      alert("Please fill out all fields first.")
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: noteName, phone: notePhone, message: noteMsg })
      })
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
        setNoteName("")
        setNotePhone("")
        setNoteMsg("")
      } else {
        alert("Failed to submit message: " + (data.error || "Unknown error"))
      }
    } catch (err) {
      console.error(err)
      alert("Could not connect to the backend server. Message not saved.")
    }
  }

  // Slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Brew simulation handler
  const handleStartBrew = () => {
    setBrewing(true)
    setBrewComplete(false)
    setTimeout(() => {
      setBrewing(false)
      setBrewComplete(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#F6F1EA] text-[#111111] overflow-hidden selection:bg-[#B7D8CF]">
      {/* Dynamic Warm Ambient Glow Spots mimicking the hanging garden lights */}
      <div className="light-spot top-1/4 left-[-150px] animate-pulse-slow"></div>
      <div className="light-spot top-3/4 right-[-150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="light-spot top-[120vh] left-1/3 opacity-75"></div>

      {/* Floating Glassmorphism Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${
        scrolled ? 'bg-[#F6F1EA]/85 backdrop-blur-md shadow-sm border-b border-[#B7D8CF]/30' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-[#B7D8CF] flex items-center justify-center border border-[#9ECBC0] group-hover:scale-105 transition-transform duration-300">
              <Coffee className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-[#111111]">CATENA</span>
              <span className="block text-[8px] tracking-[0.25em] text-[#6B4F3B] uppercase font-semibold">COFFEE CO.</span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wider uppercase">
            {['About', 'Signature', 'Mixer', 'Gallery', 'Reviews', 'Info'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="relative py-1 text-[#111111]/80 hover:text-[#111111] transition-colors group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#B7D8CF] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <button 
              onClick={() => setReserveModal(true)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#111111] text-[#F6F1EA] hover:bg-[#B7D8CF] hover:text-[#111111] transition-all duration-300 glow-warm-sm"
            >
              Reserve Seating
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <button 
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-full hover:bg-[#B7D8CF]/20 transition-colors"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F6F1EA]/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 text-xl font-serif tracking-widest text-[#111111]">
              {['About', 'Signature', 'Mixer', 'Gallery', 'Reviews', 'Info'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setMobileMenu(false)}
                  className="hover:text-[#6B4F3B] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            <button 
              onClick={() => { setMobileMenu(false); setReserveModal(true); }}
              className="mt-4 px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-widest bg-[#111111] text-[#F6F1EA] hover:bg-[#B7D8CF] hover:text-[#111111] transition-all duration-300 shadow-lg"
            >
              Reserve Seating
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Image Carousel with absolute cinematic overlays */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${images[heroIndex].url})` }}
            />
          </AnimatePresence>
          {/* Soft Matte Overlay blending screen edges and warm lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center text-[#F6F1EA]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#B7D8CF]/30 bg-[#111111]/40 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#FFDFA8]" />
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#B7D8CF]">Nagalapark, Kolhapur</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-8xl tracking-widest font-extrabold mb-4 uppercase drop-shadow-md text-stroke-thin"
          >
            CATENA COFFEE
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-serif text-xl md:text-3xl italic text-[#B7D8CF] mb-4 tracking-wide"
          >
            "Where Coffee Meets Calm"
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-md text-sm md:text-base text-[#F6F1EA]/80 mb-10 tracking-widest font-light uppercase"
          >
            Introducing Anglo-Indian coffee culture in Kolhapur
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <a 
              href="#mixer" 
              className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#B7D8CF] text-[#111111] hover:bg-[#F6F1EA] transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              Explore Experience <ChevronRight className="w-4 h-4" />
            </a>
            <a 
              href="#info" 
              className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#F6F1EA]/30 bg-transparent text-[#F6F1EA] hover:bg-[#F6F1EA]/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Visit Café <MapPin className="w-4 h-4 text-[#FFDFA8]" />
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#F6F1EA]/50 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-6 bg-[#F6F1EA]/30" />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Dynamic Entrance Image Display */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#B7D8CF]/25 rounded-2xl -rotate-2 scale-98 pointer-events-none"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-[#F6F1EA] aspect-[4/5] max-h-[500px]">
              <img 
                src="/images/img2.jpg" 
                alt="Catena Coffee Exterior storefront Nagalapark" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-xl shadow-lg border border-white/20">
                <span className="text-[10px] tracking-[0.3em] font-bold text-[#6B4F3B] uppercase">First Ever in Kolhapur</span>
                <h3 className="font-serif text-lg font-bold text-[#111111] mt-1">Anglo-Indian Coffee Infusion</h3>
              </div>
            </div>
          </motion.div>

          {/* About Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px] bg-[#6B4F3B]"></div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4F3B]">The Heritage</span>
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#111111] tracking-wide leading-tight">
              A Pioneering Coffee Culture
            </h2>

            <p className="text-base text-[#111111]/80 leading-relaxed font-light">
              Catena Coffee proudly brings the first authentic <strong>Anglo-Indian Coffee Culture</strong> to the heart of Kolhapur. We revolutionize how traditional filter coffee is viewed—reinterpreting classic decoction to craft drinks with the strength, pressure, and texturized crema of high-end continental espressos.
            </p>

            <div className="p-6 bg-[#B7D8CF]/15 rounded-xl border border-[#B7D8CF]/40 relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Coffee className="w-32 h-32 text-[#6B4F3B]" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#6B4F3B] mb-2">The Golden Ratio Decoction</h4>
              <p className="text-sm text-[#111111]/70 leading-relaxed font-light">
                We craft our drinks by selecting pure coffee beans, slow-extracting them in double brass filters, and forcing the thick, aromatic decoction like an espresso shot to emulsify milk perfectly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col">
                <span className="font-serif text-4xl font-black text-[#6B4F3B]">100%</span>
                <span className="text-xs uppercase tracking-wider text-[#111111]/60 mt-1">Brass filter brew</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-4xl font-black text-[#6B4F3B]">3.5 ★</span>
                <span className="text-xs uppercase tracking-wider text-[#111111]/60 mt-1">Cozy rating in Nagalapark</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SIGNATURE EXPERIENCE SECTION */}
      <section id="signature" className="py-24 bg-[#B7D8CF]/10 border-y border-[#B7D8CF]/20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4F3B] mb-3">Immersive Vibe</span>
            <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#111111] tracking-wide mb-4">
              Our Signature Vibe
            </h2>
            <p className="text-sm text-[#111111]/60 font-light">
              Experience the perfect synchronization of flavor, light, and nature designed to create a premium, calm escape.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Traditional filter */}
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#F6F1EA] p-8 rounded-2xl border border-[#B7D8CF]/30 shadow-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#B7D8CF]/20 rounded-bl-full transition-all duration-300 group-hover:scale-110 pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-[#B7D8CF]/30 flex items-center justify-center mb-6">
                <Coffee className="w-6 h-6 text-[#6B4F3B]" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Filter Coffee</h3>
              <p className="text-xs text-[#111111]/70 leading-relaxed font-light mb-4">
                Rich chicory-blend decoction, meticulously brewed inside specialized dual brass containers, served with creamy foaming milk.
              </p>
              <span className="text-xs font-semibold text-[#6B4F3B] flex items-center gap-1">Traditional Brass Drink <ChevronRight className="w-3.5 h-3.5" /></span>
            </motion.div>

            {/* Card 2: Seating Vibe */}
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#F6F1EA] p-8 rounded-2xl border border-[#B7D8CF]/30 shadow-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#B7D8CF]/20 rounded-bl-full transition-all duration-300 group-hover:scale-110 pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-[#B7D8CF]/30 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-[#6B4F3B]" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Outdoor Sanctuary</h3>
              <p className="text-xs text-[#111111]/70 leading-relaxed font-light mb-4">
                Lush, plant-draped open patio lined with pastel mint green seating, romantic flowers, and relaxing canopy swings.
              </p>
              <span className="text-xs font-semibold text-[#6B4F3B] flex items-center gap-1">Garden Ambience <ChevronRight className="w-3.5 h-3.5" /></span>
            </motion.div>

            {/* Card 3: Self Service */}
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#F6F1EA] p-8 rounded-2xl border border-[#B7D8CF]/30 shadow-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#B7D8CF]/20 rounded-bl-full transition-all duration-300 group-hover:scale-110 pointer-events-none"></div>
              <div className="w-12 h-12 rounded-xl bg-[#B7D8CF]/30 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-[#6B4F3B]" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Self-Service Lounge</h3>
              <p className="text-xs text-[#111111]/70 leading-relaxed font-light mb-4">
                A warm, slow-paced atmosphere designed for peaceful book reading, coding, or quiet dates with zero pressure.
              </p>
              <span className="text-xs font-semibold text-[#6B4F3B] flex items-center gap-1">Cozy Seating Concept <ChevronRight className="w-3.5 h-3.5" /></span>
            </motion.div>

          </div>

          {/* Quick Menu Selection */}
          <div className="mt-16 bg-[#F6F1EA] p-8 rounded-3xl border border-[#B7D8CF]/40 shadow-lg">
            <h3 className="font-serif text-2xl font-bold text-center mb-8">Selected House Curations</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {menuItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 pb-4 border-b border-[#B7D8CF]/25">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base md:text-lg text-[#111111]">{item.name}</span>
                      <span className="px-2 py-0.5 text-[9px] font-semibold bg-[#B7D8CF] text-[#111111] rounded-full uppercase tracking-wider">{item.tag}</span>
                    </div>
                    <span className="text-xs text-[#111111]/60 font-light max-w-sm">{item.desc}</span>
                  </div>
                  <span className="font-serif font-bold text-lg text-[#6B4F3B]">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC BREW MIXER SECTION (WOW FEATURE) */}
      <section id="mixer" className="py-24 px-6 max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Interactive Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px] bg-[#6B4F3B]"></div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4F3B]">Interactive Brewer</span>
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#111111]">
              Custom-Brew Your Cup
            </h2>
            
            <p className="text-sm text-[#111111]/70 font-light leading-relaxed">
              Experience the science behind Catena Coffee's Anglo-Indian fusion. Toggle our recipe builder below to simulate exactly how our brass filter extraction mixes with custom elements!
            </p>

            {/* Control Panel Card */}
            <div className="p-6 bg-white rounded-2xl border border-[#B7D8CF]/40 shadow-lg flex flex-col gap-6">
              
              {/* Step 1: Base Brew Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4F3B] mb-3">1. Select Brew Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'traditional', label: 'Filter Brew', color: '#6B4F3B' },
                    { id: 'anglo', label: 'Anglo Espresso', color: '#111111' },
                    { id: 'latte', label: 'Iced Latte', color: '#9ECBC0' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => { setBrewStyle(style.id); setBrewComplete(false); }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 ${
                        brewStyle === style.id 
                          ? 'bg-[#B7D8CF] border border-[#9ECBC0] text-[#111111] shadow-sm'
                          : 'bg-[#F6F1EA] border border-[#B7D8CF]/20 text-[#111111]/60 hover:bg-[#B7D8CF]/10'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Milk/Decoction Ratio */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#6B4F3B]">2. Decoction vs Creamy Milk</label>
                  <span className="text-xs font-mono font-bold text-[#6B4F3B]">{milkRatio}% Milk</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="80" 
                  value={milkRatio}
                  onChange={(e) => { setMilkRatio(parseInt(e.target.value)); setBrewComplete(false); }}
                  className="w-full accent-[#B7D8CF] bg-[#F6F1EA] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#111111]/40 mt-1 uppercase font-semibold">
                  <span>Strong Decoction</span>
                  <span>Creamy & Milky</span>
                </div>
              </div>

              {/* Step 3: Sweetness */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4F3B] mb-3">3. Sweetness Level</label>
                <div className="flex gap-4">
                  {['Minimal', 'Medium', 'Extra Sugar'].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111111]/80">
                      <input 
                        type="radio" 
                        name="sweetness" 
                        checked={sweetness === lvl}
                        onChange={() => { setSweetness(lvl); setBrewComplete(false); }}
                        className="accent-[#B7D8CF]"
                      />
                      {lvl}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brew CTA */}
              <button
                onClick={handleStartBrew}
                disabled={brewing}
                className="mt-2 py-3.5 w-full bg-[#111111] text-[#F6F1EA] hover:bg-[#B7D8CF] hover:text-[#111111] disabled:bg-gray-400 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                {brewing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Extracting Decoction...
                  </>
                ) : (
                  <>
                    <Coffee className="w-4 h-4" />
                    Extract Anglo-Indian Brew
                  </>
                )}
              </button>

            </div>
          </motion.div>

          {/* Interactive Coffee Visual Mixer Cup */}
          <div className="flex flex-col items-center justify-center bg-[#B7D8CF]/15 p-12 rounded-3xl border border-[#B7D8CF]/30 relative aspect-square">
            
            {/* Hanging ambient yellow lightbulb representing the cafe roof lights */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
              <div className="w-[2px] h-24 bg-gray-600"></div>
              <div className="w-8 h-8 rounded-full bg-[#FFDFA8] border-2 border-[#6B4F3B]/30 glow-warm flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-white rounded-full opacity-60"></div>
              </div>
            </div>

            {/* Coffee Mug Container */}
            <div className="relative w-48 h-64 border-8 border-white/60 rounded-b-[40px] rounded-t-[10px] overflow-hidden flex flex-col justify-end shadow-xl bg-white/10 backdrop-blur-sm mt-12">
              
              {/* Coffee Liquid layers inside mug */}
              <AnimatePresence>
                {brewing && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 3 }}
                    className="w-full flex flex-col justify-end"
                  >
                    {/* Layer 1: Crema Foam */}
                    <div className="w-full h-8 bg-[#EAE0D5] flex items-center justify-center">
                      <span className="text-[8px] uppercase tracking-wider text-black/50 font-bold">Crema Foam</span>
                    </div>
                    {/* Layer 2: Creamy Milk layer based on slider */}
                    <div 
                      className="w-full bg-[#D5C3C6] transition-all duration-300"
                      style={{ height: `${milkRatio * 1.5}px` }}
                    />
                    {/* Layer 3: Brass Filter Decoction dark layer */}
                    <div 
                      className="w-full bg-[#3D261C] flex-grow transition-all duration-300"
                      style={{ minHeight: '60px' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Brew Complete state */}
              {brewComplete && (
                <div className="absolute inset-0 flex flex-col justify-end w-full h-full">
                  {/* Froth layer */}
                  <div className="w-full h-8 bg-[#E4D5C6] border-b border-[#C3B29F]/20 flex items-center justify-center animate-pulse">
                    <span className="text-[7px] uppercase tracking-[0.2em] text-[#6B4F3B] font-bold">Thick Chicory Froth</span>
                  </div>
                  {/* Mixed Liquid */}
                  <div 
                    className="w-full flex-grow transition-all duration-500"
                    style={{ 
                      backgroundColor: brewStyle === 'traditional' ? '#5E412F' : brewStyle === 'latte' ? '#8F715B' : '#321D13' 
                    }}
                  />
                </div>
              )}

              {/* Initial empty cup state */}
              {!brewing && !brewComplete && (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs text-[#111111]/40 font-light">
                  Click 'Extract' to mix your custom brew
                </div>
              )}
            </div>

            {/* Cup Handle */}
            <div className="absolute right-[115px] bottom-[115px] w-12 h-24 border-8 border-white/60 rounded-r-3xl z-0 pointer-events-none"></div>

            {/* Visual mixing readouts */}
            {brewComplete && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 rounded-xl glass border border-white text-center shadow-md flex flex-col gap-1 z-10"
              >
                <span className="text-xs uppercase tracking-wider font-bold text-[#6B4F3B] flex items-center gap-1 justify-center">
                  <Coffee className="w-3.5 h-3.5 text-[#B7D8CF] fill-[#B7D8CF]" /> 
                  Brew Configured Successfully
                </span>
                <span className="text-[10px] text-[#111111]/70 font-light">
                  {brewStyle === 'traditional' ? 'Brass Decoction' : brewStyle === 'latte' ? 'Chilled Decoction Latte' : 'Anglo-Indian Crema Espresso'} • {milkRatio}% Creamy Milk • {sweetness} Sweetness
                </span>
              </motion.div>
            )}

          </div>

        </div>
      </section>

      {/* GALLERY SECTION (CINEMATIC MASONRY) */}
      <section id="gallery" className="py-24 bg-[#111111] text-[#F6F1EA] px-6 relative overflow-hidden">
        
        {/* Soft amber lights mimicking outdoor festival lamps */}
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-[#FFDFA8]/5 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-[#FFDFA8]/5 rounded-full filter blur-[100px]"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#B7D8CF] mb-3">Cinematic Framing</span>
            <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#F6F1EA] tracking-wide mb-4">
              Explore Our Courtyard
            </h2>
            <p className="text-sm text-[#F6F1EA]/60 font-light">
              Take a visual tour through Catena's calm evening atmosphere. Rounded corners, cinematic colors, and soothing space.
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                onClick={() => setLightbox(img.url)}
                className="relative overflow-hidden rounded-2xl shadow-lg border border-white/10 aspect-[3/4] cursor-pointer group"
              >
                {/* Image */}
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

                {/* Hover UI Info Card */}
                <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-1 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#B7D8CF] font-bold">Nagalapark Dusk</span>
                  <h4 className="font-serif font-semibold text-base text-[#F6F1EA]">{img.title}</h4>
                  <p className="text-[10px] text-[#F6F1EA]/70 font-light max-w-xs">{img.desc}</p>
                  
                  <span className="text-[10px] uppercase font-bold text-[#FFDFA8] mt-2 flex items-center gap-1">
                    Expand Screen <Eye className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-24 px-6 max-w-4xl mx-auto text-center relative">
        <div className="flex flex-col items-center gap-6">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-[1px] bg-[#6B4F3B]"></div>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4F3B]">Cafe Reviews</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#111111]">
            Aesthetic Love
          </h2>

          <div className="w-16 h-[2px] bg-[#B7D8CF] my-4"></div>

          {/* Testimonial slider body */}
          <div className="relative min-h-[180px] w-full flex items-center justify-center px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                {/* 5 glowing warm gold stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < reviews[activeReview].rating 
                          ? 'text-[#6B4F3B] fill-[#6B4F3B] glow-warm-sm' 
                          : 'text-[#6B4F3B]/30'
                      }`} 
                    />
                  ))}
                </div>

                <blockquote className="font-serif text-xl md:text-2xl italic text-[#111111] leading-relaxed max-w-2xl">
                  “{reviews[activeReview].text}”
                </blockquote>

                <div className="flex flex-col mt-4">
                  <cite className="not-italic font-bold text-sm text-[#111111]">{reviews[activeReview].author}</cite>
                  <span className="text-[10px] uppercase tracking-widest text-[#111111]/50 font-semibold">{reviews[activeReview].role}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setActiveReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
              className="p-3 rounded-full bg-[#B7D8CF]/20 border border-[#B7D8CF]/30 hover:bg-[#B7D8CF] text-[#111111] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))}
              className="p-3 rounded-full bg-[#B7D8CF]/20 border border-[#B7D8CF]/30 hover:bg-[#B7D8CF] text-[#111111] transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* QUICK INFO SECTION */}
      <section id="info" className="py-24 bg-[#B7D8CF]/10 border-t border-[#B7D8CF]/30 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Info Metrics Dashboard */}
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6B4F3B] mb-2 block">Quick Facts</span>
                <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#111111] tracking-wide">
                  Visit Nagalapark Cafe
                </h2>
              </div>

              {/* Elegant Icon Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Fact 1: Location */}
                <div className="p-5 bg-[#F6F1EA] rounded-xl border border-[#B7D8CF]/30 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#B7D8CF]/30 flex items-center justify-center text-[#6B4F3B]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#111111]/50">Location</span>
                    <span className="text-xs font-semibold text-[#111111]">Nagalapark, Kolhapur 416003</span>
                  </div>
                </div>

                {/* Fact 2: Rating */}
                <div className="p-5 bg-[#F6F1EA] rounded-xl border border-[#B7D8CF]/30 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#B7D8CF]/30 flex items-center justify-center text-[#6B4F3B]">
                    <Star className="w-5 h-5 fill-[#6B4F3B]" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#111111]/50">Rating</span>
                    <span className="text-xs font-semibold text-[#111111]">3.5 ★ (Cozy ambience)</span>
                  </div>
                </div>

                {/* Fact 3: Hours */}
                <div className="p-5 bg-[#F6F1EA] rounded-xl border border-[#B7D8CF]/30 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#B7D8CF]/30 flex items-center justify-center text-[#6B4F3B]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#111111]/50">Opening Hours</span>
                    <span className="text-xs font-semibold text-[#111111]">11:15 AM - 11:00 PM</span>
                  </div>
                </div>

                {/* Fact 4: Pricing */}
                <div className="p-5 bg-[#F6F1EA] rounded-xl border border-[#B7D8CF]/30 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-[#B7D8CF]/30 flex items-center justify-center text-[#6B4F3B]">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#111111]/50">Price Range</span>
                    <span className="text-xs font-semibold text-[#111111]">₹1 – ₹200 per drink/bite</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#111111] text-[#F6F1EA] hover:bg-[#B7D8CF] hover:text-[#111111] font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 shadow-md flex items-center gap-2"
                >
                  Get Directions <ArrowUpRight className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => setReserveModal(true)}
                  className="px-6 py-3 border border-[#111111]/30 bg-transparent text-[#111111] hover:bg-[#B7D8CF]/25 font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  Book Evening Patio <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Custom Aesthetic Form */}
            <div className="bg-[#F6F1EA] p-8 rounded-3xl border border-[#B7D8CF]/40 shadow-lg w-full flex flex-col gap-6">
              <h3 className="font-serif text-2xl font-bold">Write Us a Warm Note</h3>
              <p className="text-xs text-[#111111]/60 font-light mt-[-10px]">
                Planning an event in our Nagalapark garden or want details on our house blends? Drop a line below.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#111111]/50 mb-1.5">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={noteName}
                      onChange={(e) => setNoteName(e.target.value)}
                      className="w-full bg-white border border-[#B7D8CF]/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B7D8CF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#111111]/50 mb-1.5">Phone</label>
                    <input 
                      type="text" 
                      placeholder="Contact No" 
                      value={notePhone}
                      onChange={(e) => setNotePhone(e.target.value)}
                      className="w-full bg-white border border-[#B7D8CF]/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B7D8CF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#111111]/50 mb-1.5">Message</label>
                  <textarea 
                    rows="3" 
                    placeholder="Hello, coffee team..." 
                    value={noteMsg}
                    onChange={(e) => setNoteMsg(e.target.value)}
                    className="w-full bg-white border border-[#B7D8CF]/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B7D8CF] resize-none"
                  />
                </div>

                <button 
                  onClick={handleSendNote}
                  className="py-3 bg-[#B7D8CF] text-[#111111] hover:bg-[#9ECBC0] font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  Send Note <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-[#F6F1EA]/80 py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo & Credits */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#B7D8CF] flex items-center justify-center">
                <Coffee className="w-4 h-4 text-[#111111]" />
              </div>
              <span className="font-serif text-lg font-bold tracking-widest text-white">CATENA COFFEE</span>
            </div>
            <p className="text-[10px] text-[#F6F1EA]/40 uppercase tracking-[0.25em] font-medium">Nagalapark, Kolhapur, Maharashtra 416003</p>
          </div>

          {/* Slogan */}
          <div className="text-center font-serif italic text-base text-[#B7D8CF]">
            “Introducing Anglo-Indian coffee culture with foam and calm.”
          </div>

          {/* Social connections */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#B7D8CF] hover:text-[#111111] flex items-center justify-center transition-all duration-300">
                <InstagramIcon />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#B7D8CF] hover:text-[#111111] flex items-center justify-center transition-all duration-300">
                <FacebookIcon />
              </a>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-[#F6F1EA]/40">@catenacoffee.kolhapur</span>
          </div>

        </div>

        {/* Bottom line */}
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-[#F6F1EA]/30">
          <span>&copy; {new Date().getFullYear()} Catena Coffee. All rights reserved.</span>
          <span className="flex items-center gap-1.5 animate-pulse-slow">
            Made with warmth &amp; coffee <Heart className="w-3 h-3 text-[#B7D8CF] fill-[#B7D8CF]" />
          </span>
        </div>
      </footer>

      {/* FULL SCREEN DYNAMIC GALLERY LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close trigger */}
            <button 
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-[#F6F1EA] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox content box */}
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/25 shadow-2xl bg-[#111111]"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox} alt="Enlarged cafe display" className="w-full h-full object-contain max-h-[80vh]" />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/40 to-transparent flex justify-between items-center text-xs uppercase tracking-wider">
                <span className="font-bold text-[#B7D8CF]">Authentic Night ambience</span>
                <span className="text-white/60">Catena Coffee Nagalapark</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE SEATING BOOKING GLASS MODAL */}
      <AnimatePresence>
        {reserveModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setReserveModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#F6F1EA] border border-[#B7D8CF]/50 rounded-3xl p-8 shadow-2xl relative flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setReserveModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#B7D8CF]/25 text-[#111111] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#B7D8CF] flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-[#111111]" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Reserve Evening Seating</h3>
                <p className="text-xs text-[#111111]/60 font-light mt-1">
                  Book a cozy table under the glowing lantern canopy.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-[#111111]/50 mb-1">Reservation Date</label>
                  <input 
                    type="date" 
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="w-full bg-white border border-[#B7D8CF]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B7D8CF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-[#111111]/50 mb-1">Time Slot (Dusk to Night)</label>
                  <select 
                    value={resTime}
                    onChange={(e) => setResTime(e.target.value)}
                    className="w-full bg-white border border-[#B7D8CF]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B7D8CF]"
                  >
                    <option>05:00 PM - 07:00 PM (Sunset Dusk)</option>
                    <option>07:00 PM - 09:00 PM (Candlelight Vibe)</option>
                    <option>09:00 PM - 11:00 PM (Night Canopy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-[#111111]/50 mb-1">Seating Area</label>
                  <select 
                    value={resArea}
                    onChange={(e) => setResArea(e.target.value)}
                    className="w-full bg-white border border-[#B7D8CF]/40 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B7D8CF]"
                  >
                    <option>Patio Table (Near Flower Bicycle)</option>
                    <option>Canopy Lounge (Teal Velvet Chairs)</option>
                    <option>Service Desk Barstool</option>
                  </select>
                </div>

                <button 
                  onClick={handleReserve}
                  className="mt-2 py-3 bg-[#111111] text-[#F6F1EA] hover:bg-[#B7D8CF] hover:text-[#111111] font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 shadow-md text-center"
                >
                  Lock Evening Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// Inline Social SVG helper elements to keep dependencies lightweight
function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

export default App
