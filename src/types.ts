export type BrandName = "Ivory" | "Ivory AI" | "Solene AI" | "Elysian Plan" | "Aura Wedding" | "EverAfter AI" | "Bliss & Bloom";

export interface BrandConfig {
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgTone?: string;
  cardBg?: string;
  textColor?: string;
  vibeThemeName?: string;
}

export type EventType = "walkthrough" | "tasting" | "payment" | "deadline" | "rehearsal" | "wedding_day" | "consultation";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category: EventType;
  vendorName?: string;
  location?: string;
  notes?: string;
  isGoogleCalendarSynced: boolean;
}

export type VisionCategory =
  | "overall"
  | "flowers"
  | "dress"
  | "venue"
  | "photos"
  | "engagement_photos"
  | "catering"
  | "signage"
  | "hair_makeup"
  | "custom";

export interface VisionInspoPhoto {
  id: string;
  url: string;
  title: string;
  source?: string;
  category: VisionCategory;
  dateAdded?: string;
}

export interface VisionCategoryData {
  pinterestBoardUrl: string;
  isSynced: boolean;
  syncedCount: number;
  notes: string;
  photos: VisionInspoPhoto[];
}

export interface WeddingProfile {
  coupleNames: string;
  partner1: string;
  partner2: string;
  weddingDate: string; // YYYY-MM-DD
  location: string;
  budget: number;
  guestCount: number;
  gmailAddress: string; // e.g. brianna.wedding2026@serenoweddings.com
  emailSetupMode?: "create_new_punny" | "google_oauth";
  isGoogleAccountLinked?: boolean;
  linkedGoogleEmail?: string;
  pinterestBoardUrl: string;
  florals: string;
  colors: string[]; // Hex codes or names
  vibe: string;
  notes: string;
  isPinterestSynced: boolean;
  syncedPinsCount: number;
  categoryBoards?: Record<string, VisionCategoryData>;
}

export type VendorCategory =
  | "Venue"
  | "Florist"
  | "DJ & Music"
  | "Hair & Makeup"
  | "Planner"
  | "Photographer"
  | "Videographer"
  | "Catering"
  | "Bakery & Cake"
  | "Decor & Rentals"
  | "Officiant"
  | "Transportation"
  | "Attire & Suits"
  | "Custom";

export type VendorStatus = "inquired" | "quote_received" | "contract_signed" | "paid" | "booked";

export interface VendorEmailThread {
  id: string;
  sender: string;
  email: string;
  subject: string;
  snippet: string;
  date: string;
  attachmentName?: string;
  extractedPrice?: number;
  extractedSourceDoc?: string;
  extractedNotes?: string;
  isVerified?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  suggestedAmount: number; // Extracted via AI from contract/email
  confirmedAmount: number; // User verified/adjusted amount
  sourceDocument?: string; // e.g., "Contract_Oakridge_Venue_2026.pdf"
  notes?: string;
  rating?: number;
  reviewCount?: number;
  reviewAnalysis?: string;
  serviceScopeScore?: number; // 1-100 score on scope volume & value
  emailThreads: VendorEmailThread[];
  dateAdded: string;
}

export interface EmailMessage {
  id: string;
  vendorId?: string;
  vendorName: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  date: string;
  body: string;
  attachmentName?: string;
  isRead: boolean;
  isBookedVendor?: boolean;
  pendingResponse?: boolean;
  hasQuestion?: boolean;
  extractedQuote?: {
    price: number;
    sourceDoc: string;
    services: string;
    notes: string;
    contactPerson: string;
  };
}

export interface DesignConcept {
  id: string;
  title: string;
  category: "Bouquet" | "Tablescape" | "Cake" | "Moodboard" | "Lighting" | "Stationery" | "Arch";
  prompt: string;
  imageUrl: string;
  dateCreated: string;
  likes: number;
  isFavorite: boolean;
}

export interface TodoItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  assignedTo?: string;
}

export type EmailSetupMode = "create_new_punny" | "link_existing";

export interface ExtrapolatedFormFields {
  guestCount: number;
  eventDate: string;
  venueType: string;
  flowerTypes: string;
  colorPalette: string;
  budgetCap: string;
  specialRequests: string;
}

export interface DirectoryVendor {
  id: string;
  name: string;
  category: VendorCategory;
  tagline: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  soleneRating: number; // e.g. 4.9 / 5.0
  distanceMiles: number;
  location: string;
  priceTier: "$$" | "$$$" | "$$$$";
  estimatedPriceRange: string;
  imageUrl: string;
  galleryImages: string[];
  aiReviewSummary: string;
  websiteUrl: string;
  inquiryFormFields: {
    fullName: string;
    email: string;
    eventDate: string;
    guestCount: number;
    venueLocation: string;
    styleVision: string;
    budgetRange: string;
    specialRequests: string;
  };
}

export interface BudgetItem {
  id: string;
  category: VendorCategory;
  vendorName: string;
  estimatedCost: number;
  quotedCost: number;
  actualSpent: number;
  status: "Estimated" | "Quoted" | "Booked" | "Paid";
  dueDate?: string;
  notes?: string;
}

export interface DetailCheckItem {
  id: string;
  question: string;
  answer: string;
  isCompleted: boolean;
  category: string;
  sourceDoc?: string;
  aiSuggested?: boolean;
}

export interface PlanningDetailSection {
  id: string;
  title: string;
  iconName: string; // e.g., "Palette", "Building", "Clock", "Heart", "ShieldAlert"
  description: string;
  items: DetailCheckItem[];
  notes: string;
}

export interface WalkthroughMilestone {
  id: string;
  stage: "months_out" | "weeks_out font" | "days_before" | "day_of" | "post_wedding";
  timeframeLabel: string; // e.g. "6 Months Out", "1 Week Out", "Day-Of Morning"
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  questions: DetailCheckItem[];
  contractVerifiedNotes?: string;
  celebrationEffect?: boolean;
}

export interface VendorContractScheduleItem {
  id: string;
  vendorName: string;
  category: string;
  time: string; // e.g. "08:00 AM"
  event: string; // e.g. "Hair & Makeup Artists Arrive at Suite"
  sourceDoc: string;
  notes: string;
  confirmed: boolean;
}


