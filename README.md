# Zarsa Gold — Static Site (with Vercel backend)

Luxurious single-page site (HTML + Tailwind CDN + Vanilla JS) with:
- Sticky navbar, hero slider
- Gallery with filters & lightbox
- About
- Contact (serverless backend + file upload)

## Contact Backend
- Endpoint: `/api/contact` (Vercel Serverless Function)
- Parses multipart form (Formidable) and emails details via Resend to **ZARSAGOLD@GMAIL.COM**.
- Optional file upload (`name="reference"`) is attached.

### Deploy via Vercel (Git ➝ Vercel)
1. Push this folder as a GitHub repo.
2. Import the repo in Vercel.
3. In Project → **Settings → Environment Variables** add:
   - `RESEND_API_KEY` = your Resend API key.
4. Deploy. (No build step required; static + API will work out of the box.)

> To use a custom **from** like `no-reply@zarsa.ca`, verify your domain in Resend and update `from` in `api/contact.js`.

### Local Dev
- Optional: `npm i` (for functions). Run `vercel dev` if you have Vercel CLI to test the API locally.

### Customize
- Replace images in `assets/` with real photos.
- Update any text in `index.html` (address/phone/email already set to your request).


## Keep secrets out of Git (Vercel)
Set these Environment Variables in **Vercel → Settings → Environment Variables**:
- `RESEND_API_KEY` — required
- `CONTACT_TO` — e.g., `ZARSAGOLD@GMAIL.COM`
- `CONTACT_FROM` — e.g., `Zarsa Gold <no-reply@zarsa.ca>` (requires verified domain in Resend)
- `CONTACT_BCC` — optional (your internal copy)

> Do **not** commit API keys to Git. All sensitive values live in Vercel env only.

## SEO
- Added canonical, Open Graph, Twitter Card
- Added JSON-LD (`JewelryStore`) with address/phone/email
- Included `robots.txt` and `sitemap.xml` (update canonical if you deploy on a different domain)
