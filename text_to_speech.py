# Text to Speech example using gTTS
from gtts import gTTS
from IPython.display import Audio

# Text and language
text_to_say = "How are you doing?"
language = "en"

# Create gTTS object
gtts_object = gTTS(text=text_to_say, lang=language, slow=False)

# Save to file
gtts_object.save("gtts_output.wav")

# Play in a Jupyter/Colab environment
Audio("gtts_output.wav")

# Example: French text
french_text = "Je vais au supermarché"
french_language = "fr"

french_gtts_object = gTTS(text=french_text, lang=french_language, slow=True)
french_gtts_object.save("french_output.wav")
Audio("french_output.wav")
