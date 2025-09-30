
# Vercel Minimal Test

This is a minimal static site to verify that your Vercel project deploys without any legacy "now-*" runtime errors.

## Files
- `index.html` — static page
- `vercel.json` — ensures modern config (`version: 2`) and Node 20 runtime for any future `api/*.js` functions

## How to use
1. Create an empty GitHub repo (or a new branch) and add only these two files.
2. On Vercel: New Project → Import this repo.
   - Framework: Other
   - Root Directory: `./`
   - Build Command: (leave empty / turn off)
   - Output Directory: `.`
   - Install Command: (leave empty / turn off)
3. Deploy. You should see "It works 🎉".
4. After it's green, you can bring back your `/api/contact.js` and push again.
