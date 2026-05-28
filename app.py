import os
from urllib.parse import quote

import streamlit as st

from generator import genereaza_handbook

# Configurarea paginii (cum apare în tab-ul browserului)
st.set_page_config(page_title="DevOps helper", page_icon="🤖")

# Culori sidebar (inclusiv dark): vezi .streamlit/config.toml — nu forțăm fundal deschis prin CSS.

MAX_SHARE_BODY = 1200


def _body_for_share(full_text: str) -> str:
    if len(full_text) <= MAX_SHARE_BODY:
        return full_text
    tail = "\n\n[... trunchiat — pentru tot textul, folosiți „Descarcă fișierul” și atașați .md.]"
    return full_text[: MAX_SHARE_BODY - len(tail)] + tail


def mailto_link(subiect_email: str, body: str) -> str:
    b = _body_for_share(body)
    return f"mailto:?subject={quote(subiect_email)}&body={quote(b)}"


def gmail_compose_link(subiect_email: str, body: str) -> str:
    b = _body_for_share(body)
    return (
        "https://mail.google.com/mail/?view=cm&fs=1&su="
        f"{quote(subiect_email)}&body={quote(b)}"
    )


st.title("🤖 DevOps helper")
st.markdown("""
Acest tool generează ghiduri rapide pentru **Linux, Kubernetes și Terraform**.
Introduceți subiectul și AI-ul va crea un handbook salvat automat local.
""")

# Sidebar pentru istoric (Arhiva)
st.sidebar.header("Arhiva Handbook-uri")
files = [f for f in os.listdir('.') if f.endswith('.md')]
if files:
    selected_file = st.sidebar.selectbox("Vezi fișiere generate:", files)
    if st.sidebar.button("Citește"):
        with open(selected_file, "r") as f:
            st.sidebar.info(f.read())
else:
    st.sidebar.write("Încă nu ai generat niciun fișier.")

# Input principal
subiect = st.text_input("Subiectul dorit (ex: K8s Pod Troubleshooting):", "")

if st.button("Generează și Salvează"):
    if subiect:
        with st.spinner(f"Gemini 2.5 generează handbook-ul pentru {subiect}..."):
            # Chemăm funcția din generator.py
            rezultat = genereaza_handbook(subiect)
            
            # Afișăm pe ecran
            st.markdown("---")
            st.markdown(rezultat)
            
            # Salvăm automat fișierul MD
            nume_fisier = f"{subiect.replace(' ', '_')}.md"
            with open(nume_fisier, "w") as f:
                f.write(rezultat)
            
            st.success(f"✅ Generat cu succes! Fișierul a fost salvat ca: {nume_fisier}")

            titlu_email = f"Handbook DevOps helper: {subiect}"
            c1, c2, c3 = st.columns(3)
            with c1:
                st.download_button("Descarcă fișierul", rezultat, file_name=nume_fisier)
            with c2:
                st.link_button(
                    "Trimite pe email (client)",
                    mailto_link(titlu_email, rezultat),
                    help="Deschide aplicația ta de email implicită; mesajele foarte lungi sunt trunchiate.",
                )
            with c3:
                st.link_button(
                    "Trimite prin link (Gmail)",
                    gmail_compose_link(titlu_email, rezultat),
                    help="Deschide Gmail în browser cu subiect și text precompletate.",
                )
    else:
        st.warning("Te rog să introduci un subiect!")
