# Ouribadah - Project Documentation

**Version:** 1.0  
**Generated:** December 28, 2025  
**Tech Stack:** React, TypeScript, Tailwind CSS, Supabase

---

## 1. Project Overview

**Ouribadah** is a comprehensive Islamic lifestyle web application designed to help Muslims manage their daily worship and find Islamic services nearby. The application provides essential tools for prayer management, Qibla direction, and location-based services for mosques and halal food.

---

## 2. Technology Stack

| Category | Technology |
|----------|------------|
| Frontend Framework | React 18.3.1 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Radix UI) |
| Build Tool | Vite |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| State Management | TanStack React Query |
| Routing | React Router DOM v6 |
| Form Handling | React Hook Form + Zod |

---

## 3. Core Features

### 3.1 Prayer Times
- **Description:** Displays the 5 daily Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) based on user's geographic location
- **API Used:** Aladhan API (free, no API key required)
- **Calculation Methods:** Supports multiple calculation methods (MWL, ISNA, etc.)
- **Caching:** Prayer times are cached in database for registered users

### 3.2 Qibla Compass
- **Description:** Interactive compass showing direction to the Kaaba in Mecca
- **Technology:** 
  - Browser Geolocation API for coordinates
  - DeviceOrientationEvent API for compass heading
  - Spherical trigonometry for Qibla calculation
- **APIs Used:** 
  - BigDataCloud Reverse Geocoding (free)
  - Nominatim/OpenStreetMap Geocoding (free)

### 3.3 Find Nearby Mosques
- **Description:** Search for mosques near user's location with filters
- **API Used:** Google Places API (requires API key)
- **Features:**
  - Radius filtering (1km - 20km)
  - "Open Now" filter
  - Manual address input
  - Distance display
  - Ratings and reviews

### 3.4 Find Halal Food
- **Description:** Search for halal restaurants and food establishments
- **API Used:** Google Places API (requires API key)
- **Features:**
  - Radius filtering
  - "Open Now" filter
  - Halal-specific filtering logic
  - Rating and price level display

---

## 4. Third-Party APIs

### 4.1 APIs Requiring API Keys

| API | Purpose | Secret Name |
|-----|---------|-------------|
| Google Places API | Mosque & Halal food search | `GOOGLE_MAPS_API_KEY` |

### 4.2 Free APIs (No Key Required)

| API | Purpose | Endpoint |
|-----|---------|----------|
| Aladhan API | Prayer times calculation | `api.aladhan.com` |
| BigDataCloud | Reverse geocoding (coords → address) | `api.bigdatacloud.net` |
| Nominatim (OSM) | Forward geocoding (address → coords) | `nominatim.openstreetmap.org` |

---

## 5. Database Schema

### 5.1 Tables Overview

| Table | Description | RLS Enabled |
|-------|-------------|-------------|
| `profiles` | User profile and preferences | ✅ Yes |
| `prayer_times` | Cached prayer times per user/location | ✅ Yes |
| `prayer_logs` | Prayer completion tracking | ✅ Yes |

### 5.2 Table: `profiles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to auth user |
| `full_name` | TEXT | User's display name |
| `location_city` | TEXT | User's city |
| `location_country` | TEXT | User's country |
| `prayer_calculation_method` | TEXT | Preferred calculation method (default: 'MWL') |
| `notification_preferences` | JSONB | Per-prayer notification settings |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

### 5.3 Table: `prayer_times`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to auth user |
| `latitude` | NUMERIC | Location latitude |
| `longitude` | NUMERIC | Location longitude |
| `date` | DATE | Date of prayer times |
| `fajr` | TIME | Fajr prayer time |
| `dhuhr` | TIME | Dhuhr prayer time |
| `asr` | TIME | Asr prayer time |
| `maghrib` | TIME | Maghrib prayer time |
| `isha` | TIME | Isha prayer time |
| `method` | TEXT | Calculation method used |
| `created_at` | TIMESTAMP | Record creation time |

