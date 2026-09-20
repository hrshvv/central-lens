# Central Lens (सेंट्रल लेंस)

> **भारत का स्वतंत्र और तथ्यपरक डिजिटल समाचार मंच**  
> Hindi-first, video-first modern digital journalism platform built with Next.js 16 and React 19.

---

## 🌟 Key Features

* **Hindi-First Editorial & Newsroom**: Tailored Devanagari typography, clean reading layout, reading time estimation, and view metrics.
* **Rich Article Management**: Admin newsroom with a full-featured rich-text editor (`react-quill-new`), category tagging, cover image uploads, and draft/published workflows.
* **Multimedia & Video Bulletins**: Support for long-form video stories, Central Lens Shorts, and embedded player integration with auto-detected metadata.
* **Live Breaking News Ticker**: Dynamic real-time breaking news ticker integrated into the navigation bar with geo-location editions.
* **Production-Grade Security**:
  * Role-based route authorization (`admin` / `editor` / `reader`).
  * Cryptographic HMAC-SHA256 JWT access and refresh token authentication.
  * Stored XSS protection with HTML sanitization on rich-text article bodies.
  * MIME type and size-validated Cloudinary asset uploads.
  * ReDoS-protected search endpoint.
* **SEO & Social Sharing Ready**:
  * Dynamic Open Graph and Twitter Cards on articles, categories, and videos.
  * Schema.org `NewsArticle` structured JSON-LD data for Google News indexing.
  * Dynamic `sitemap.xml` and `robots.txt` generation.
* **High Performance**:
  * Incremental Static Regeneration (ISR, 60s cache revalidation on homepage).
  * MongoDB connection pooling (`maxPoolSize`, `minPoolSize`).
  * Optimized, lightweight vector favicon (< 3 KB).
  * Custom branded 404 (`not-found.tsx`) and 500 (`error.tsx`) error boundaries.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Library**: [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
* **Authentication**: JSON Web Tokens (`jsonwebtoken` + Web Crypto HMAC-SHA256)
* **Media Storage**: [Cloudinary](https://cloudinary.com/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18.17+ or v20+ recommended)
* MongoDB connection string (local instance or MongoDB Atlas)
* Cloudinary account (cloud name, API key, API secret)

### 2. Environment Configuration
Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

Configure your environment variables:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/centrallens?retryWrites=true&w=majority
JWT_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_SITE_URL=https://central-lens.vercel.app
```

### 3. Installation
Install dependencies:

```bash
npm install
```

### 4. Database Seeding (Optional)
Populate initial categories, admin user, and demo articles:

```bash
npm run seed
```

### 5. Running Locally
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

To test or build for production:

```bash
# Type check and build
npm run build

# Start production server
npm run start
```

---

## 🌐 Production Deployment Checklist

1. **Host Configuration (e.g. Vercel)**: Add all `.env` keys into **Project Settings → Environment Variables**.
2. **MongoDB Atlas Network Access**: Ensure IP Access List includes `0.0.0.0/0` (Allow from Anywhere) if deploying on serverless architectures.
3. **Search Console**: Once deployed, submit `https://your-domain.com/sitemap.xml` to **Google Search Console** and submit your publication to the **Google Publisher Center**.

---

## 📄 License
Private repository &copy; Central Lens Media. All rights reserved.
