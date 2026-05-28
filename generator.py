import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Configuram clientul sa foloseasca versiunea stabila 'v1'
client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY"),
    http_options={'api_version': 'v1'}
)

def genereaza_handbook(subiect):
    try:
        # Folosim modelul pe care l-am gasit in lista ta
        prompt = f"""Actioneaza ca un expert DevOps. Fa un handbook scurt pentru: {subiect}

Structura obligatorie:
1. La început, imediat după un titlu scurt, include o secțiune intitulată exact **Cele mai importante 5 comenzi** (sau echivalent în engleză dacă subiectul e în engleză).
2. În acea secțiune, listează exact 5 comenzi (una per linie sau numerotate 1–5), cele mai critice pentru subiect, fiecare cu o explicație foarte scurtă (o linie).
3. Abia după această secțiune continuă cu restul handbook-ului (exemple, tips, troubleshooting), păstrând totul concis."""

        raspuns = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return raspuns.text
    except Exception as e:
        return f"A aparut o eroare la generare: {e}"
