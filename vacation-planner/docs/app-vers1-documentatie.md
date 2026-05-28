# App vers1 - documentație de predare

Data documentului: 28 mai 2026

## Ce este App vers1

`App vers1` este o aplicație web pentru planificarea concediilor cu familia. Aplicația calculează trasee auto, puncte intermediare, segmente de bac, combustibil, taxe de drum, cazare, buget și sugestii AI pentru locuri de văzut.

Aplicația este gândită ca frontend static, publicabil în AWS Amplify Hosting. Funcțiile care au nevoie de server, cum sunt AI-ul și prețurile online la combustibil, merg prin AWS Lambda + API Gateway.

## Ce am construit

- Rută liberă: plecare, destinație și puncte intermediare.
- Hartă reală OpenStreetMap/Leaflet.
- Rutare live prin OSRM, cu fallback offline.
- Detectare automată a țărilor traversate din geometria rutei live, cu fallback estimativ doar când serviciile externe nu răspund.
- Variante automate de coridor pentru rute relevante, de exemplu România - Italia: prin Serbia/Croația/Slovenia, prin Ungaria/Slovenia sau cu bac prin Durrës.
- Segmente de bac configurabile pe traseu.
- Câmp de traseu complet pentru introducerea rapidă a punctelor intermediare, de exemplu `Craiova -> Timișoara -> Szeged -> Ljubljana -> Bari`.
- Selector RO/EN pentru interfața principală și mod light/dark salvat în browser.
- Calcul costuri pentru combustibil, taxe drum, bac, cazare și mâncare.
- Alegere combustibil: benzină, diesel, GPL, electric.
- Prețuri combustibil online pentru benzină/diesel/GPL prin endpoint server.
- Estimare taxe drum pe țări: rovinietă, e-vignetă sau taxă estimată pe km.
- AI planner simplificat: doar câmpul `Cerere info AI` și butonul `Cere sugestii AI`.
- Rezultat AI afișat într-un panou mare peste pagină.
- Export plan în JSON.
- Footer legal: `Made by SebastiaM @msecur.ro`.
- Arhivă de deploy pentru Amplify.
- Template CloudFormation pentru Lambda + API Gateway.

## Fișiere importante

- `index.html` - structura aplicației.
- `styles.css` - design responsive și stiluri.
- `app.js` - logica aplicației.
- `vacation-planner-amplify.zip` - arhiva care se urcă în Amplify.
- `aws/cloudformation-ai-proxy.yaml` - backend AWS pentru AI și combustibil online.
- `aws/ai-proxy-lambda.mjs` - versiune separată a Lambda-ului, utilă pentru referință/test.
- `aws/amplify-rewrites.example.json` - regulile Amplify pentru `/api/ai-suggestions` și `/api/fuel-prices`.
- `aws/README.md` - pași de deploy AWS.
- `docs/app-vers1-documentatie.md` - acest document.

## Cum rulează local

Din folderul proiectului:

```bash
cd /Users/semihal/vacation-planner
python3 -m http.server 4173
```

Apoi deschizi:

```text
http://127.0.0.1:4173/
```

Exemplu de test:

```text
http://127.0.0.1:4173/?from=Craiova%2C%20Romania&via=Durres%2C%20Albania&to=Bari%2C%20Italy&auto=1
```

Alt exemplu direct:

```text
http://127.0.0.1:4173/?from=Craiova%2C%20Romania&to=Bari%2C%20Italy&auto=1
```

## Cum faci deploy în AWS

### Frontend

1. Intri în AWS Amplify.
2. Alegi aplicația existentă.
3. Faci redeploy manual cu `vacation-planner-amplify.zip`.
4. După deploy faci hard refresh în browser.

### Backend

1. Intri în CloudFormation.
2. Alegi stack-ul existent pentru aplicație.
3. Apeși `Update`.
4. Încarci `aws/cloudformation-ai-proxy.yaml`.
5. La parametri păstrezi `GeminiApiKey` ca existing value, dacă te întreabă.
6. Confirmi update-ul.

### Rewrites în Amplify

Regulile pentru API trebuie să fie deasupra regulii generale către `/index.html`:

```json
[
  {
    "source": "/api/ai-suggestions",
    "target": "https://YOUR_HTTP_API_ID.execute-api.eu-central-1.amazonaws.com/api/ai-suggestions",
    "status": "200"
  },
  {
    "source": "/api/ai-suggestions/",
    "target": "https://YOUR_HTTP_API_ID.execute-api.eu-central-1.amazonaws.com/api/ai-suggestions",
    "status": "200"
  },
  {
    "source": "/api/fuel-prices",
    "target": "https://YOUR_HTTP_API_ID.execute-api.eu-central-1.amazonaws.com/api/fuel-prices",
    "status": "200"
  },
  {
    "source": "/api/fuel-prices/",
    "target": "https://YOUR_HTTP_API_ID.execute-api.eu-central-1.amazonaws.com/api/fuel-prices",
    "status": "200"
  }
]
```

Înlocuiești `YOUR_HTTP_API_ID...` cu endpointurile din CloudFormation Outputs.

## Pași Git pentru început

În prezent proiectul nu era inițial într-un repository Git. Pașii de mai jos îl pun sub control Git și îl leagă de contul tău.

### Prima configurare pe calculator

```bash
git config --global user.name "SebastiaM"
git config --global user.email "adresa-ta-de-email"
```

### Inițializezi proiectul

```bash
cd /Users/semihal/vacation-planner
git init
git add .
git commit -m "App vers1 initial release"
```

### Creezi repository online

În GitHub/GitLab:

1. Creezi un repository nou, de exemplu `app-vers1`.
2. Nu bifezi opțiuni care creează automat README, `.gitignore` sau license, ca să nu ai conflict.
3. Copiezi URL-ul repository-ului.

### Legi repository-ul local de cel online

Pentru HTTPS:

```bash
git remote add origin https://github.com/USER/app-vers1.git
git branch -M main
git push -u origin main
```

Pentru update-uri viitoare:

```bash
git status
git add .
git commit -m "Descriere scurtă modificare"
git push
```

## Flux recomandat pentru update-uri

1. Modifici aplicația local.
2. Testezi pe `http://127.0.0.1:4173/`.
3. Refaci arhiva:

```bash
zip -j vacation-planner-amplify.zip index.html styles.css app.js
```

4. Faci commit:

```bash
git add .
git commit -m "Update App vers1"
git push
```

5. Urcăm arhiva în Amplify sau configurăm Amplify să facă deploy direct din Git.

## Limitări cunoscute

- Prețurile la combustibil sunt medii pe țară, nu prețuri exacte de stație.
- Taxele de drum sunt estimări pe țări, nu calcule exacte pe fiecare barieră/toll gate.
- Pentru tolls exacte pe traseu real ar trebui un API dedicat, de exemplu TollGuru sau alt furnizor de rute cu taxe.
- OSRM/OpenStreetMap și serviciile publice de reverse geocoding sunt servicii externe; pentru producție serioasă poate fi nevoie de provider dedicat.
- Cazările, zborurile și feriboturile sunt estimări/manuale în versiunea 1.

## Următorii pași recomandați

- API dedicat pentru taxe de drum reale pe traseu.
- Furnizor real pentru cazări/prețuri.
- Salvare planuri pe cont utilizator.
- Export PDF frumos pentru itinerar.
- Mod mobil rafinat după testare pe telefon real.
