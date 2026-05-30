/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Landmark, Guide } from "./types";

export const LANDMARKS: Landmark[] = [
  {
    id: "sigiriya",
    name: "Sigiriya Lion Rock",
    tagline: "The Wonder of Asia",
    description: "An ancient rock fortress of unparalleled monumental scale. Rising 200 meters from the surrounding jungle, Sigiriya is famed for its giant lion paws gate, exquisite frescoes of celestial maidens, and the advanced hydrological engineering of its royal pleasure gardens.",
    coordinates: { lat: 7.9570, lng: 80.7601 },
    mainImage: "https://images.unsplash.com/photo-1588598124041-3eb2c5952fdf?q=80&w=1200&auto=format&fit=crop",
    imageGallery: [
      "https://images.unsplash.com/photo-1588598124041-3eb2c5952fdf?q=80&w=600",
      "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600",
      "https://images.unsplash.com/photo-1608958416715-dd0b9c3f4e91?q=80&w=600"
    ],
    metadata: {
      altitude: "349m above sea level",
      bestTimeToVisit: "January to April (7:00 AM for sunrise Climb)",
      entranceFee: "$36 USD (Foreign Nationals)",
      weather: "Warm & Tropical, 28°C - 32°C",
      rating: 4.9
    }
  },
  {
    id: "galle-fort",
    name: "Galle Dutch Fort",
    tagline: "Where Heritage Meets the Ocean",
    description: "A coastal rampart of history. Built by the Portuguese and extensively fortified by the Dutch in the 17th century, Galle Fort is a living archaeological reserve where narrow cobblestoned alleys meet the crashing waves of the Indian Ocean.",
    coordinates: { lat: 6.0535, lng: 80.2176 },
    mainImage: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=1200&auto=format&fit=crop",
    imageGallery: [
      "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600",
      "https://images.unsplash.com/photo-1563814885686-ffca6b6b553e?q=80&w=600"
    ],
    metadata: {
      altitude: "Sea Level",
      bestTimeToVisit: "November to April (Perfect sunset stroll)",
      entranceFee: "Free (Museums require separate entry of $5 USD)",
      weather: "Coastal Breeze, 27°C - 29°C",
      rating: 4.8
    }
  },
  {
    id: "kandy-temple",
    name: "Temple of the Tooth",
    tagline: "The Sacred Spiritual Heart",
    description: "Kandy's crowning spiritual sanctuary. Nestled in the misty hills, this golden-roofed temple complex houses Sri Lanka's most sacred Buddhist relic—the left canine tooth of Gautama Buddha, enveloped in a series of gold caskets.",
    coordinates: { lat: 7.2906, lng: 80.6337 },
    mainImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop",
    imageGallery: [
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=600",
      "https://images.unsplash.com/photo-1627440537415-cc77f3e8f804?q=80&w=600"
    ],
    metadata: {
      altitude: "490m above sea level",
      bestTimeToVisit: "July to August (During Esala Perahera festival)",
      entranceFee: "$10 USD (Foreign Nationals)",
      weather: "Pleasant Hill Country, 22°C - 26°C",
      rating: 4.7
    }
  },
  {
    id: "nine-arch",
    name: "Nine Arch Bridge",
    tagline: "The Bridge in the Sky",
    description: "A monumental masterclass of colonial-era engineering. Spanning a dense tropical valley in Ella, this spectacular bridge was constructed entirely from stone, brick, and cement with absolutely no steel or iron support structures.",
    coordinates: { lat: 6.8722, lng: 81.0518 },
    mainImage: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1200&auto=format&fit=crop",
    imageGallery: [
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=600",
      "https://images.unsplash.com/photo-1533588742-5953b0dfab27?q=80&w=600",
      "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=600"
    ],
    metadata: {
      altitude: "1,041m above sea level",
      bestTimeToVisit: "Early Morning (6:30 AM to see trains pass through)",
      entranceFee: "Free access via jungle trail",
      weather: "Misty & Humid, 18°C - 24°C",
      rating: 4.9
    }
  }
];

