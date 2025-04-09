# Pokémon Battle Simulator

A simple web app built with **Next.js** and **Tailwind CSS** that simulates a turn-based Pokémon battle using live data from the [PokéAPI](https://pokeapi.co/).

---

## ⚔️ Features

- Choose any two Pokémon from Gen 1–9
- Auto-suggest Pokémon names while typing
- Real-time type effectiveness from attacker to defender
- Turn-based battle simulation with animations and health bars
- Miss chance based on speed stat (agility)
- Visual battle log and HP updates

---

## 📦 Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PokéAPI**

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔧 Configuration

### next.config.js

Make sure external image domains are allowed:

```js
module.exports = {
  images: {
    domains: ["raw.githubusercontent.com"],
  },
};
```

---

## 📁 Project Structure

```bash
.
├── app/
│   ├── page.tsx               # Main battle page
│   └── hooks/
│       └── useTypeEffectiveness.ts
├── components/
│   ├── PokemonCard.tsx
│   └── PokemonSelector.tsx
├── types/
│   ├── pokemon.ts             # Type declarations for Pokémon data
│   └── battle.ts              # State & Action types for reducer
├── utils/
│   └── battle/
│       ├── handleStartBattle.ts
│       └── simulateTurn.ts
└── public/
    └── fallback.png           # Image used if sprite is missing
```

---

## 🐛 TODO / Improvements

- [ ] Add more detailed stat calculation (attack, defense buffs, etc.)
- [ ] Support for moves with status effects
- [ ] Playable PvP mode
- [ ] Background music & sound effects

---

## 🧙‍♂️ Author

Built by [Ralph Joson](https://github.com/ralphjoson)

---
