export const SYSTEM_INSTRUCTIONS_MD = `
# System Instructions: Recreating Noor Music from Scratch

This comprehensive guide outlines the architectural principles, technical requirements, and implementation details necessary to build the "Noor Music" application. This project is a sophisticated AI-driven songwriting platform tailored for the fictional band "Noor".

## 1. Project Vision and Persona

The core of Noor Music is its unique persona. The application is not just a generic lyric generator; it is a specialized tool for a specific group of artists.

### The Band: Noor
Noor is a four-member female ensemble with a rich, interconnected backstory:
- **Miranda Noor [Soprano]:** The primary lyricist and composer. Born in NYC, she is of Indian, Dutch, and American descent. She is married to Annelies Brink. Her musical style is emotionally honest and intricate. She plays a vintage Fender Jazz Bass. **Vocal Specialty: Female Soprano - Ethereal, operatic, High-pitched, High-register, Angelic, Shimmering.**
- **Annelies Brink [Alto]:** A Dutch graphic designer and the grounding presence of the group. She is married to Miranda. Her calm and supportive nature is reflected in her infectious laugh. **Vocal Specialty: Female Alto - Choral, Alt-Rock, raspy husky tone, Deep, Low-mid focused, Gravelly, Haunting.**
- **Fannie de Jong [Mezzo-Soprano]:** A ball of kinetic energy from Utrecht. She is lovers with Emma Vermeer. She plays drums and percussion (Tama kit) and contributes rap and beatboxing. **Vocal Specialty: Female Mezzo-Soprano - Soulful, Rap, wide dramatic vibrato, Controlled, Syncopated, Staccato.**
- **Emma Vermeer [Feminine Contralto]:** A confident and mischievous student from Amsterdam. She is lovers with Fannie. She plays keyboard and synthesizers (vintage Roland Juno-106) and acts as the group's natural leader. **Vocal Specialty: Female Contralto - Bluesy, resonant chest voice, Off-beat, Velvety, Melancholy.**

### Band Member Background & Physicality
- **Age:** Highly youthful, fresh-faced, collegiate appearance matching student-aged young adult women (appearing late-teens/early-twenties), without specifying numerical age numbers in prompts.
- **Physicality:** They are exceptionally athletic, tone, and highly slender well-trained young women, avoiding any mature or heavy/overweight traits. They have small cup sizes.
- **Lifestyle:** They prefer to be barefoot everywhere they go and are not ashamed of their bodies. They frequently visit naturist resorts.
- **Relationships:** While they are two couples (Miranda/Annelies and Fannie/Emma), they behave as a single family, almost a foursome in everything.
- **Interests:** They have no desire to have children and no interest in men. Their bond is deeply sensual rather than purely sexual.

### Musical Identity
The band's sound is a blend of pop, experimental instrumentation, and sapphic themes. They utilize a wide array of instruments, including electric guitars, drums, gongs, synthesizers, bagpipes, and the ancient Crwth, as well as a vast collection of **Ancient Instruments** (Lyre, Aulos, Sistrum, etc.). A signature element of their songwriting is the use of **double entendres**, where innocent words are used with suggestive, often sexual, undertones.

## 2. Technical Stack and Environment

To recreate this application, you must adhere to the following stack:
- **Framework:** React 19 (Functional Components, Hooks).
- **Language:** TypeScript (Strict Mode).
- **Build Tool:** Vite.
- **Styling:** Tailwind CSS 4.0 with a custom "Dark Lavender" theme.
- **Animations:** Motion (motion/react) for all transitions and dialogs.
- **Icons:** Lucide React for a consistent, modern UI.
- **AI SDK:** @google/genai for interacting with Gemini models.

## 3. Core Architecture: Separation of Concerns

The project must maintain a strict layer-based architecture:
- **/src/app/components:** Pure UI logic. Components should be small, specialized, and reusable.
- **/src/app/hooks:** State orchestration. Use custom hooks to manage complex logic like job queues and application state.
- **/src/app/services:** Business logic. Isolate API calls, file I/O, and data processing.
- **/src/constants:** Static configuration. Keep prompts, instructions, and UI constants (instruments, styles) centralized.
- **/src/types:** Global type definitions.

## 4. Key Systems Implementation

### A. The Job Management Engine
The application treats AI interactions as "Jobs". Implement a \`JobService\` that handles:
- **Priority Queue:** Jobs are categorized as Low, Normal, or High priority.
- **Concurrency Control:** Limit active jobs to five to prevent API rate limiting.
- **State Tracking:** Jobs transition through Pending (Yellow), Running (Blue), Done (Green), and Failed (Red) states.
- **Raw Data Capture:** Capture the exact request and response payloads for every job.
- **Auto-Pause:** Implement a pause mechanism that triggers on 429 (Too Many Requests) errors.

### B. Specialized Data Viewers
Noor Music requires several specialized controls for different file types:
- **MarkdownView:** A robust renderer for Markdown content, supporting headers, lists, tables, and image wrapping. It must include export options for MD and PDF.
- **TreeView:** A recursive component for JSON and XML data. It should feature collapsible nodes and a clean, readable layout.
- **ImageView:** An advanced image viewer supporting mouse-wheel zooming (5% to 1000%), drag-to-scroll, and automatic conversion of web images to PNG.
- **TextView:** A simple, fixed-font viewer for plain text files.

### C. UI Layout and Navigation
The interface is divided into four main areas:
- **Header:** Contains the Noor logo, navigation menus (File, Edit, Singers, Settings, Help), and the primary "Generate Song" action.
- **Sidebars:** Two 20vw panels for selecting Instruments (Left) and Styles (Right). These also serve as libraries for project assets.
- **Main Area:** A central workspace that acts as a drop zone for files and displays the current song or selected asset.
- **Status Bar:** Displays real-time job counters, AI status, and system resource monitoring (CPU/MEM).

## 5. AI Prompt Engineering and Instructions

The "Brain" of the application resides in its system instructions.
- **Persona Enforcement:** The AI must be instructed to act as the songwriter for Noor, incorporating the band members' specific roles and relationships. This includes their penchant for **double entendres**—singing about innocent objects (e.g., "beaver", "cock", "pussy", "wood") that can be interpreted sexually.
- **Vocal Styles:** The AI only uses specific singing techniques (Opera, Rap, Yodeling, etc.) if they are explicitly selected in the "Instruments" list. Otherwise, it defaults to the singers' normal voices.
- **Output Constraints:** The AI must return structured JSON containing the title, style, and lyrics. The style MUST always begin with the phrase: **"Female vocal quartet (Soprano, Alto, Mezzo-Soprano, Feminine Contralto)"**.
- **Formatting Rules:** All instructions and tags in the lyrics (e.g., [Verse], [Miranda - Female Soprano - Ethereal]) MUST be in square brackets. Parentheses are forbidden as they interfere with SUNO's rendering.
- **Image Prompt Engineering:** The AI must generate detailed prompts for image generation that:
  - Explicitly mention **four female singers** to prevent gender swapping.
  - Incorporate the **topic of the song** into the scene.
  - Prioritize **physical appearance** (ethnicity, eye color, hair texture) over clothing.
  - Ensure all singers are **barefoot**.
  - Respect the specific ethnicities: **Miranda** (Mixed Race: Indian/Dutch/American), **Annelies**, **Fannie**, and **Emma** (Caucasian/Dutch).

## 6. Styling and UX Guidelines

- **Theme:** Use a dark scheme with a hint of lavender (#0a0a0f background, #a080ff accent).
- **Typography:** Use a reasonably large, readable font (18px base).
- **Contrast:** Ensure all foreground/background pairings meet accessibility standards.
- **Dialogs:** Custom dialogs must be used instead of browser defaults. They should be 95vw/95vh for main actions and 90vw/90vh for nested ones.

## 7. Development Workflow

1. **Initialize:** Set up the Vite/React/TS environment.
2. **Theme:** Configure Tailwind with the lavender palette.
3. **Services:** Build the \`JobService\` and \`AIService\`.
4. **Hooks:** Implement \`useNoorApp\` to tie everything together.
5. **UI:** Build the layout components and specialized viewers.
6. **Integration:** Connect the Gemini API and implement the generation flow.
7. **Refinement:** Add the "Singers" section, Help documents, and final UX polish.

---
*Created by Katje B.V. (Knowledge And Technology Joyfully Engaged)*
`;

