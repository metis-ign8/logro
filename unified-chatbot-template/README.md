# Unified Secure Chatbot System

This project provides a template for a unified chatbot system designed to be deployed on Cloudflare Workers, with potential integration with GitHub Actions for CI/CD and local virtual machines for development or specialized bot instances.

## Project Structure

```
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
```

## Getting Started

(Instructions for local setup, deployment, etc. will be detailed further)

## Documentation

### How to Add New Bots

1.  **Create Configuration**: In `src/bots/`, create a new directory for your bot (e.g., `src/bots/newbot/`). Inside this directory, add a `config.js` file. This file should export any specific configurations your bot needs, similar to the existing `ops`, `marxia`, and `personal` bot configs.
2.  **Implement Bot Logic**: You might need to add specific logic for your new bot. This could be within its own files in the `src/bots/newbot/` directory or by extending/modifying `chatbot-worker.js` or `llm-router.js` if the routing or LLM selection logic needs to be aware of the new bot type.
3.  **Update Routers**:
    *   Modify `src/chatbot-worker.js` to handle requests for your new bot (e.g., based on a `?bot=newbot` query parameter).
    *   If your bot uses a different LLM or requires special LLM handling, update `src/llm-router.js`.
4.  **UI (Optional)**: If your bot requires a unique UI or styling, create corresponding CSS files in `public/styles/` (e.g., `chat-newbot.css`) and potentially update `public/chat-ui.html` or `public/chat.js` if UI changes are significant.
5.  **Deployment**: Update your Cloudflare deployment scripts or `wrangler.toml` if necessary to support deploying this new bot, potentially with its own environment variables or build steps.

### How to Secure Endpoints

*   **Cloudflare Access/Zero Trust**: Protect your worker endpoints using Cloudflare Access policies to restrict who can reach them (e.g., based on IP, geography, identity).
*   **reCAPTCHA/Turnstile**: Implement Cloudflare Turnstile or Google reCAPTCHA (as hinted in `common-utils.js` and `OPS_RECAPTCHA_SECRET`) to protect against bot abuse. This should be integrated into the `chatbot-worker.js` or specific bot handlers.
*   **JWT/Token Authentication**: For bots requiring user authentication, implement JWT (JSON Web Token) validation. The `JWT_SECRET` suggests this capability. Tokens would be issued by an authentication service and validated by the worker.
*   **Input Sanitization**: Ensure all user inputs are rigorously sanitized (as hinted in `common-utils.js`) to prevent injection attacks (XSS, etc.).
*   **Environment Variables for Secrets**: Use environment variables (via Wrangler secrets and GitHub secrets) for all API keys, secret keys, and sensitive configuration. Do not hardcode them.
*   **Rate Limiting**: Configure rate limiting on your Cloudflare worker to prevent denial-of-service or brute-force attacks.

### How to Connect STT / TTS

*   **Speech-to-Text (STT)**:
    1.  Choose an STT service (e.g., Cloudflare Automatic Speech Recognition, Google Speech-to-Text, AssemblyAI, Whisper locally or via API).
    2.  On the client-side (`public/chat.js`), capture audio input using the browser's `MediaRecorder` API.
    3.  Send the audio data (e.g., as a Blob or base64 encoded string) to a new endpoint on your `chatbot-worker.js`.
    4.  This worker endpoint will then forward the audio data to your chosen STT service.
    5.  Receive the transcribed text and pass it to the bot's input processing logic.
    6.  The `TINYLLM_API_KEY` might be for a service that includes STT, or Whisper STT is mentioned as a future improvement.
*   **Text-to-Speech (TTS)**:
    1.  Choose a TTS service (e.g., Cloudflare Text-to-Speech, Google Text-to-Speech, ElevenLabs).
    2.  After the bot generates a text response, send this text to an endpoint on your `chatbot-worker.js` (or directly from the worker if preferred).
    3.  This endpoint will call the TTS service to convert the text to audio.
    4.  The TTS service will return an audio stream/file.
    5.  On the client-side (`public/chat.js`), use an `<audio>` element or the Web Audio API to play back the received audio.

### How to Override Models Per Bot

1.  **LLM Configuration (`models/llm-config.js`)**: This file should define the available LLM configurations, potentially mapping model names or identifiers to their API endpoints, access details, or specific parameters.
2.  **Bot Configuration (`src/bots/<botname>/config.js`)**: Each bot's `config.js` can specify its preferred LLM or model identifier. For example:
    ```javascript
    // src/bots/marxia/config.js
    export const botConfig = {
        llmModel: "gpt-4-turbo", // Specific model for Marxia
        // ... other configs
    };
    ```
3.  **LLM Router (`src/llm-router.js`)**: This file will be responsible for selecting the appropriate LLM based on the current bot type (`BOT_MODE` or a query parameter).
    *   It should read the `botConfig` for the active bot.
    *   It should then use the `llmModel` (or similar property) from the bot's config to select and initialize the correct LLM client or parameters from `models/llm-config.js`.
    *   If a bot's config doesn't specify a model, a default model from `llm-config.js` can be used.
    *   The `PERSONAL_LLM_PATH` and `TINYLLM_API_KEY` suggest that different bots might use entirely different LLM backends or paths.

## Future Improvements (from Manual)

*   Add local SQLite encryption for Personal Bot
*   Add Cloudflare R2 for file/audio uploads
*   Add Whisper STT for voice input
