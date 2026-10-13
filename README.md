# SignEye 👁️✋
### AI-Powered Real-Time Sign Language Translation & Learning Intelligence Platform

SignEye is an end-to-end, high-performance artificial intelligence platform designed to bridge communication barriers between Deaf, hard-of-hearing, and hearing communities. Running on standard consumer webcams with on-device AI, SignEye transforms American Sign Language (ASL) gestures into text, fluent sentences, and neural speech in real time, while offering an interactive learning studio with kinematic guidance, timed challenge streaks, and 3D joint landmark telemetry.

---

## 📸 Key Features & Modules

1. **Executive Intelligence Dashboard**
   - Live telemetry covering analyzed gestures, detection confidence (99.2%), model inference latency (~1.2 ms), and weekly accuracy trajectory.
   - **3D Neural Visualizer:** Real-time rotating faceted crystal polyhedron and landmark coordinate mesh.
   - **Smart Analytics:** Radial ring charts breaking down vocabulary category distribution (Alphabet 40%, Phrases 35%, Numbers 25%).
   - **AI Assistant:** Instant conversational feedback and personalized posture tips.

2. **Vision Coach & 3D Landmark Inspector** (`/vision`)
   - High-contrast HUD skeleton overlay tracking all **21 MediaPipe 3D joint coordinates** per hand.
   - Real-time pipeline metrics: Pipeline FPS, Latency (ms), Index Extension (%), and Thumb-Index Span.
   - Live 3D Joint Coordinate Vector table (X, Y, Z depth) with joint filters (Fingertips, Palm, All).

3. **Live Translation Studio** (`/studio`)
   - Camera frame with HUD corner brackets and scanning reticle.
   - Real-time sign recognition with confidence meter and temporal majority voting filter.
   - Dynamic sentence aggregation, editable grammar transcript, copy, and browser history saving.
   - Speech synthesis with custom playback speed controls.

4. **Kinematic Sentence Builder & Animated Hand Guide** (`/sentence-builder`)
   - Interactive 3D kinematic hand animation demonstrating finger positions for individual vocabulary words.
   - Side-by-side camera verification with instant similarity scoring (+100 XP rewards).
   - Sign vocabulary palette across Greetings, Common words, Alphabet (A–Z), and Emergency signs.

5. **Learn & Practice with Streak Challenges** (`/learn` & `/practice`)
   - **Streak Hero:** 7-day progress tracker (`🔥 5-DAY STREAK ACTIVE`) to build daily practice habits.
   - Timed gesture challenges with countdown progress bar and XP leveling system.
   - Step-by-step finger instructions, category filters, and expert posture tips.

6. **Communication & Voice Synthesizer** (`/voice`)
   - **Before & After Audio comparison mode.**
   - Dynamic oscillating neon audio waveform visualizer rendered on HTML5 canvas.
   - Text-to-speech engine with custom voice selection, speech rate slider, pitch adjustment, and MP3 export.

7. **In-Browser Sign Classifier Training** (`/train`)
   - Record custom landmark samples directly via webcam with 40-take countdown progress.
   - Private, on-device local storage dataset management without sending video streams to any cloud.

8. **Accessibility & Preferences Center** (`/accessibility` & `/settings`)
   - High-contrast mode, +20% large text scaling, reduced motion, and automatic screen-reader voice announcements.
   - Full keyboard navigation shortcuts (`Tab`, `Space`, `Alt+S`, `Alt+V`, `Esc`).
   - Adjustable model confidence thresholds (50%–95%) and temporal smoothing window (3–15 frames).

---

## 🛠️ Technology Stack & Tools Used

### 1. Frontend & Client-Side Architecture
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components, TypeScript, React 18).
- **Vision AI Engine:** [`@mediapipe/tasks-vision` v0.10.14](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) (Client-side WebAssembly/WebGL hand keypoint detection extracting 21 3D landmarks at 60 FPS).
- **Styling & Design System:**
  - Obsidian dark glassmorphism (`#080a11`, `#0f131f`) with backdrop blurs and glowing borders (`globals.css`).
  - Google Fonts: **Outfit**, **Plus Jakarta Sans**, and **JetBrains Mono**.
  - Accessible theme toggles for Dark/Light, High Contrast, and Text Scaling.
- **Canvas Visualizations:**
  - 3D Polyhedron & Particle Projection (`NeuralVisualizer.tsx`).
  - Kinematic 21-Joint Animated Guide (`AnimatedHand.tsx`).
  - Multi-harmonic Audio Waveform Oscilloscope (`voice/page.tsx`).
