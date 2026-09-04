"""
app.py
------
Streamlit web app: user uploads a photo, the app predicts which natural
disaster (if any) is shown — Flood, Earthquake, Cyclone, Wildfire, etc.

Run with:
    streamlit run app.py
"""

import json

import numpy as np
import streamlit as st
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image

IMG_SIZE = (224, 224)
MODEL_PATH = "disaster_classifier.keras"
CLASS_NAMES_PATH = "class_names.json"
CONFIDENCE_THRESHOLD = 0.45


@st.cache_resource
def load_model_and_classes():
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(CLASS_NAMES_PATH) as f:
        class_names = json.load(f)
    return model, class_names


def predict(image: Image.Image, model, class_names):
    image = image.convert("RGB").resize(IMG_SIZE)
    arr = np.array(image).astype("float32")
    arr = np.expand_dims(arr, axis=0)
    arr = preprocess_input(arr)

    preds = model.predict(arr, verbose=0)[0]
    ranked = sorted(zip(class_names, preds.tolist()), key=lambda x: x[1], reverse=True)
    return ranked


def main():
    st.set_page_config(page_title="Disaster Type Classifier", page_icon="🌪️")
    st.title("🌪️ Natural Disaster Image Classifier")
    st.write(
        "Upload a photo and the model will guess which natural disaster it "
        "shows (flood, earthquake, cyclone, wildfire, etc.)."
    )

    model, class_names = load_model_and_classes()

    uploaded_file = st.file_uploader(
        "Upload an image", type=["jpg", "jpeg", "png"]
    )

    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded photo", use_container_width=True)

        with st.spinner("Analyzing..."):
            ranked = predict(image, model, class_names)

        top_label, top_conf = ranked[0]

        st.subheader("Prediction")
        if top_conf >= CONFIDENCE_THRESHOLD:
            st.success(f"**{top_label}** ({top_conf * 100:.1f}% confidence)")
        else:
            st.warning(
                f"Best guess: **{top_label}** ({top_conf * 100:.1f}% confidence) "
                "— the model isn't very sure this image shows a disaster."
            )

        st.subheader("All class scores")
        for name, score in ranked:
            st.write(f"{name}: {score * 100:.1f}%")
            st.progress(min(max(score, 0.0), 1.0))


if __name__ == "__main__":
    main()
