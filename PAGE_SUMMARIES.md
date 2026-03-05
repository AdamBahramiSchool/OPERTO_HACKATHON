# Page Summaries - Operto Insights

This document provides bullet-point summaries of every page in the Operto Insights application.

---

## 1. Home Page (`/`)

**Purpose:** Landing page showcasing the Operto Insights platform for hotel SEO intelligence

**Key Features:**
- Hero section with animated gradient text "search magnet" and dashboard mockup
- Navigation bar with logo, feature links, and CTA buttons (Login/Sign Up)
- Six feature cards highlighting core capabilities:
  - SEO Health Audit (crawl pages, identify issues)
  - Geo Targeting Intelligence (city/region visibility analysis)
  - Traffic Analytics (organic, direct, referral trends)
  - Competitor Gap Analysis (keyword comparison)
  - Site Speed & Core Web Vitals (LCP, FID, CLS scores)
  - Automated Weekly Reports (branded PDF reports)
- Statistics showcase: 2,400+ hotels, 47% avg traffic increase, 3 min to first insight, 98/100 avg SEO score
- "How it works" section with 3 steps: Connect property → Get baseline score → Track growth
- Animated background with dot grid pattern and gradient orbs
- Multiple CTAs throughout page directing to signup
- Footer with branding and navigation links