export const MANUAL_MD = `
# Noor Music: The Complete User Manual

Welcome to Noor Music, a professional-grade AI songwriting environment designed specifically for the band "Noor". This manual provides everything you need to know to create, manage, and explore the musical world of Noor.

## 1. Introduction to Noor Music

Noor Music is more than just a lyric generator. It is a collaborative space where you can define the musical direction of the band Noor—a group of four talented women with a unique sapphic pop sound. They are particularly fond of **double entendres**, often singing about innocent topics that carry a playful, suggestive subtext. By combining advanced AI with a robust job management system and specialized data viewers, Noor Music allows you to craft intricate songs tailored to the band's specific identity.

## 2. Meet the Band: Noor

Understanding the band members is key to generating the best lyrics.

### Miranda Noor [Soprano]
Miranda is the primary lyricist and composer. She is a Mixed Race (Indian, Dutch, American) woman married to Annelies Brink. She plays a vintage Fender Jazz Bass and is known for her passionate, empathetic storytelling. Her lyrics often explore the subtle complexities of the human heart. **Vocal Specialty: Female Soprano - Ethereal, operatic, High-pitched, High-register, Angelic, Shimmering.**

### Annelies Brink [Alto]
Annelies is a Dutch graphic designer and Miranda's wife. She is the grounding presence of the group, known for her infectious laugh and calm demeanor. She often provides creative problem-solving and digital illustrations for the band's projects. **Vocal Specialty: Female Alto - Choral, Alt-Rock, raspy husky tone, Deep, Low-mid focused, Gravelly, Haunting.**

### Fannie de Jong [Mezzo-Soprano]
Fannie is a ball of kinetic energy from Utrecht. She is lovers with Emma Vermeer. As the group's drummer, she plays a Tama kit with custom decals. She also contributes rap verses and beatboxing, bringing a playful and witty energy to the band's dynamic. **Vocal Specialty: Female Mezzo-Soprano - Soulful, Rap, wide dramatic vibrato, Controlled, Syncopated, Staccato.**

### Emma Vermeer [Feminine Contralto]
Emma is a confident and mischievous student from Amsterdam. She is lovers with Fannie. She plays keyboard and synthesizers, specifically a vintage Roland Juno-106. As the natural leader of the group, she has a keen eye for aesthetics and photography. **Vocal Specialty: Female Contralto - Bluesy, resonant chest voice, Off-beat, Velvety, Melancholy.**

### Band Member Background & Physicality
- **Age:** Highly youthful, fresh-faced, collegiate appearance matching student-aged young adult women (appearing late-teens/early-twenties), without specifying numerical age numbers in prompts.
- **Physicality:** They are exceptionally athletic, tone, and highly slender well-trained young women, avoiding any mature or heavy/overweight traits. They have small cup sizes.
- **Lifestyle:** They prefer to be barefoot everywhere they go and are not ashamed of their bodies. They frequently visit naturist resorts.
- **Relationships:** While they are two couples (Miranda/Annelies and Fannie/Emma), they behave as a single family, almost a foursome in everything.
- **Interests:** They have no desire to have children and no interest in men. Their bond is deeply sensual rather than purely sexual.

## 3. Getting Started: Configuration

### API Key Setup
To use the AI features, you must provide a Gemini API key.
1. Navigate to **Settings > API Key**.
2. A dialog will appear allowing you to select a key from your Google Cloud projects.
3. Once selected, the application will be ready to generate songs.

### Content Rating
In the header, you can select a content rating (G, PG, PG-13, R, NC-17). This guides the AI in its choice of themes and language, ensuring the generated lyrics meet your specific needs.

## 4. The Creative Process

### Selecting Instruments and Styles
Use the sidebars to define your song's foundation:
- **Instruments (Left):** Select from a wide range of instruments. Your choices will be incorporated into the AI's musical direction.
- **Vocal Styles (Top of Left Sidebar):** Toggle specific singing techniques like **Opera**, **Rap**, **Yodeling**, or **Deep Voice**. The AI will only use these styles if they are checked; otherwise, the band will sing in their normal voices.
- **Styles (Right):** Choose genres and sub-genres. These guide the rhythmic and melodic feel of the song.

### Generating a Song
1. Click the **Generate Song** button in the header.
2. Enter a theme or description for your song.
3. The AI will use your selected instruments, styles, and the band's persona to craft unique lyrics.
4. A new job will be added to the queue.

## 5. Managing Jobs

The status bar at the bottom tracks your generation progress:
- **Pending (Yellow):** Jobs waiting in the queue.
- **Running (Blue):** The AI is currently generating your song.
- **Done (Green):** The song is complete and ready to view.
- **Failed (Red):** An error occurred.

### Job Actions
Click any counter in the status bar to see a list of recent jobs.
- **Show:** Open the detailed Job Dialog.
- **Delete:** Remove a job from the queue.
- **Retry:** Re-run a failed job.
- **Speed Up:** Increase a job's priority.

### The Job Dialog
This dialog provides a deep dive into each AI interaction:
- **Result:** View the generated lyrics, image, or data.
- **Original Data:** See the prompt and system instructions used.
- **Error:** View detailed error logs if a job fails.
- **Raw Request/Response:** Inspect the exact payloads sent to and received from the API.

## 6. Working with Assets

### The Library Sidebars
The sidebars also act as a library for your project. You can view, delete, or add assets here.
- **View:** Clicking the "Eye" icon opens the asset in the main area.
- **Delete:** Clicking the "Trash" icon removes the asset from the library.

### Specialized Viewers
- **Markdown:** Used for biographies and help docs. Supports MD and PDF export.
- **Images:** Use the mouse wheel to zoom (5% to 1000%) and drag to scroll.
- **JSON/XML:** Explore data in a collapsible tree structure.
- **Text:** View plain text in a fixed-width font.

### File Operations
- **Load:** Upload song JSON files or images.
- **Save:** Download your current song as a JSON file.
- **Clear:** Reset the environment.
- **Drag & Drop:** Drop files directly onto the main area to add them to your library.

## 7. The Singers Section

Explore the detailed backgrounds of each band member in the **Singers** menu. Each entry features a full-screen display of the singer's portrait and their biography, with text flowing elegantly around the image.

## 8. System Console

For technical users, the **Terminal** icon in the header opens the System Log. Here you can track all application events, errors, and AI interactions in real-time.

---
*Created by Katje B.V. (Knowledge And Technology Joyfully Engaged)*
`;

