# Spin Wheel Demo (Inventory-Controlled)

A high-end, dynamic spin wheel application designed for a 3-day event. This wheel features real-time inventory tracking, equal-probability outcomes, and a code-driven SVG generation system.

## 🚀 Key Features

- **Dynamic SVG Generation**: The wheel segments are built directly from the `sectors` array in the script, allowing for any number of prizes.
- **Inventory Management**:
    - **3-Day Schedule**: Automatically tracks stock for **March 24, 25, and 26, 2026**.
    - **Daily Limits**: Each day starts with a fresh stock of **5 items** per prize type.
    - **Infinite Slots**: Includes "Try Again" and "Thank you for visiting" as non-physical outcomes that always remain available.
- **Fair Selection Logic**: Every available outcome (prize or empty) has an **exactly equal chance (1/9)** of being selected on each spin.
- **Persistence**: Inventory counts are stored in `localStorage`, preserving the state across page refreshes.
- **Premium UI**: 
    - Smooth GSAP-powered animations.
    - Vibrant, uniquely colored segments.
    - Golden-themed design with glassmorphism and modern typography.

## 🛠️ Tech Stack

- **HTML5/CSS3**: Custom structure and premium styling (Gradients, Glassmorphism).
- **JavaScript (Vanilla + jQuery)**: Core logic and dynamic SVG rendering.
- **GSAP (TweenMax)**: High-performance animations and rotation control.

## 📖 How it Works

1. **Initialization**: On load, the system detects the current date. If it falls between March 24-26, it loads the corresponding inventory from `localStorage` (or initializes it with default values).
2. **Dynamic Draw**: The wheel calculates the necessary angles and draws itself based on the `sectors` array.
3. **The Spin**: 
    - When "Start" is clicked, the system picks a winner from items currently in stock.
    - It calculates the precise rotation needed to land the chosen sector under the indicator.
    - After the spin completes, it updates the inventory and saves the state.

## ⚙️ Configuration

You can easily customize the wheel by editing `js/script.js`:
- **Change Prizes**: Modify the `sectors` array.
- **Adjust Inventory**: Update the `inventoryConfig` object.
- **Modify Colors**: Update the `colors` array.

## 👤 Credits

Designed and developed by **Antigravity** (Google Deepmind).