### 5.4 Table: `prayer_logs`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Reference to auth user |
| `prayer` | TEXT | Prayer name (fajr, dhuhr, etc.) |
| `status` | TEXT | Completion status |
| `date_iso` | DATE | Date of prayer |
| `logged_at` | TIMESTAMP | When prayer was logged |
| `planned_time` | TIMESTAMP | Scheduled prayer time |
| `delay_minutes` | INTEGER | Minutes after scheduled time |
| `latitude` | NUMERIC | Location latitude |
| `longitude` | NUMERIC | Location longitude |
| `geohash5` | TEXT | 5-character geohash for location |
| `location_type` | TEXT | Type of location |
| `timezone` | TEXT | User's timezone |

---

## 6. Supabase Edge Functions

### 6.1 `places-mosques`
- **Purpose:** Fetch nearby mosques from Google Places API
- **Method:** GET/POST
- **Parameters:**
  - `latitude` (required): User's latitude
  - `longitude` (required): User's longitude
  - `radius` (optional): Search radius in meters (default: 5000)
  - `openNow` (optional): Filter for currently open mosques

### 6.2 `places-halal`
- **Purpose:** Fetch nearby halal restaurants from Google Places API
- **Method:** GET/POST
- **Parameters:**
  - `latitude` (required): User's latitude
  - `longitude` (required): User's longitude
  - `radius` (optional): Search radius in meters
  - `openNow` (optional): Filter for currently open restaurants

---

## 7. User Access Levels

### 7.1 Guest Users (Not Logged In)

| Feature | Access |
|---------|--------|
| View Prayer Times | ✅ Full Access |
| Qibla Compass | ✅ Full Access |
| Find Mosques | ✅ Full Access |
| Find Halal Food | ✅ Full Access |
| Prayer Time Caching | ❌ Not Available |
| Prayer Logging | ❌ Not Available |
| Profile Settings | ❌ Not Available |
| Notification Preferences | ❌ Not Available |

### 7.2 Registered Users (Logged In)

| Feature | Access |
|---------|--------|
| View Prayer Times | ✅ Full Access |
| Qibla Compass | ✅ Full Access |
| Find Mosques | ✅ Full Access |
| Find Halal Food | ✅ Full Access |
| Prayer Time Caching | ✅ Cached to Database |
| Prayer Logging | ✅ Track & Log Prayers |
| Profile Settings | ✅ Full Access |
| Notification Preferences | ✅ Configure per Prayer |

---

## 8. Security Features

### 8.1 Row-Level Security (RLS)
All database tables have RLS enabled with the following policies:
- Users can only view their own data
- Users can only insert their own data
- Users can only update their own data
- Users can only delete their own data (except profiles)

### 8.2 API Key Protection
- Google Maps API key is stored as a Supabase secret
- Never exposed to client-side code
- Only accessible in Edge Functions

---

## 9. Browser Requirements

| Feature | Requirement |
|---------|-------------|
| Geolocation | HTTPS required |
| Device Orientation | HTTPS required, iOS requires permission |
| General | Modern browser (Chrome, Firefox, Safari, Edge) |

---

## 10. Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── PrayerTimes.tsx  # Prayer times display
│   ├── QiblahCompass.tsx # Qibla direction
│   ├── PlaceCard.tsx    # Mosque/restaurant card
│   └── ...
├── hooks/
│   ├── useAuth.tsx      # Authentication hook
│   ├── useLocation.tsx  # Geolocation hook
│   ├── usePrayerTimes.tsx # Prayer times logic
│   ├── useQibla.tsx     # Qibla calculation
│   └── usePlaces.tsx    # Places search
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Mosques.tsx      # Mosque finder
│   ├── HalalFood.tsx    # Halal food finder
│   ├── Auth.tsx         # Authentication
│   └── ...
├── integrations/
│   └── supabase/        # Supabase client & types
└── lib/
    └── qiblaMath.ts     # Qibla calculations

supabase/
├── functions/
│   ├── places-mosques/  # Mosque search function
│   ├── places-halal/    # Halal food search function
│   └── _shared/         # Shared utilities
└── config.toml          # Supabase configuration
```

---

## 11. Contact & Support

- **Privacy Policy:** /privacy-policy
- **Terms of Service:** /terms-of-service
- **Contact:** /contact-us

---

*This documentation is auto-generated and reflects the current state of the Ouribadah project.*