export const CODE_OVERVIEW_MD = `
# Noor Music: Technical Code Overview

This document provides a detailed technical analysis of the Noor Music codebase, outlining the structures, constants, and architectural patterns used in the application.

## 1. Architectural Overview

Noor Music is built as a highly modular React application, emphasizing a clean separation between UI, state management, and business logic.

### Core Directories
- \`/src/app/components\`: Functional UI components styled with Tailwind CSS.
- \`/src/app/hooks\`: Custom React hooks for state orchestration and service integration.
- \`/src/app/services\`: Singleton services for job management, AI interaction, and logging.
- \`/src/constants\`: Centralized static data, including prompts, instructions, and UI constants.
- \`/src/types\`: TypeScript interfaces and enums for type safety across the app.

## 2. State Management and Hooks

### \`useNoorApp\`
The primary hook that manages the application's global state.
- **Song State:** Tracks the current title, style, and lyrics.
- **Library State:** Manages the \`leftLibrary\` and \`rightLibrary\` items.
- **UI State:** Controls dialog visibility and active selections.
- **Action Handling:** Orchestrates complex actions like file loading, saving, and AI generation.

### \`useJobQueue\`
A bridge between the React UI and the \`JobService\`. It provides a reactive list of jobs and methods to add or manage them.

### \`useLogs\`
Provides access to the application's event log, used by the \`LogDialog\`.

## 3. Core Services

### \`JobService\`
A robust, priority-based task runner.
- **Queue Logic:** Uses an internal array to store pending tasks, ordered by priority (High > Normal > Low).
- **Concurrency:** Manages a pool of active workers (max 5) to process jobs asynchronously.
- **Event Emitter:** Notifies subscribers of job state changes (Pending, Running, Done, Failed).
- **Data Capture:** Automatically captures raw request and response payloads for every AI interaction.

### \`AIService\`
Handles all communication with the Google Gemini API.
- **Model:** Utilizes \`gemini-3-flash-preview\` for its balance of speed and reasoning.
- **System Instructions:** Injects the "Noor" persona and output constraints into every request.
- **Error Handling:** Implements specific handling for 429 errors, triggering the application's auto-pause mechanism.

## 4. Specialized Components

### \`MarkdownView\`
A wrapper around \`react-markdown\` that adds:
- **Toolbar:** Copy to clipboard, Download as MD, and Export to PDF.
- **Styling:** Custom CSS for the \`markdown-body\` class, including support for floating images and responsive tables.
- **Children Support:** Allows rendering custom UI elements (like singer portraits) inside the markdown flow.

### \`ImageView\`
A high-performance image viewer.
- **Zoom Logic:** Implements a custom zoom scale (5% to 1000%) controlled by the mouse wheel.
- **Panning:** Uses a drag-to-scroll mechanism for navigating large images.
- **Conversion:** Automatically converts web-sourced images to PNG format for local download.

### \`TreeView\`
A recursive data explorer.
- **XML Parsing:** Includes a custom utility to convert XML strings into a JSON-compatible object structure using \`DOMParser\`.
- **Collapsible Nodes:** Allows users to drill down into complex data structures.

## 5. Constants and Configuration

### \`INSTRUMENTS\` and \`STYLES\`
Hierarchical data structures used to populate the sidebars. They define the musical vocabulary available to the user and the AI.
- **Vocal Styles:** A special category in the \`INSTRUMENTS\` list that allows users to toggle specific singing techniques (Opera, Rap, Yodeling, etc.). The AI only uses these if they are explicitly selected.

### \`SYSTEM_INSTRUCTIONS\`
The core persona definition for the AI. It includes detailed descriptions of the band members, their roles, relationships, and musical skills.

### \`GENERATE_PROMPT\`
A dynamic prompt generator that combines user input with selected instruments, styles, and content ratings to create a precise instruction for the AI.

## 6. Styling and Theming

The application uses Tailwind CSS 4.0 with a custom theme defined in \`index.css\`.
- **Color Palette:**
  - \`lavender-bg\`: #0a0a0f (Deep space black)
  - \`lavender-surface\`: #151520 (Dark slate)
  - \`lavender-border\`: #2a2a3a (Muted purple)
  - \`lavender-accent\`: #a080ff (Vibrant lavender)
  - \`lavender-text\`: #e0e0f0 (Soft white)
- **Global Styles:** Custom scrollbars, tree view dashed lines, and markdown-body layouts.

## 7. Data Structures

### \`Song\` Interface
\`\`\`typescript
interface Song {
  title: string;
  style: string;
  lyrics: string;
}
\`\`\`

### \`Job\` Interface
\`\`\`typescript
interface Job {
  id: string;
  name: string;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'running' | 'done' | 'failed';
  prompt: string;
  systemInstruction?: string;
  result?: any;
  error?: string;
  rawRequest?: string;
  rawResponse?: string;
  timestamp: number;
}
\`\`\`

---
*License: MIT | Created by Katje B.V.*
`;

