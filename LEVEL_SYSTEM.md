# ⭐ DesignVerse Kids — Level Progression System

## 1. Overview
The DesignVerse Kids Level System controls the pedagogical gating and unlocks of all 3D/2D tools. There are no "Basic" or "Professional" toggles. Every child progresses naturally through 10 levels from Beginner to Young Designer.

## 2. Level Thresholds & Unlocks Table

| Level | Title | Badge | XP Required | Key Tool Unlocks |
| :---: | :--- | :---: | :---: | :--- |
| **1** | 🌱 My Room | `🌱` | 0 XP | Room exploration, Object selection, Guided camera |
| **2** | 🪑 Furniture Friends | `🪑` | 100 XP | Furniture catalog, Add furniture, Move objects |
| **3** | 🎨 Color World | `🎨` | 250 XP | Color swatches, Wall colors, Furniture colors |
| **4** | 🔷 Shapes & Space | `🔷` | 450 XP | Move, Resize, Basic positioning |
| **5** | 📐 Smart Space | `📐` | 700 XP | Rotate, Grid snap, Collision warnings, 0.9m clearance |
| **6** | 🏠 My First Room | `🏠` | 1,050 XP | Full room builder, Room types, Decorations |
| **7** | 💡 Design Explorer | `💡` | 1,500 XP | Material selector, Lighting modes, Style presets |
| **8** | 🗺️ Floor Plan Explorer | `🗺️` | 2,100 XP | 2D floor planner, Wall drawing, Furniture stamps |
| **9** | 🌍 2D to 3D Magic | `🌍` | 2,800 XP | 2D-to-3D converter, AI understanding, Walkthrough |
| **10**| 👑 Young Designer | `👑` | 3,600 XP | ALL DESIGN TOOLS, Master graduation badge |

## 3. Server Enforcement
Level progression is calculated strictly on the backend (`XPEngine.compute_level(total_xp)`). The client UI cannot arbitrarily override levels.