export const GUIDES: Guide[] = [
  {
    id: "g1",
    name: "Chathura Jayasekara",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&fit=crop",
    bio: "Passionate conservationist and certified wildlife tracker. I have spent over 12 years navigating Sri Lanka's national parks, specializing in leopard tracing in Yala and elephant herd migrations in Minneriya.",
    experienceLevel: "12+ Years",
    languages: ["English", "Sinhala", "German"],
    pricePerHour: 28,
    availabilityCalendar: ["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-05", "2026-06-06"],
    tags: ["Wildlife Expert", "Safari Specialist", "Photography"],
    rating: 4.95,
    reviewCount: 142,
    location: "Sigiriya",
    isActiveNow: true,
    portfolioDestinations: ["Yala National Park Block 1", "Minneriya Elephant Gathering Corridor", "Wilpattu Lakes"],
    certifications: ["SLTDA Wildlife Tracker License NT-208", "Red Cross Wilderness Emergency Care Certificate"],
    equipment: ["Nikon D850 with 600mm f/4 Super-Telephoto Lens", "Swarovski Optik Companion Binoculars", "Custom 4x4 Luxury Land Cruiser Safari Rig"],
    portfolioGallery: [
      "https://images.unsplash.com/photo-1547989453-11e67ffb3885?q=80&w=400",
      "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=400"
    ]
  },
  {
    id: "g2",
    name: "Anjali Perera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&fit=crop",
    bio: "History PhD graduate with a love for colonial architecture. I guide curious travelers through Galle Fort's secret underground tunnels and provide rich context about Dutch-Sinhalese historical treaties.",
    experienceLevel: "8 Years",
    languages: ["English", "French", "Sinhala"],
    pricePerHour: 25,
    availabilityCalendar: ["2026-06-01", "2026-06-03", "2026-06-04", "2026-06-07"],
    tags: ["History Guide", "Architecture Specialist", "Cultural Expert"],
    rating: 4.92,
    reviewCount: 94,
    location: "Galle Fort",
    isActiveNow: true,
    portfolioDestinations: ["Galle Fort Bastions walk", "Pettah Heritage Streets Colombo", "Polonnaruwa Vatadage Ruins"],
    certifications: ["SLTDA National Heritage Curator No: 1105", "Archaeology Dept Honorary Guide Badge"],
    equipment: ["Hand-annotated maps of 1680 Dutch Fortifications", "Digital Audio Tour Transceiver kits for guests"],
    portfolioGallery: [
      "https://images.unsplash.com/photo-1563814885686-ffca6b6b553e?q=80&w=400"
    ]
  },
  {
    id: "g3",
    name: "Kasun Bandara",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&fit=crop",
    bio: "Elite trekker and professional mountaineer. Let's scale Ella Rock, catch the magical fog rising over the Ravana falls, and climb Adams Peak for an unforgettable spiritual sunrise.",
    experienceLevel: "6 Years",
    languages: ["English", "Japanese", "Sinhala", "Tamil"],
    pricePerHour: 22,
    availabilityCalendar: ["2026-06-02", "2026-06-04", "2026-06-05", "2026-06-06"],
    tags: ["Hiking Enthusiast", "Adventure Trekking", "Ella Expert"],
    rating: 4.89,
    reviewCount: 78,
    location: "Ella",
    isActiveNow: false,
    portfolioDestinations: ["Ella Rock Precipice Trail", "Adam's Peak Sacred Stairwell Escalation", "Horton Plains Bakers Falls Loop"],
    certifications: ["Association of Sri Lankan mountaineers - Gold Guide Badge", "Basic Alpine Rescue License"],
    equipment: ["Professional Osprey First-Aid Pack", "Black Diamond Carbon Fiber trekking poles", "Portable weather barometer"],
    portfolioGallery: [
      "https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=400"
    ]
  },
  {
    id: "g4",
    name: "Sanduni Wickramasinghe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&fit=crop",
    bio: "Kandyan cultural dancer and local historian. Specialized in the sacred rites of the Kingdom of Kandy, traditional local tea estates heritage, and Buddhist art history of Sri Lanka.",
    experienceLevel: "10 Years",
    languages: ["English", "Sinhala", "Mandarin"],
    pricePerHour: 30,
    availabilityCalendar: ["2026-06-01", "2026-06-02", "2026-06-04", "2026-06-06", "2026-06-07"],
    tags: ["Cultural Expert", "Buddhist Art Specialist", "Tea Heritage"],
    rating: 4.98,
    reviewCount: 167,
    location: "Kandy",
    isActiveNow: true,
    portfolioDestinations: ["Embekke Devalaya Woodwork Expedition", "Nuwara Eliya Tea Plucking Experience", "Aluvihare Rock temple Caves"],
    certifications: ["National Arts Council Heritage Specialist Code: 394", "Senior SLTDA Lecturer Status"],
    equipment: ["Traditional Brass oil lamp ceremony kit", "Annotated catalog of Kandyan traditional murals"],
    portfolioGallery: [
      "https://images.unsplash.com/photo-1627440537415-cc77f3e8f804?q=80&w=400"
    ]
  },
  {
    id: "g5",
    name: "Roshan de Silva",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&fit=crop",
    bio: "Culinary expert and street food hunter. I specialize in curated culinary journeys through Colombo's Pettah markets, explaining the spices, multi-cultural culinary roots, and teaching how to make authentic Sri Lankan crab curry.",
    experienceLevel: "5 Years",
    languages: ["English", "Sinhala"],
    pricePerHour: 24,
    availabilityCalendar: ["2026-06-01", "2026-06-03", "2026-06-05", "2026-06-06"],
    tags: ["Culinary Tour", "Street Food expert", "Colombo Local"],
    rating: 4.85,
    reviewCount: 62,
    location: "Colombo",
    isActiveNow: true,
    portfolioDestinations: ["Pettah Food Street Market Walk", "Galle Face Green sunset dining", "Traditional organic spice estate tours"],
    certifications: ["Ceylon Culinary Guild Associate", "Municipal Hygiene & Tourism Service Badge"],
    equipment: ["Portable hygiene testing refractometer", "English-Sinhala spice translation pamphlets for guests"],
    portfolioGallery: [
      "https://images.unsplash.com/photo-1608958416715-dd0b9c3f4e91?q=80&w=400"
    ]
  }
];
