# Speech to Text assistant with voice command actions
import os
from datetime import datetime
import webbrowser

import speech_recognition as sr
from gtts import gTTS
import playsound
import pyjokes
import wikipedia
from pygame import mixer

# Optional Windows-only import for emptying recycle bin
try:
    import winshell
except Exception:
    winshell = None

# Get audio from microphone and convert to text
def get_audio():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        r.pause_threshold = 1
        # Adjust for ambient noise
        r.adjust_for_ambient_noise(source, duration=1)
        audio = r.listen(source)
    said = ""
    try:
        said = r.recognize_google(audio)
        print("Heard:", said)
    except sr.UnknownValueError:
        speak("Sorry, I did not get that.")
    except sr.RequestError:
        speak("Sorry, the speech service is not available.")
    return said.lower()

# Convert text to speech and play it
def speak(text):
    tts = gTTS(text=text, lang='en')
    filename = "voice.mp3"
    try:
        os.remove(filename)
    except OSError:
        pass
    tts.save(filename)
    playsound.playsound(filename)

# Play music using pygame mixer
def play_music(song_path):
    mixer.init()
    mixer.music.load(song_path)
    mixer.music.play()

def stop_music():
    mixer.music.stop()

# Respond to recognized commands
def respond(text):
    print("Processing command:", text)
    if 'youtube' in text:
        speak("What do you want to search for on YouTube?")
        keyword = get_audio()
        if keyword:
            url = f"https://www.youtube.com/results?search_query={keyword}"
            webbrowser.open(url)
            speak(f"Here is what I found for {keyword} on YouTube.")
    elif 'search' in text or 'wikipedia' in text:
        speak("What do you want to search for?")
        query = get_audio()
        if query:
            try:
                result = wikipedia.summary(query, sentences=3)
                speak("According to Wikipedia")
                print(result)
                speak(result)
            except Exception:
                speak("Sorry, I couldn't find that on Wikipedia.")
    elif 'joke' in text:
        speak(pyjokes.get_joke())
    elif 'empty recycle bin' in text:
        if winshell:
            winshell.recycle_bin().empty(confirm=False, show_progress=False, sound=True)
            speak("Recycle bin emptied.")
        else:
            speak("Recycle bin operation is only available on Windows.")
    elif 'what time' in text or 'time' in text:
        str_time = datetime.now().strftime("%H:%M %p")
        print(str_time)
        speak(str_time)
    elif 'play music' in text or 'play song' in text:
        speak("Now playing.")
        # Set your music directory here
        music_dir = "C:\\Users\\YourUser\\Music"  # change as needed
        try:
            songs = os.listdir(music_dir)
            if songs:
                song_path = os.path.join(music_dir, songs[0])
                play_music(song_path)
            else:
                speak("No songs found in the music directory.")
        except Exception:
            speak("Could not access the music directory.")
    elif 'stop music' in text:
        speak("Stopping playback.")
        stop_music()
    elif 'exit' in text or 'quit' in text:
        speak("Goodbye. See you next time.")
        exit()
    else:
        speak("Sorry, I don't know that command.")

# Main loop
if __name__ == "__main__":
    speak("Assistant started. I am listening.")
    while True:
        print("Listening...")
        text = get_audio()
        if text:
            respond(text)
