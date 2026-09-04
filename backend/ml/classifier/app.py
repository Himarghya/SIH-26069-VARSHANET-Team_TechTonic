"""
app.py
------
Streamlit web app implementing the full two-stage pipeline:
  1. Is this photo a disaster at all?
  2. If yes, which disaster (flood, earthquake, cyclone, wildfire, ...)?

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
BINARY_MODEL_PATH = "disaster_detector.keras"
MULTICLASS_MODEL_PATH = "disaster_classifier.keras"
CLASS_NAMES_PATH = "class_names.json"

NORMAL_PROB_THRESHOLD = 0.5
TYPE_CONFIDENCE_THRESHOLD = 0.40


@st.cache_resource
def load_models():
    binary_model = tf.keras.models.load_model(BINARY_MODEL_PATH)
    multiclass_model = tf.keras.models.load_model(MULTICLASS_MODEL_PATH)
    with open(CLASS_NAMES_PATH) as f:
        class_names = json.load(f)
    return binary_model, multiclass_model, class_names


def preprocess(image: Image.Image):
    image = image.convert("RGB").resize(IMG_SIZE)
    arr = np.array(image).astype("float32")
    arr = np.expand_dims(arr, axis=0)
    return preprocess_input(arr)


def main():
    st.set_page_config(page_title="Disaster Detection", page_icon="🌪️")
    st.title("🌪️ Disaster Detection System")
    st.write(
        "Upload a photo. The system first checks whether it shows a "
        "disaster at all, then identifies which type."
    )

    binary_model, multiclass_model, class_names = load_models()

    uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded photo", use_container_width=True)
        arr = preprocess(image)

        with st.spinner("Checking for disaster..."):
            p_normal = float(binary_model.predict(arr, verbose=0)[0][0])
            p_disaster = 1.0 - p_normal
            is_disaster = p_normal < NORMAL_PROB_THRESHOLD

        st.subheader("Stage 1: Disaster present?")
        if is_disaster:
            st.success(f"**Disaster detected** ({p_disaster * 100:.1f}% confidence)")
        else:
            st.info(f"**No disaster detected** ({p_normal * 100:.1f}% confidence this is a normal scene)")

        if is_disaster:
            with st.spinner("Identifying disaster type..."):
                preds = multiclass_model.predict(arr, verbose=0)[0]
                ranked = sorted(
                    zip(class_names, preds.tolist()), key=lambda x: x[1], reverse=True
                )
            top_label, top_conf = ranked[0]

            st.subheader("Stage 2: Disaster type")
            if top_conf >= TYPE_CONFIDENCE_THRESHOLD:
                st.success(f"**{top_label}** ({top_conf * 100:.1f}% confidence)")
            else:
                st.warning(
                    f"Best guess: **{top_label}** ({top_conf * 100:.1f}%) "
                    "— type is unclear."
                )

            st.write("All type scores:")
            for name, score in ranked:
                st.write(f"{name}: {score * 100:.1f}%")
                st.progress(min(max(score, 0.0), 1.0))


if __name__ == "__main__":
    main()
