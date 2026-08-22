# Building a virtual assistance system from scratch

Project developed at Machine Learning Specialist Training Bootcamp, under the guidance of specialist [Diego Renan](https://github.com/diegobrunoDIO "Diego Renan").

This project involves developing a virtual assistant system using **NLP (Natural Language Processing)** and the libraries introduced during the course. The system must meet the following requirements:

- A text-to-speech module;
- A speech-to-text module (converting human natural language into text);
- The second module must trigger automated functions via voice commands, such as: opening a Wikipedia search, opening YouTube, or displaying the location of the nearest pharmacy.

You may use any of the libraries introduced in the course to complete this project, particularly the Python SpeechRecognition library.

## Features

- **Backend (Python)**: Optional local Python scripts and a lightweight Flask endpoint used to run SpeechRecognition/gTTS examples and perform local NLP processing.
- **Speech to text** using the browser Web Speech API (SpeechRecognition).
- **Text to speech** using the browser `speechSynthesis` API.
- **Theme toggle** with moon/sun icons; default is dark.
- **Language selector** for EN-US, PT-BR, ES.
- **Quick actions**: open **YouTube** search, open **Wikipedia** search, find nearby pharmacies on **Google Maps**.
- **Accessible**: semantic HTML, ARIA attributes, keyboard shortcuts.
- **Responsive** layout for desktop, tablet and mobile.

## Tecnologies Used

- **Python**: Used for backend scripts, SpeechRecognition examples, gTTS text-to-speech, and optional Flask endpoints for local processing.
- **HTML**: Main HTML file with semantic structure and accessible controls.
- **CSS**: Styles with dark/light themes and responsive layout.
- **JavaScript**: JavaScript logic for speech recognition, synthesis, commands and UI behavior.
- **AI (assistive)**: Used during development to prototype NLP pipelines, intent parsing, and to assist with code examples and testing.

## Browser support and notes

- **SpeechRecognition** is not supported in all browsers. Chrome (desktop and Android) and some Chromium-based browsers provide the best support. If recognition is not available, the UI will still work for typed input and speech synthesis.
- **SpeechSynthesis** is widely supported but voice availability varies by platform and browser.
- No server is required; the project runs as static files. For best results, serve via a local static server (e.g., `npx http-server` or `python -m http.server`) to avoid any browser restrictions.
- The assistant intentionally keeps logic simple. For production use consider:
  - Adding wake-word detection
  - Secure handling of web queries
  - Better error handling and privacy considerations

## Usage

1. Open `index.html` in a modern browser or serve the folder with a static server.
2. Use the language selector to choose a language.
3. Press **Listen** (or Alt+L) to speak; recognized text will appear in the textarea.
4. Press **Speak** (or Alt+S) to read the textarea aloud.
5. Use quick action buttons to open YouTube, Wikipedia, or Maps based on the current input.

## Accessibility

- All interactive elements include ARIA attributes and keyboard focus styles.
- Keyboard shortcuts:
  - **Alt+L**: Start listening
  - **Alt+S**: Speak text
  - **Alt+T**: Toggle theme

### Auxiliary Script

To assist with the project, two examples are available: one for text-to-speech and another for speech-to-text. Both can be found on GitHub via the links below:

- [Text-to-speech](https://github.com/diegobrunoDIO/Text-to-Speech-DIO)
- [Speech-to-text](https://github.com/diegobrunoDIO/Speech-to-text-ML-DIO)

<img width="1452" height="768" alt="virtual_assistant" src="https://github.com/user-attachments/assets/ced7d452-9473-431d-b780-8204e812c3df" />

[LICENSE](/LICENSE)
