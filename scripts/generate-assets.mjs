import sharp from "sharp";
import fs from "fs";
import path from "path";

async function generateAssets() {
  const publicDir = path.resolve("public");
  const appDir = path.resolve("src/app");

  // 1. TalentCore Logo SVG (Horizontal)
  const logoSvg = Buffer.from(`
    <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Icon Mark -->
      <rect x="10" y="15" width="70" height="70" rx="18" fill="#0F172A" />
      <path d="M30 35H60M45 35V65" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="58" cy="58" r="6" fill="#2563EB" />
      
      <!-- Brand Text -->
      <text x="96" y="63" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="40" font-weight="800" fill="#0F172A" letter-spacing="-1">Talent<tspan fill="#2563EB">Core</tspan></text>
      <text x="98" y="79" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="600" fill="#64748B" letter-spacing="3">TALENT NETWORK</text>
    </svg>
  `);

  // 2. TalentCore Icon / Favicon SVG (Square)
  const iconSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="112" fill="#0F172A" />
      <path d="M140 180H372M256 180V370" stroke="#FFFFFF" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="340" cy="330" r="38" fill="#2563EB" />
    </svg>
  `);

  // 3. TalentCore CTA Graphic SVG (Rich Modern Neutral Platform Graphic)
  const ctaSvg = Buffer.from(`
    <svg width="900" height="700" viewBox="0 0 900 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="0" y="0" width="900" height="700" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.25"/>
        </filter>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2563EB"/>
          <stop offset="100%" stop-color="#3B82F6"/>
        </linearGradient>
      </defs>

      <!-- Main Central Card -->
      <g filter="url(#shadow)">
        <rect x="100" y="90" width="700" height="500" rx="28" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
        
        <!-- Top Window Header Bar -->
        <rect x="100" y="90" width="700" height="64" rx="28" fill="#0F172A" />
        <circle cx="140" cy="122" r="7" fill="#EF4444"/>
        <circle cx="162" cy="122" r="7" fill="#F59E0B"/>
        <circle cx="184" cy="122" r="7" fill="#10B981"/>
        <text x="220" y="128" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#94A3B8">TalentCore • Verified Match Intelligence</text>
        
        <!-- Live Status Pill -->
        <rect x="660" y="108" width="110" height="28" rx="14" fill="#2563EB" fill-opacity="0.2" stroke="#2563EB" stroke-width="1"/>
        <circle cx="676" cy="122" r="4" fill="#60A5FA"/>
        <text x="688" y="126" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#93C5FD">DIRECT HIRE</text>

        <!-- Candidate Card 1 -->
        <rect x="140" y="190" width="620" height="100" rx="18" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
        <rect x="164" y="212" width="56" height="56" rx="14" fill="#2563EB"/>
        <text x="180" y="248" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">TC</text>
        <text x="240" y="235" font-family="system-ui, sans-serif" font-size="17" font-weight="700" fill="#F8FAFC">Pre-Vetted Candidate Shortlist</text>
        <text x="240" y="258" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">Matched within 48 hours • 3 Top Profiles Ready</text>
        <rect x="620" y="222" width="116" height="36" rx="10" fill="url(#blueGrad)"/>
        <text x="645" y="245" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">REVIEW</text>

        <!-- Candidate Card 2 -->
        <rect x="140" y="310" width="620" height="100" rx="18" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>
        <rect x="164" y="332" width="56" height="56" rx="14" fill="#475569"/>
        <text x="181" y="368" font-family="system-ui, sans-serif" font-size="22" font-weight="800" fill="#FFFFFF">98</text>
        <text x="240" y="355" font-family="system-ui, sans-serif" font-size="17" font-weight="700" fill="#F8FAFC">Direct Employer Screening</text>
        <text x="240" y="378" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#94A3B8">Seamless discovery &amp; interview scheduling</text>
        <rect x="620" y="342" width="116" height="36" rx="10" fill="#334155"/>
        <text x="642" y="365" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#F8FAFC">SCHEDULE</text>

        <!-- Stats Bar -->
        <rect x="140" y="430" width="620" height="120" rx="18" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
        <text x="170" y="475" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">3-5</text>
        <text x="170" y="502" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748B">Vetted Candidates / Role</text>

        <text x="380" y="475" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#38BDF8">48 hrs</text>
        <text x="380" y="502" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748B">Turnaround Time</text>

        <text x="590" y="475" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#818CF8">100%</text>
        <text x="590" y="502" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748B">Hiring Alignment</text>
      </g>
    </svg>
  `);

  console.log("Rendering assets with sharp...");

  // Generate PNGs
  await sharp(logoSvg).png().toFile(path.join(publicDir, "logo.png"));
  await sharp(iconSvg).resize(120, 120).png().toFile(path.join(publicDir, "gicon.png"));
  await sharp(iconSvg).resize(512, 512).png().toFile(path.join(appDir, "icon.png"));
  await sharp(iconSvg).resize(32, 32).png().toFile(path.join(appDir, "favicon.ico"));
  await sharp(iconSvg).resize(32, 32).png().toFile(path.join(publicDir, "favicon.ico"));
  await sharp(ctaSvg).png().toFile(path.join(publicDir, "cta.png"));

  console.log("✅ All TalentCore assets successfully generated!");
}

generateAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});

