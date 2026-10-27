# Generate standalone SVG for Room3DScene Schema Tree Diagram
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1020" width="100%" height="100%" style="background:#0F172A; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1B54"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Title Card -->
  <rect x="40" y="24" width="1520" height="80" rx="12" fill="url(#headerGrad)" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
  <text x="800" y="60" text-anchor="middle" fill="#38BDF8" font-size="24" font-weight="800" letter-spacing="1.5">📐 Room3DScene Schema Tree Hierarchy (v1.0)</text>
  <text x="800" y="86" text-anchor="middle" fill="#94A3B8" font-size="13">Single Source of Truth Data Contract Synchronized across Unity 3D / WebGL, FastAPI &amp; Storage</text>

  <!-- Root Node -->
  <rect x="620" y="130" width="360" height="72" rx="12" fill="url(#rootGrad)" stroke="#60A5FA" stroke-width="2.5" filter="url(#shadow)"/>
  <text x="800" y="162" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="800" letter-spacing="1">Room3DScene</text>
  <rect x="680" y="172" width="240" height="20" rx="10" fill="#FFFFFF" fill-opacity="0.2"/>
  <text x="800" y="186" text-anchor="middle" fill="#E0F2FE" font-size="11" font-weight="600">schemaVersion: "1.0" (Immutable)</text>

  <!-- Bus Lines -->
  <line x1="800" y1="202" x2="800" y2="230" stroke="#60A5FA" stroke-width="3"/>
  <line x1="160" y1="230" x2="1440" y2="230" stroke="#60A5FA" stroke-width="3"/>

  <!-- Col 1: Camera -->
  <line x1="160" y1="230" x2="160" y2="270" stroke="#38BDF8" stroke-width="2.5"/>
  <rect x="40" y="270" width="240" height="660" rx="10" fill="#1E293B" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="40" y="270" width="240" height="6" rx="3" fill="#38BDF8"/>
  <text x="60" y="306" fill="#F1F5F9" font-size="16" font-weight="700">📷 camera</text>
  <rect x="200" y="292" width="60" height="18" rx="4" fill="#0F172A"/>
  <text x="230" y="305" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="monospace">Object</text>
  <line x1="55" y1="322" x2="265" y2="322" stroke="#334155" stroke-width="1"/>

  <g transform="translate(55, 336)">
    <!-- Props -->
    <rect x="0" y="0" width="210" height="36" rx="4" fill="#0F172A"/>
    <text x="8" y="22" fill="#CBD5E1" font-family="monospace" font-size="11">position</text>
    <text x="202" y="22" text-anchor="end" fill="#94A3B8" font-size="10.5">[0, 1.65, 4.2]</text>

    <rect x="0" y="44" width="210" height="36" rx="4" fill="#0F172A"/>
    <text x="8" y="66" fill="#CBD5E1" font-family="monospace" font-size="11">rotation</text>
    <text x="202" y="66" text-anchor="end" fill="#94A3B8" font-size="10.5">[-12.5, 0, 0]</text>

    <rect x="0" y="88" width="210" height="36" rx="4" fill="#0F172A"/>
    <text x="8" y="110" fill="#CBD5E1" font-family="monospace" font-size="11">fov</text>
    <text x="202" y="110" text-anchor="end" fill="#38BDF8" font-size="11" font-weight="700">52.0°</text>

    <rect x="0" y="132" width="210" height="36" rx="4" fill="#0F172A"/>
    <text x="8" y="154" fill="#CBD5E1" font-family="monospace" font-size="11">aspectRatio</text>
    <text x="202" y="154" text-anchor="end" fill="#94A3B8" font-size="10.5">1.333</text>

    <rect x="0" y="176" width="210" height="36" rx="4" fill="#0F172A"/>
    <text x="8" y="198" fill="#CBD5E1" font-family="monospace" font-size="11">target</text>
    <text x="202" y="198" text-anchor="end" fill="#94A3B8" font-size="10.5">[0, 1.2, 0]</text>
  </g>

  <!-- Col 2: Room -->
  <line x1="416" y1="230" x2="416" y2="270" stroke="#34D399" stroke-width="2.5"/>
  <rect x="296" y="270" width="240" height="660" rx="10" fill="#1E293B" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="296" y="270" width="240" height="6" rx="3" fill="#34D399"/>
  <text x="316" y="306" fill="#F1F5F9" font-size="16" font-weight="700">🏠 room</text>
  <rect x="456" y="292" width="60" height="18" rx="4" fill="#0F172A"/>
  <text x="486" y="305" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="monospace">Object</text>
  <line x1="311" y1="322" x2="521" y2="322" stroke="#334155" stroke-width="1"/>

  <g transform="translate(311, 336)">
    <rect x="0" y="0" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="20" fill="#CBD5E1" font-family="monospace" font-size="11">width (X)</text>
    <text x="202" y="20" text-anchor="end" fill="#34D399" font-weight="700" font-size="11">6.0 m</text>

    <rect x="0" y="38" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="58" fill="#CBD5E1" font-family="monospace" font-size="11">length (Z)</text>
    <text x="202" y="58" text-anchor="end" fill="#34D399" font-weight="700" font-size="11">5.0 m</text>

    <rect x="0" y="76" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="96" fill="#CBD5E1" font-family="monospace" font-size="11">height (Y)</text>
    <text x="202" y="96" text-anchor="end" fill="#34D399" font-weight="700" font-size="11">2.8 m</text>

    <rect x="0" y="114" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="134" fill="#CBD5E1" font-family="monospace" font-size="11">wallColor</text>
    <text x="202" y="134" text-anchor="end" fill="#94A3B8" font-size="10.5">#20222E</text>

    <rect x="0" y="152" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="172" fill="#CBD5E1" font-family="monospace" font-size="11">floorType</text>
    <text x="202" y="172" text-anchor="end" fill="#94A3B8" font-size="10.5">"hardwood"</text>

    <rect x="0" y="190" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="210" fill="#CBD5E1" font-family="monospace" font-size="11">floorColor</text>
    <text x="202" y="210" text-anchor="end" fill="#94A3B8" font-size="10.5">#4A3525</text>

    <rect x="0" y="228" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="248" fill="#CBD5E1" font-family="monospace" font-size="11">ceilingColor</text>
    <text x="202" y="248" text-anchor="end" fill="#94A3B8" font-size="10.5">#FFFFFF</text>
  </g>

  <!-- Col 3: Architecture -->
  <line x1="672" y1="230" x2="672" y2="270" stroke="#FBBF24" stroke-width="2.5"/>
  <rect x="552" y="270" width="240" height="660" rx="10" fill="#1E293B" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="552" y="270" width="240" height="6" rx="3" fill="#FBBF24"/>
  <text x="572" y="306" fill="#F1F5F9" font-size="16" font-weight="700">🏛️ architecture</text>
  <rect x="712" y="292" width="60" height="18" rx="4" fill="#0F172A"/>
  <text x="742" y="305" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="monospace">Object</text>
  <line x1="567" y1="322" x2="777" y2="322" stroke="#334155" stroke-width="1"/>

  <g transform="translate(567, 336)">
    <!-- Sub 1: Walls -->
    <rect x="0" y="0" width="210" height="95" rx="6" fill="#0B1329" stroke="#475569" stroke-dasharray="3,3"/>
    <text x="8" y="18" fill="#FBBF24" font-size="11.5" font-weight="700">🧱 walls[]</text>
    <text x="202" y="18" text-anchor="end" fill="#64748B" font-size="9.5" font-family="monospace">Array&lt;Wall&gt;</text>
    <text x="8" y="38" fill="#94A3B8" font-size="10">• id: "wall_back" | "left"</text>
    <text x="8" y="56" fill="#94A3B8" font-size="10">• [x1, z1] ➔ [x2, z2]</text>
    <text x="8" y="74" fill="#94A3B8" font-size="10">• height: 2.8m, thick: 0.15m</text>

    <!-- Sub 2: Doors -->
    <rect x="0" y="105" width="210" height="95" rx="6" fill="#0B1329" stroke="#475569" stroke-dasharray="3,3"/>
    <text x="8" y="123" fill="#FBBF24" font-size="11.5" font-weight="700">🚪 doors[]</text>
    <text x="202" y="123" text-anchor="end" fill="#64748B" font-size="9.5" font-family="monospace">Array&lt;Door&gt;</text>
    <text x="8" y="143" fill="#94A3B8" font-size="10">• id: "door_01" (wallId)</text>
    <text x="8" y="161" fill="#94A3B8" font-size="10">• pos: [-3.0, 1.05, 0.5]</text>
    <text x="8" y="179" fill="#94A3B8" font-size="10">• width: 0.9m, height: 2.1m</text>

    <!-- Sub 3: Windows -->
    <rect x="0" y="210" width="210" height="95" rx="6" fill="#0B1329" stroke="#475569" stroke-dasharray="3,3"/>
    <text x="8" y="228" fill="#FBBF24" font-size="11.5" font-weight="700">🪟 windows[]</text>
    <text x="202" y="228" text-anchor="end" fill="#64748B" font-size="9.5" font-family="monospace">Array&lt;Win&gt;</text>
    <text x="8" y="248" fill="#94A3B8" font-size="10">• id: "win_01" (wallId)</text>
    <text x="8" y="266" fill="#94A3B8" font-size="10">• pos: [-1.2, 1.5, -2.5]</text>
    <text x="8" y="284" fill="#94A3B8" font-size="10">• width: 1.4m, height: 1.3m</text>
  </g>

  <!-- Col 4: Objects -->
  <line x1="928" y1="230" x2="928" y2="270" stroke="#C084FC" stroke-width="2.5"/>
  <rect x="808" y="270" width="240" height="660" rx="10" fill="#1E293B" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="808" y="270" width="240" height="6" rx="3" fill="#C084FC"/>
  <text x="828" y="306" fill="#F1F5F9" font-size="16" font-weight="700">🪑 objects[]</text>
  <rect x="948" y="292" width="80" height="18" rx="4" fill="#0F172A"/>
  <text x="988" y="305" text-anchor="middle" fill="#94A3B8" font-size="9.5" font-family="monospace">Array&lt;Entity&gt;</text>
  <line x1="823" y1="322" x2="1033" y2="322" stroke="#334155" stroke-width="1"/>

  <g transform="translate(823, 336)">
    <rect x="0" y="0" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="20" fill="#CBD5E1" font-family="monospace" font-size="11">id</text>
    <text x="202" y="20" text-anchor="end" fill="#94A3B8" font-size="10.5">"dining_01"</text>

    <rect x="0" y="38" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="58" fill="#CBD5E1" font-family="monospace" font-size="11">type</text>
    <text x="202" y="58" text-anchor="end" fill="#C084FC" font-weight="700" font-size="11">"diningTable"</text>

    <rect x="0" y="76" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="96" fill="#CBD5E1" font-family="monospace" font-size="11">position</text>
    <text x="202" y="96" text-anchor="end" fill="#94A3B8" font-size="10.5">[0, 0.39, 0]</text>

    <rect x="0" y="114" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="134" fill="#CBD5E1" font-family="monospace" font-size="11">rotation</text>
    <text x="202" y="134" text-anchor="end" fill="#94A3B8" font-size="10.5">[0, 90, 0]</text>

    <rect x="0" y="152" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="172" fill="#CBD5E1" font-family="monospace" font-size="11">scale</text>
    <text x="202" y="172" text-anchor="end" fill="#94A3B8" font-size="10.5">[1, 1, 1]</text>

    <rect x="0" y="190" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="210" fill="#CBD5E1" font-family="monospace" font-size="11">materialId</text>
    <text x="202" y="210" text-anchor="end" fill="#94A3B8" font-size="10.5">"mat_oak_wood"</text>

    <rect x="0" y="228" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="248" fill="#CBD5E1" font-family="monospace" font-size="11">color</text>
    <text x="202" y="248" text-anchor="end" fill="#94A3B8" font-size="10.5">#8B5A2B</text>

    <rect x="0" y="266" width="210" height="32" rx="4" fill="#0F172A"/>
    <text x="8" y="286" fill="#CBD5E1" font-family="monospace" font-size="11">collider</text>
    <text x="202" y="286" text-anchor="end" fill="#94A3B8" font-size="10.5">{type: "box"}</text>
  </g>

  <!-- Col 5: Lighting -->
  <line x1="1184" y1="230" x2="1184" y2="270" stroke="#F472B6" stroke-width="2.5"/>
  <rect x="1064" y="270" width="240" height="660" rx="10" fill="#1E293B" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="1064" y="270" width="240" height="6" rx="3" fill="#F472B6"/>
  <text x="1084" y="306" fill="#F1F5F9" font-size="16" font-weight="700">💡 lighting</text>
  <rect x="1224" y="292" width="60" height="18" rx="4" fill="#0F172A"/>
  <text x="1254" y="305" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="monospace">Object</text>
  <line x1="1079" y1="322" x2="1289" y2="322" stroke="#334155" stroke-width="1"/>

  <g transform="translate(1079, 336)">
    <rect x="0" y="0" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="21" fill="#CBD5E1" font-family="monospace" font-size="11">direction</text>
    <text x="202" y="21" text-anchor="end" fill="#94A3B8" font-size="10.5">[0.45, -0.85, 0.35]</text>

    <rect x="0" y="42" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="63" fill="#CBD5E1" font-family="monospace" font-size="11">intensity</text>
    <text x="202" y="63" text-anchor="end" fill="#F472B6" font-weight="700" font-size="11">1.25 lx</text>

    <rect x="0" y="84" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="105" fill="#CBD5E1" font-family="monospace" font-size="11">color</text>
    <text x="202" y="105" text-anchor="end" fill="#94A3B8" font-size="10.5">#FFF1DD</text>

    <rect x="0" y="126" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="147" fill="#CBD5E1" font-family="monospace" font-size="11">ambientColor</text>
    <text x="202" y="147" text-anchor="end" fill="#94A3B8" font-size="10.5">#303242</text>

    <rect x="0" y="168" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="189" fill="#CBD5E1" font-family="monospace" font-size="11">shadowSoftness</text>
    <text x="202" y="189" text-anchor="end" fill="#94A3B8" font-size="10.5">0.75</text>

    <rect x="0" y="210" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="231" fill="#CBD5E1" font-family="monospace" font-size="11">presetId</text>
    <text x="202" y="231" text-anchor="end" fill="#94A3B8" font-size="10.5">"golden_morning"</text>
  </g>

  <!-- Col 6: Reconstruction Score -->
  <line x1="1440" y1="230" x2="1440" y2="270" stroke="#F87171" stroke-width="2.5"/>
  <rect x="1320" y="270" width="240" height="660" rx="10" fill="#1E293B" stroke="#334155" stroke-width="1.5" filter="url(#shadow)"/>
  <rect x="1320" y="270" width="240" height="6" rx="3" fill="#F87171"/>
  <text x="1340" y="306" fill="#F1F5F9" font-size="16" font-weight="700">📊 score</text>
  <rect x="1480" y="292" width="60" height="18" rx="4" fill="#0F172A"/>
  <text x="1510" y="305" text-anchor="middle" fill="#94A3B8" font-size="10" font-family="monospace">Object</text>
  <line x1="1335" y1="322" x2="1545" y2="322" stroke="#334155" stroke-width="1"/>

  <g transform="translate(1335, 336)">
    <rect x="0" y="0" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="21" fill="#CBD5E1" font-family="monospace" font-size="11">overall</text>
    <text x="202" y="21" text-anchor="end" fill="#34D399" font-weight="800" font-size="13">95.8%</text>

    <rect x="0" y="42" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="63" fill="#CBD5E1" font-family="monospace" font-size="11">structure (IoU)</text>
    <text x="202" y="63" text-anchor="end" fill="#94A3B8" font-size="11">97.2%</text>

    <rect x="0" y="84" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="105" fill="#CBD5E1" font-family="monospace" font-size="11">layout</text>
    <text x="202" y="105" text-anchor="end" fill="#94A3B8" font-size="11">96.5%</text>

    <rect x="0" y="126" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="147" fill="#CBD5E1" font-family="monospace" font-size="11">scale</text>
    <text x="202" y="147" text-anchor="end" fill="#94A3B8" font-size="11">94.8%</text>

    <rect x="0" y="168" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="189" fill="#CBD5E1" font-family="monospace" font-size="11">perspective</text>
    <text x="202" y="189" text-anchor="end" fill="#94A3B8" font-size="11">95.0%</text>

    <rect x="0" y="210" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="231" fill="#CBD5E1" font-family="monospace" font-size="11">color</text>
    <text x="202" y="231" text-anchor="end" fill="#94A3B8" font-size="11">96.1%</text>

    <rect x="0" y="252" width="210" height="34" rx="4" fill="#0F172A"/>
    <text x="8" y="273" fill="#CBD5E1" font-family="monospace" font-size="11">material</text>
    <text x="202" y="273" text-anchor="end" fill="#94A3B8" font-size="11">94.5%</text>
  </g>

  <!-- Bottom Sync Badges -->
  <g transform="translate(40, 955)">
    <rect x="180" y="0" width="260" height="28" rx="14" fill="#1E293B" stroke="#334155"/>
    <circle cx="196" cy="14" r="4" fill="#22C55E"/>
    <text x="210" y="18" fill="#CBD5E1" font-size="11" font-weight="600">Unity 3D / Three.js Renderer</text>

    <rect x="470" y="0" width="260" height="28" rx="14" fill="#1E293B" stroke="#334155"/>
    <circle cx="486" cy="14" r="4" fill="#22C55E"/>
    <text x="500" y="18" fill="#CBD5E1" font-size="11" font-weight="600">FastAPI REST &amp; WebSockets</text>

    <rect x="760" y="0" width="260" height="28" rx="14" fill="#1E293B" stroke="#334155"/>
    <circle cx="776" cy="14" r="4" fill="#22C55E"/>
    <text x="790" y="18" fill="#CBD5E1" font-size="11" font-weight="600">PostgreSQL / SQLite Document Store</text>

    <rect x="1050" y="0" width="260" height="28" rx="14" fill="#1E293B" stroke="#334155"/>
    <circle cx="1066" cy="14" r="4" fill="#22C55E"/>
    <text x="1080" y="18" fill="#CBD5E1" font-size="11" font-weight="600">CV Reconstruction Pipeline</text>
  </g>
</svg>
"""

with open(r"d:\DesignVerse\room3dscene_schema_diagram.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)
print("Saved room3dscene_schema_diagram.svg successfully!")
