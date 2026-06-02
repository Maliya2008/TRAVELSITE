/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  TOURIST = "TOURIST",
  GUIDE = "GUIDE"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface GPSCoordinates {
  lat: number;
  lng: number;
}

export interface LandmarkMetadata {
  altitude: string;
  bestTimeToVisit: string;
  entranceFee: string;
  weather: string;
  rating: number;
}

export interface Landmark {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coordinates: GPSCoordinates;
  imageGallery: string[];
  mainImage: string;
  metadata: LandmarkMetadata;
}

export interface Guide {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  experienceLevel: string; // e.g., "7+ Years", "5 Years"
  languages: string[]; // e.g., ["English", "Sinhala", "German"]
  pricePerHour: number; // in USD
  availabilityCalendar: string[]; // dates like ["2026-06-01", "2026-06-02"]
  tags: string[]; // ["Wildlife Expert", "History Guide", "Hiking Enthusiast"]
  rating: number;
  reviewCount: number;
  location: string; // "Colombo" | "Kandy" | "Ella" | "Sigiriya" | "Galle"
  isActiveNow: boolean;
  // Professional Portfolio elements added for tourists' peace of mind
  portfolioDestinations?: string[]; // e.g. ["Nuwara Eliya Hills", "Sinharaja Forest Reserve"]
  certifications?: string[]; // e.g. ["SLTDA National License No: 494", "First Aid Professional Code"]
  equipment?: string[]; // e.g. ["High-zoom telephoto lens", "Professional hiking poles"]
  portfolioGallery?: string[]; // array of beautiful portfolio images
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroBgImage: string;
  heroBgImage2?: string;
  heroBgImage3?: string;
  heroBgImage4?: string;
  heroBgImage5?: string;
  heroBgFadeDuration: number; // in seconds
  heroBgBlur: number; // in pixels
  sectionOrder: string[]; // e.g. ["landmarks-explore", "waypoint-map", "guides-marketplace"]
  footerHeightClass: string; // "py-12" | "py-16" | "py-24" | "py-32"
  footerCopyright: string;
  theme: "dark" | "light";
  allowFadingAnimations: boolean;
  scenicWondersBgImage?: string;
  scenicWondersBgFilter?: string; // e.g. "brightness-50 blur-sm" etc.
  curatorMarketplaceBgImage?: string;
  curatorMarketplaceBgFilter?: string;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED"
}

export interface Booking {
  id: string;
  touristName: string;
  touristEmail: string;
  guideId: string;
  guideName: string;
  bookingDate: string;
  status: BookingStatus;
  hours: number;
  totalPrice: number;
  createdAt: string;
}

export interface DeveloperState {
  selectedLandmark: Landmark | null;
  apiResponseTimeMs: number | null;
  aiModelType: "standard" | "gemini-3.5-flash";
}

export interface TourGuideSearchParams {
  location?: string;
  tag?: string;
}