**Design Elements:**
- Dark theme (#030712 background)
- Glass morphism effects on cards
- Gradient buttons (indigo to purple)
- Floating animation on mockup and accent cards
- Responsive grid layouts

---

## 2. Login Page (`/login`)

**Purpose:** User authentication for existing accounts

**Key Features:**
- Centered authentication form with glass morphism design
- Email and password input fields
- "Forgot password?" link
- Loading state with spinner during authentication
- Error message display for failed login attempts
- Supabase authentication integration
- Redirects to `/dashboard` on successful login
- Link to signup page for new users
- "Back to home" navigation link
- Animated background with gradient orbs

**Form Fields:**
- Email address (required)
- Password (required)

**User Flow:**
- Enter credentials → Submit → Authenticate via Supabase → Redirect to dashboard

---

## 3. Signup Page (`/signup`)

**Purpose:** New user registration and account creation

**Key Features:**
- Centered registration form with glass morphism design
- Four input fields for user information
- Password validation (minimum 8 characters)
- Loading state with spinner during account creation
- Error handling for duplicate accounts and validation failures
- Supabase authentication integration with user metadata
- Redirects to `/dashboard` on successful signup
- Terms of Service and Privacy Policy notice
- Link to login page for existing users
- "Back to home" navigation link
- Animated background with gradient orbs

**Form Fields:**
- Full name (required)
- Hotel name (required)
- Email address (required)
- Password (required, min 8 characters)

**User Flow:**
- Fill form → Submit → Create account in Supabase → Store metadata → Redirect to dashboard

---

## 4. Dashboard Home (`/dashboard`)

**Purpose:** Main analytics dashboard showing hotel SEO performance overview

**Key Features:**
- Four KPI cards displaying:
  - SEO Score (with weekly change indicator)
  - Geo Locations (number of cities/regions)
  - Organic Traffic (grade-based metric)
  - Flawed Pages (pages needing attention)
- SEO Performance Metrics section with progress bars:
  - NAP Consistency
  - Schema Markup
  - Content Localization
  - Keyword Optimization
- Issue Summary panel categorizing problems by severity:
  - Critical Issues (red)
  - High Priority (orange)
  - Medium Priority (yellow)
  - Low Priority (blue)
- Pages Needing Attention list showing:
  - Page URLs
  - Primary issue description
  - Severity badges
- Loading skeleton for data fetch states
- Error handling with retry functionality
- Fetches analysis data from `/api/insights` endpoint
- Requires user authentication via Supabase

**Data Sources:**
- Analysis data from Supabase based on user ID
- Real-time metrics and flawed page information

---

## 5. Website Crawler (`/dashboard/crawler`)

**Purpose:** Crawl hotel websites to discover all pages and analyze structure

**Key Features:**
- URL input field for website crawling
- Real-time streaming crawl results via Server-Sent Events (SSE)
- Progress indicator showing number of discovered pages
- Auto-generated Company ID (CID) from user ID
- Results display showing:
  - Page index number
  - Page URL
  - Page title
  - Error messages (if any)
- Scrollable results container (max height 600px)
- Completion message with total page count
- Stores crawled data in Supabase for later analysis
- Disabled state during active crawling
- Error handling with detailed error messages

**User Flow:**
- Enter website URL → Click "Start Crawl" → Stream results in real-time → View completion summary

**Technical Details:**
- Uses `/api/crawl` endpoint with POST request
- Streams data via SSE (data: JSON format)
- Generates CID from first 8 characters of user ID

---

## 6. Upload Build Files (`/dashboard/upload`)

**Purpose:** Upload and analyze website build files (dist/src folders) for SEO optimization

**Key Features:**
- Drag-and-drop file upload interface
- ZIP file validation and processing
- Progress bar with status updates
- File statistics display:
  - Total files count
  - HTML files count
  - JS files count
  - Other files count
- AI-powered page optimization (future feature)
- Before/After comparison view for optimized pages
- Page selector tabs for multiple files
- SEO score improvement visualization
- Key improvements list for each page
- Side-by-side code comparison (original vs optimized)
- Download button for optimized files
- Maximum file size: 50MB
- Detailed instructions panel

**Upload Process:**
1. Select/drop ZIP file
2. Validate file type
3. Upload to server
4. Extract and process files
5. Display statistics
6. (Optional) AI optimization
7. Show before/after comparison

**Supported Files:**
- HTML files (text extraction)
- JS files (readable strings extraction)
- Special files (robots.txt, sitemap.xml)

**Technical Details:**
- Uses `/api/upload-bundle` endpoint
- FormData for file upload
- Stores extracted content in Supabase
- Future: `/api/optimize-pages` for AI optimization

---

## 7. Blog Post Generator (`/dashboard/blog-generator`)

**Purpose:** Generate SEO-optimized blog posts from crawled website content

**Key Features:**
- Two-phase workflow:
  1. Generate blog post ideas from crawled content
  2. Generate full blog post from selected page
- Auto-generated Company ID (CID) display
- Blog Ideas section:
  - "Generate Ideas" button
  - Clickable idea cards that populate page URL
- Blog Generation Form with inputs:
  - Source Page URL (manual entry or dropdown)
  - Tone selection (Professional, Casual, Friendly, Luxury)
  - Length selection (Short 400-600, Medium 800-1200, Long 1500-2000 words)
  - Focus Keywords (comma-separated, optional)
- Available pages dropdown populated from crawled data
- Generated blog post display:
  - Title with copy button
  - Meta description with copy button
  - Suggested tags as colored badges
  - Full blog content in scrollable container
- Loading states for both idea generation and blog generation
- Error handling with detailed error messages
- Copy to clipboard functionality

**User Flow:**
- Generate ideas → Select idea/page → Configure tone/length/keywords → Generate blog → Copy/use content

**Technical Details:**
- Uses `/api/generate-blog` endpoint with different actions:
  - `action: "ideas"` - Generate blog ideas
  - `action: "generate"` - Generate full blog post
- Fetches available pages from crawled data
- AI-powered content generation

---

## 8. SEO Blog Generator (`/dashboard/blog`)

**Purpose:** Enhanced blog generation interface with improved UX and features

**Key Features:**
- Streamlined single-page blog generation workflow
- Auto-generated Company ID (CID) display
- Page selection with refresh functionality
- Dropdown of all crawled pages with URLs
- Configuration options:
  - Tone (Professional, Casual, Friendly, Luxury)
  - Length (Short 500-800, Medium 1000-1500, Long 1800-2500 words)
  - Focus Keywords (comma-separated, optional)
- Loading state for page fetching
- Generated blog post display:
  - Success message banner
  - Action buttons (Copy Content, Download Markdown)
  - Title section with copy button
  - Meta description with character count and copy button
  - Suggested tags as styled badges
  - Full blog content with HTML rendering
- Markdown download functionality
- Enhanced content formatting with HTML parsing
- Error handling throughout
- "No pages found" state with crawl prompt

**User Flow:**
- Select crawled page → Configure settings → Generate blog → Copy or download

**Technical Details:**
- Uses `/api/generate-blog` endpoint with actions:
  - `action: "pages"` - Fetch available pages
  - `action: "generate"` - Generate blog post
- Downloads blog as markdown file
- HTML rendering for better content display
- Character count for meta description

---

## 9. Data & Context (`/dashboard/data`)

**Purpose:** Store hotel context information to improve AI-generated insights

**Key Features:**
- Form-based data entry interface
- Six input fields for hotel information:
  - Hotel Name (text input)
  - Location (text input)
  - Hotel Description (textarea, 4 rows)
  - Target Audience (text input)
  - Main Competitors (comma-separated text input)
  - Target Keywords (textarea, 3 rows)
- Save button with loading state
- Success confirmation message (3-second display)
- Helper text for complex fields
- Glass morphism card design
- Maximum width container (3xl) for better readability

**Form Fields:**
- **Hotel Name:** Property name
- **Location:** City, state/country
- **Hotel Description:** Unique features, amenities, special characteristics
- **Target Audience:** Customer segments (business travelers, families, etc.)
- **Main Competitors:** Competing hotels in the area
- **Target Keywords:** SEO keywords to rank for

**User Flow:**
- Fill out form → Click "Save Context" → See success message

**Technical Details:**
- Currently logs to console (TODO: Save to Supabase)
- 1-second simulated API delay
- Auto-dismissing success message

---

## Summary Statistics

**Total Pages:** 9
- **Public Pages:** 3 (Home, Login, Signup)
- **Dashboard Pages:** 6 (Dashboard Home, Crawler, Upload, Blog Generator, Blog, Data & Context)

**Authentication:**
- All dashboard pages require Supabase authentication
- Login/Signup use Supabase Auth
- User metadata stored: full_name, hotel_name

**Common Design Patterns:**
- Glass morphism effects on all cards
- Dark theme (#030712 background)
- Gradient buttons (indigo to purple)
- Loading states with spinners
- Error handling with colored alert boxes
- Responsive layouts with Tailwind CSS
- Animated backgrounds with gradient orbs

**Key Technologies:**
- Next.js 14+ (App Router)
- React with TypeScript
- Supabase (Auth & Database)
- Tailwind CSS
- Server-Sent Events (SSE) for streaming
- AI integration for content generation

---

## Page Navigation Flow

```
Home (/)
  ├─→ Login (/login) ──→ Dashboard (/dashboard)
  └─→ Signup (/signup) ──→ Dashboard (/dashboard)

Dashboard (/dashboard)
  ├─→ Crawler (/dashboard/crawler)
  ├─→ Upload (/dashboard/upload)
  ├─→ Blog Generator (/dashboard/blog-generator)
  ├─→ Blog (/dashboard/blog)
  └─→ Data & Context (/dashboard/data)
```

**Typical User Journey:**
1. Land on Home page
2. Sign up for account
3. Redirected to Dashboard (view analytics)
4. Crawl website OR upload build files
5. Generate blog posts from crawled content
6. Add hotel context for better AI insights
7. Monitor SEO performance on Dashboard


