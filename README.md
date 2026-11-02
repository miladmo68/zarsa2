<div align="center">

# 💍 Zarsa Gold — Bespoke Fine Jewelry

A luxury, motion-rich website for a Toronto fine-jewelry atelier: an editorial collection, a scroll-driven reveal and a custom-order form.

<a href="https://zarsa.ca/"><img src="https://img.shields.io/badge/Live_Demo-Open_Site-FF6A00?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo"></a>
<a href="https://github.com/miladmo68/zarsa2"><img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Source code"></a>
<a href="https://miladweb.com"><img src="https://img.shields.io/badge/Portfolio-miladweb.com-1E3A8A?style=for-the-badge&logo=aboutdotme&logoColor=white" alt="Portfolio"></a>

**🔗 Live:** [zarsa.ca](https://zarsa.ca/)

</div>

<p align="center">
  <img src="./.github/preview.jpg" alt="Zarsa Gold — Bespoke Fine Jewelry screenshot" width="100%" />
</p>

<p align="center">
  <img src="./.github/reveal.jpg" alt="Scroll-driven reveal section" width="49%" />
  <img src="./.github/col.jpg" alt="Collection with filters" width="49%" />
</p>

## ✨ Features

- **Signature hero** — a circular window that draws itself in gold, letter-by-letter headline, a rotating "Handmade in Toronto" seal, an arch detail photo and a synced featured-piece carousel
- **Scroll-driven reveal** — a circle that grows into a full-screen diptych as you scroll
- **Editorial collection** — balanced masonry grid, animated filter pill, image clip reveals and a custom "View" cursor
- **Lightbox** — keyboard, swipe and focus-trap support, piece descriptions, 18K / 22K choice and "Ask about this piece", which pre-fills the order form
- **Saved pieces** — heart any piece; your saved list shows in the nav and is sent with your request
- **Shop by how you wear it** — Layer it, Stack it, Gift a set and Mark a moment entry points
- **Atelier story** — a four-step process, promises and a parallax photo collage
- **Custom-order form** — floating labels, category chips, drag-and-drop reference upload and clear validation; sent with Resend through a Vercel serverless function
- **Mobile-first** — full-screen circular menu, a sticky order button and swipeable rails
- **Fast and accessible** — self-hosted fonts, responsive WebP images, Lenis smooth scroll, `prefers-reduced-motion` support and visible keyboard focus

## 🛠️ Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🚀 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) 18 or newer

**Install and run**

```bash
git clone https://github.com/miladmo68/zarsa2.git
cd zarsa2
npm install
npm run dev
```

### Environment variables

Create a `.env` file (or `.env.local` for Next.js) with:

```env
CONTACT_BCC=
CONTACT_FROM=
CONTACT_TO=
RESEND_API_KEY=
```

## 📁 Project Structure

```
zarsa2/
├── api/            # contact.js — Resend email handler
├── assets/         # original photos, img/ (WebP sizes), fonts/
├── css/style.css
├── js/main.js      # motion & interactions (vendor/lenis.min.js)
├── index.html
├── package.json
└── vercel.json
```

## 👤 Author

**Milad Mohammadi** — Frontend-Focused Full-Stack Developer, Toronto 🇨🇦

[![Website](https://img.shields.io/badge/Website-miladweb.com-FF6A00?style=flat-square&logo=googlechrome&logoColor=white)](https://miladweb.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-miladmo68-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/miladmo68/)
[![GitHub](https://img.shields.io/badge/GitHub-miladmo68-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/miladmo68)

<p align="center"><sub>If you like this project, consider giving it a ⭐</sub></p>