export const ABCOUDE_FARM_MD = `
# The Farm Near Abcoude: Noor's Sanctuary

## Introduction
Nestled in the lush, green heart of the Dutch countryside, just outside the charming town of Abcoude, lies Noor's Sanctuary. This sprawling farm is more than just a home for the four singers; it is the creative laboratory, the haven, and the source of comfort from which their art springs. It is a place where industrial modernity meets pastoral tranquility, and where the band prepares for their soaring soprano melodies and intricate compositions. The farm encompasses several acres of protected land, carefully managed to balance the band's need for creative solitude with the natural rhythms of life.

## The Architecture of Creativity

### The Two-Story Homestead
The main house is a masterpiece of cozy functionality. It serves as the primary living space, designed to be spacious enough for all four members yet intimate enough to foster deep collaboration.

#### The Second Floor: Rest and Privacy
This level is dedicated entirely to rest and privacy. It features five bedrooms, each uniquely decorated by the singers themselves.
*   **Bedroom 1 (Miranda & Annelies):** Shared bedroom, decorated with soft, airy fabrics, combined artistic and literary influences, and a shared workspace.
*   **Bedroom 2 (Fannie & Emma):** Shared bedroom, mixing kinetic percussion elements with tech-focused audio hardware workstations.
*   **Bedroom 3 (Guest):** A calm, neutral space designed for comfort.
*   **Bedroom 4 (Guest):** A calm, neutral space designed for comfort.
*   **Bedroom 5 (Guest):** A calm, neutral space designed for comfort.
Two bathrooms are conveniently placed along the quiet hallways, ensuring ease for everyone. One bathroom also holds the combined heavy-duty washing machine and dryer, which they all share.

#### The First Floor: The Hub of Activity
*   **The Kitchen:** The vibrant heart of the house, fully equipped with high-end appliances, a vast island, and a long rustic table for shared meals. This is where Fannie often struggles with burning simple pots of tea.
*   **The Living Room:** A colossally large room with several distinct zones. Each singer has their own designated table and ergonomic chair, allowing them to sit in comfort with their laptops, composing, writing, or designing.
*   **The Wellness Wing:** A serene space designed for relaxation. It features a home spa, complete with a sauna and steam room, with calming views through floor-to-ceiling glass that overlooks the tranquil garden.
*   **The Entertainment Room:** Dedicated to leisure, equipped with four top-tier gaming setups, allowing for late-night multiplayer sessions and stress relief.
*   **The Solarium & Atrium:** A bright, sun-drenched space that serves as an extension of the garden, offering a view inward to the central Atrium, which houses exotic plants and acts as the air-cleansing lungs of the house.

#### The Cellar
This subterranean realm is a treasure trove of the past. It holds old computers, outdated servers, and technological relics. More importantly, it houses the band's critical server infrastructure, which they can orchestrate and monitor remotely.

### The Attic (Vliering)
The *vliering*, or attic, is the band's creative attic. It is a vast, open-plan storage realm packed with canvases, various types of paints, wood blocks, specialized craft paper, and various materials for tactile art projects that often inspire their lyric themes.

### The Sound Studio Barn
Next to the house sits a massive, weathered barn that has been meticulously converted into a professional-grade sound studio. This structure is heavily soundproofed, allowing for unrestrained practice sessions at any hour. It holds all their instruments—the vintage Fender Jazz Bass, synthesizers, acoustic guitar kits, and high-end recording gear. It is where their raw ideas are forged into polished soundscapes.

## The Farmlands (Strict Restriction)
The farmlands are the soul of the property, though they are subject to one immutable law: **Miranda is forbidden to ever enter these farmlands under any circumstances.** Her presence is deemed disruptive, not out of malice, but by long-standing (if unexplained) tradition respected by the other three.

*   **The Stable:** Twelve Lakenvelder Sheep graze here, alongside six Dwarf Goats. They are all female, and the band has developed a caring bond with them.
*   **The Orchard:** A well-tended orchard featuring rows of gnarled apple trees and towering walnut trees, providing seasonal fruits that the band often uses in their own culinary creations.
*   **Agricultural Rotation:** The farm utilizes a systematic crop rotation. A small, rich area is set aside for potatoes, which are rotated every season with golden grains (wheat or barley) and lush green spinach.
*   **The Greenhouse:** A small, specialized glass greenhouse is dedicated to cultivating vibrant, sun-ripened paprikas and flavorful tomatoes.
*   **Wildflower Areas:** Scattered across the farm are several designated zones for rewilding with native Dutch wildflowers, fostering local bee populations and adding vibrant splashes of color to the landscape.

## Shared Living
While the four singers share this idyllic existence, they are thoughtful about managing space. The laundry is centrally managed to maintain efficiency. The household functions as a collective, with responsibilities for maintaining the greenhouse and farmlands split amongst Annelies, Fannie, and Emma, while Miranda handles the high-level digital marketing and web-service management from the comfort of the living room.

This farm is the foundation of Noor’s identity, providing the rhythm for their lives just as they provide the rhythm for their music. It is a sanctuary of industry and peace, constantly evolving to meet the demands of their soaring musical careers and their collective personal needs.
`;
