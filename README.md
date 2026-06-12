# Lencomedicale LK

**Connecting International Doctors with Australian Medical Opportunities**

A professional medical recruitment website that helps overseas-qualified doctors and internationally trained doctors connect with trusted medical centres in Australia.

## Overview

Lencomedicale LK collects CVs from international doctors, reviews professional backgrounds, and introduces suitable profiles to a trusted network of Australian medical centres — all with privacy and consent at the core.

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero, Who We Help, What We Do, Process Steps, Why Choose Us, For Medical Centres CTA |
| **For Doctors** | Information for doctors, role types, process, eligibility, disclaimer |
| **For Medical Centres** | Information for centres, staffing inquiry form |
| **How It Works** | Detailed 4-step visual process, principles, FAQ |
| **Submit Your CV** | Comprehensive CV form with file upload and consent checkboxes |
| **About Us** | Story, what we do/don't do, values, honest commitment |
| **Contact** | Contact form, email, WhatsApp, hours, social links |
| **Privacy Policy** | Full data privacy policy |
| **Terms & Consent** | Terms of use and consent information |
| **Admin Dashboard** | Admin-only area to manage submissions |

## Admin Dashboard

Access at `/admin/` — features include:
- View all doctor CV submissions
- Search and filter by specialty, registration status, country
- Update submission status (New, Reviewed, Shortlisted, Sent, Contacted, Not Suitable)
- Add private notes per candidate
- View medical centre enquiries
- View contact messages
- Export submissions as CSV

## Tech Stack

- Pure HTML5, CSS3, JavaScript (no build step needed)
- CSS Custom Properties design system
- localStorage for form data persistence
- Font Awesome icons
- Google Fonts (Inter)
- Fully responsive (mobile-first)
- SEO-optimized meta tags

## Design

- **Palette:** White, deep navy (#0F2A4A), soft blue, teal (#0D9488)
- **Style:** Premium, clean, trustworthy, medical recruitment
- **Typography:** Inter font family
- **Responsive:** Mobile, tablet, desktop breakpoints

## Deployment

Static HTML — deploy to any hosting platform:
- GitHub Pages: Enable in Settings → Pages → main branch / root
- Netlify, Vercel, or any static host

**Live URL:** `https://designask.github.io/lencomedicale-lk/`

## Privacy & Security Notes

- CVs stored in localStorage (demo) — production should use secure backend/database
- No public profile listing
- Consent-based data sharing only
- Data deletion rights supported
- Admin-only access to submissions

## License

All rights reserved — Lencomedicale LK
