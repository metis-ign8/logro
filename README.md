OPS | MARXIA | PERSONAL CHATBOT – INSTRUCTION MANUAL
Unified Secure Chatbot System – Built for Cloudflare + GitHub + Local VM

STEP 1 — CREATE LOCAL TEMPLATE PROJECT
--------------------------------------
1. Open your terminal and run:

   mkdir unified-chatbot-template
   cd unified-chatbot-template

2. Create folder structure:

   mkdir -p src/workers src/utils src/bots/ops src/bots/marxia src/bots/personal public/styles models

3. Create base files:

   touch src/chatbot-worker.js
   touch src/llm-router.js
   touch src/utils/common-utils.js
   touch src/bots/ops/config.js
   touch src/bots/marxia/config.js
   touch src/bots/personal/config.js
   touch public/chat-ui.html
   touch public/chat.js
   touch public/styles/chat-ops.css
   touch public/styles/chat-marxia.css
   touch public/styles/chat-personal.css
   touch models/llm-config.js
   touch README.md

You now have a fully modular chatbot project ready to build.

STEP 2 — INITIALIZE GIT AND PUSH TO GITHUB
------------------------------------------
1. Inside the project folder:

   git init
   git add .
   git commit -m "Initial unified chatbot template"

2. Create GitHub repo:

   gh repo create unified-chatbot-template --public --source=. --remote=origin --push

3. Push to GitHub:

   git push -u origin main

STEP 3 — SET UP CLOUDFLARE WORKER ENVIRONMENT
---------------------------------------------
1. Install Wrangler CLI:

   npm install -g wrangler

2. Initialize Worker:

   wrangler init --yes

3. Edit wrangler.toml like this:

   name = "unified-chatbot"
   main = "src/chatbot-worker.js"
   compatibility_date = "2025-07-06"

   [vars]
   BOT_MODE = "dev"  # can be overridden per bot at deploy

   [[kv_namespaces]]
   binding = "CHATBOT_KV"
   id = "your-kv-namespace-id"

4. Save and exit.

STEP 4 — SET UP GITHUB SECRETS PER BOT
--------------------------------------
Go to: GitHub → Repo → Settings → Secrets → Actions

Add the following secrets:

- OPS_RECAPTCHA_SECRET
- MARXIA_FIREBASE_API
- PERSONAL_LLM_PATH
- TINYLLM_API_KEY
- JWT_SECRET

Each bot will reference its own keys in `config.js`.

STEP 5 — DEPLOY EACH BOT TO CLOUDFLARE
--------------------------------------
1. For OPS Bot:

   wrangler publish --name ops-chatbot --env production --vars BOT_MODE="ops"

2. For Marxia Bot:

   wrangler publish --name marxia-chatbot --env production --vars BOT_MODE="marxia"

3. For Personal Bot (local dev or tunnel):

   wrangler dev --vars BOT_MODE="personal"

Optional: Connect Personal Bot via Cloudflare Tunnel to expose local VM.

STEP 6 — LINK UI TO EACH BOT ENDPOINT
-------------------------------------
In your HTML (chat-ui.html or iframe):

<script>
  const botType = "marxia"; // or "ops", "personal"
  const endpoint = `https://your-domain.com/api/chat?bot=${botType}`;
</script>

Your chatbot UI will then interact with the correct backend logic.

STEP 7 — DOCUMENT AND EXTEND
----------------------------
1. In README.md, document:
   - How to add new bots
   - How to secure endpoints
   - How to connect STT / TTS
   - How to override models per bot

2. Future improvements:
   - Add local SQLite encryption for Personal Bot
   - Add Cloudflare R2 for file/audio uploads
   - Add Whisper STT for voice input

TEMPLATE STRUCTURE OVERVIEW
---------------------------
unified-chatbot-template/
├── src/
│   ├── chatbot-worker.js      → Main router based on ?bot= query
│   ├── llm-router.js          → Chooses LLM per bot type
│   ├── utils/
│   │   └── common-utils.js    → Logging, recaptcha, sanitization
│   ├── bots/
│   │   ├── ops/config.js
│   │   ├── marxia/config.js
│   │   └── personal/config.js
├── public/
│   ├── chat-ui.html
│   ├── chat.js
│   └── styles/
│       ├── chat-ops.css
│       ├── chat-marxia.css
│       └── chat-personal.css
├── models/
│   └── llm-config.js
├── wrangler.toml
└── README.md

END OF INSTRUCTION MANUAL