- **Client ML & Audio:**
  - In-browser k-Nearest Neighbors (`k-NN`) classifier (`knn.ts`) with normalized 63-dimensional coordinate feature vectors (`features.ts`).
  - Multi-frame temporal smoothing debouncer with majority voting (`smoother.ts`).
  - Web Speech API (`SpeechSynthesisUtterance`).
  - LocalStorage persistence for recorded samples, settings, and translation history (`history.ts`).

### 2. Backend & Database Services
- **Backend Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+) with [Uvicorn](https://www.uvicorn.org/).
- **Validation:** Pydantic v2 data models (`SentenceIn`, schema validation).
- **Database:** SQLite 3 (`signeye.db`) with relational schema (`schema.sql`):
  - `users`: User profiles and timestamps.
  - `signs`: Vocabulary dictionary, categories, and difficulty levels.
  - `predictions`: Live telemetry, confidence scores, and latency.
  - `translations`: Saved sentences, sign sequences, and session IDs.
  - `practice_sessions`, `badges`, `learning_progress`, and `xp_events`.
- **Grammar Aggregator:** Rule-based sentence restructuring service (`backend/services/sentence_builder.py`).

### 3. Machine Learning & Training Pipeline (Offline & PyTorch)
- **Deep Learning Framework:** [PyTorch 2.2+](https://pytorch.org/) (`torch`, `torch.nn`).
- **Neural Network Architecture:** `SignEyeNet` multi-layer perceptron (63 input dimensions $\rightarrow$ Linear(128) $\rightarrow$ BatchNorm $\rightarrow$ ReLU $\rightarrow$ Dropout(0.3) $\rightarrow$ Linear(64) $\rightarrow$ Linear(Classes)).
- **Optimization:** AdamW optimizer (`lr=0.002`, `weight_decay=1e-4`) with Cosine Annealing learning rate scheduling.
- **Dataset Generation:** Synthetic and recorded sample generator (`SignDataset` in `ai/datasets/generator.py`).
- **Computer Vision:** OpenCV (`cv2`) and MediaPipe Python for video capture and offline landmark feature extraction.

---

## 📂 Project Directory Structure

```plaintext
sign-eye/
├── files/
│   ├── ai/                          # Machine learning models and training scripts
│   │   ├── config/signs.json        # Vocabulary configuration (Alphabet + Words)
│   │   ├── datasets/                # Synthetic & recorded landmark datasets
│   │   ├── models/                  # PyTorch model definitions & weights (.pt)
│   │   ├── preprocessing/           # Landmark normalization & feature extraction
│   │   └── training/train.py        # Model training loop & validation
│   ├── backend/                     # FastAPI backend services
│   │   ├── api/                     # REST API routes
│   │   ├── database/                # SQLite connection & schema.sql
│   │   ├── services/                # Sentence builder & business logic
│   │   └── main.py                  # FastAPI app entry point & CORS configuration
│   ├── frontend/                    # Next.js 14 web application
│   │   ├── app/
│   │   │   ├── accessibility/       # Assistive technology & display contrast
│   │   │   ├── analytics/           # Accuracy & vocabulary charts
│   │   │   ├── history/             # Saved translation logs
│   │   │   ├── learn/               # Step-by-step gesture lessons
│   │   │   ├── practice/            # Timed challenge streaks & XP leveling
│   │   │   ├── sentence-builder/    # Kinematic guide & sentence aggregator
│   │   │   ├── settings/            # AI thresholds & storage management
│   │   │   ├── studio/              # Live translation studio
│   │   │   ├── train/               # In-browser sign sample recorder
│   │   │   ├── vision/              # 21-joint skeleton telemetry HUD
│   │   │   ├── voice/               # Audio waveform & speech synthesizer
│   │   │   ├── globals.css          # Executive obsidian dark design system
│   │   │   ├── layout.tsx           # Root layout & font injection
│   │   │   └── page.tsx             # Executive AI Intelligence Dashboard
│   │   ├── components/
│   │   │   ├── AnimatedHand.tsx     # 21-joint animated hand kinematics canvas
│   │   │   ├── CameraPanel.tsx      # WebRTC camera capture & MediaPipe loop
│   │   │   ├── NeuralVisualizer.tsx # 3D rotating crystalline polyhedron canvas
│   │   │   └── Shell.tsx            # Left navigation sidebar & header bar
│   │   ├── lib/                     # Client k-NN, smoothing, and feature extractors
│   │   └── package.json             # Frontend dependencies
│   ├── tests/                       # Pytest unit and integration test suite
│   ├── requirements.txt             # Python backend dependencies
│   ├── signeye.db                   # SQLite relational database
│   └── README.md                    # Primary documentation
```

---

## 🚀 Getting Started & Running Locally

### 1. Prerequisites
- **Node.js** (v18.17 or higher) & **npm**
- **Python** (v3.10 or higher) with `pip`
- Modern web browser (Chrome, Edge, Firefox, or Safari) with webcam access

### 2. Backend Setup
```bash
# Navigate to the project files directory
cd files

# Create and activate Python virtual environment
python -m venv .venv

# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn backend.main:app --reload --port 8000
```
*API health check available at:* `http://localhost:8000/api/health`

### 3. Frontend Setup
```bash
# Navigate to the frontend directory
cd files/frontend

# Install node dependencies
npm install

# Start Next.js development server
npm run dev
```
*Application available at:* `http://localhost:3000`

### 4. Running Backend Tests
```bash
cd files
pytest tests
```

---

## 🔮 What Needs to be Improved (Roadmap & Next Steps)

While SignEye provides a solid real-time foundation and a sleek UI, the following improvements are recommended for production-grade maturity:

### 1. Dynamic Gesture Recognition & Temporal Sequence Modeling (LSTM / Transformers)
- **Current Limitation:** The current classifier operates on static keyframe snapshots (21 points per hand). Signs that inherently involve motion (e.g., the letter `J`, `Z`, or moving verbs like `COME`, `GO`) cannot be captured reliably by single-frame k-NN.
- **Improvement:** Implement temporal sequence models (such as **Bidirectional LSTM**, **Temporal Convolutional Networks (TCN)**, or **Lightweight 1D Transformers**) over a sliding temporal buffer of 30–60 consecutive frames to classify dynamic gestures and motion paths.

### 2. Two-Handed & Holistic Pose/Facial Landmark Tracking
- **Current Limitation:** The vision pipeline currently focuses on single-hand landmarks.
- **Improvement:** 
  - Upgrade to **MediaPipe Holistic** to capture two hands simultaneously (essential for two-handed signs such as `HELP`, `FAMILY`, `BOOK`).
  - Incorporate upper-body pose landmarks (shoulders, elbows) and facial expression landmarks (eyebrow raise, mouth morphemes), which are grammatically essential in natural ASL for asking questions and expressing emotion.

### 3. Natural Language Processing for ASL-to-English Grammar Translation
- **Current Limitation:** The sentence builder currently uses basic token concatenation with simple rule-based duplicate suppression. ASL has a topic-comment grammatical structure (e.g., `"STORE I GO"` instead of `"I am going to the store"`).
- **Improvement:** Integrate a lightweight Sequence-to-Sequence (Seq2Seq) model (e.g., quantized **T5** or **BART**) or a specialized local LLM endpoint to translate raw sign glosses into grammatically fluent, conversational English sentences.

### 4. Backend Authentication & Cloud Progress Synchronization
- **Current Limitation:** User XP, streak counts, custom trained sign samples, and translation logs are stored inside the browser's `localStorage`.
- **Improvement:** Connect the frontend directly to the existing SQLite/PostgreSQL schema via authenticated JWT endpoints (`/api/auth`, `/api/progress`, `/api/sync`) so users can log in, sync datasets across devices, and participate in community leaderboards.

### 5. Large-Scale Real-World Dataset Pre-Training
- **Current Limitation:** The offline model relies on synthetic generator algorithms and custom takes.
- **Improvement:** Train and benchmark `SignEyeNet` on recognized public ASL benchmark datasets (such as **WLASL** - Word-Level American Sign Language, **MS-ASL**, and **ChicagoFSWild**) to ensure high resilience across varied skin tones, lighting conditions, hand sizes, and background noise.

### 6. Native Audio Recording & Real MP3 Generation
- **Current Limitation:** The voice synthesizer uses the browser's speech synthesis engine, simulating MP3 download actions.
- **Improvement:** Implement Web Audio API `AudioContext` media recording and WASM encoders (such as `lamejs`) to allow users to export true `.mp3` / `.wav` audio files directly from recognized signs.

### 7. Progressive Web App (PWA) & Mobile Optimization
- **Current Limitation:** Optimized primarily for desktop browser layouts.
- **Improvement:** Add service workers, manifest configuration, and touch-optimized controls for mobile PWA usage. Optimize MediaPipe WASM execution to sustain 30+ FPS on mobile iOS/Android devices without overheating or draining battery.

### 8. Video Conferencing Extension / WebRTC Live Captioning
- **Current Limitation:** Translations are contained within the SignEye web application.
- **Improvement:** Build a Chrome Extension or WebRTC virtual camera bridge that acts as a real-time sign language interpreter directly inside Google Meet, Zoom, or Microsoft Teams calls.

---

## 📄 License & Attribution
Developed with precision for accessible communication. Powered by Google MediaPipe, PyTorch, FastAPI, and Next.js.
