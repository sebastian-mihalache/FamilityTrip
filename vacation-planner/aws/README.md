# Deploy în AWS

Varianta recomandată pentru început, mai ales cu credit de test:

1. Frontend static în AWS Amplify Hosting.
2. Backend AI minim prin Lambda + API Gateway HTTP API.
3. Cheia AI stă numai în Lambda, nu în browser și nu în Git. Template-ul actual folosește Gemini ca provider implicit.
4. Aplicația folosește în continuare endpointul `/api/ai-suggestions`.

Evită pentru prima versiune EC2, NAT Gateway, load balancer sau baze de date. Nu ai nevoie de ele încă și pot consuma creditul fără să aducă valoare aplicației.

## 1. Frontend

### Varianta rapidă, din consolă

1. Deschide AWS Amplify.
2. Alege `Deploy without Git provider` sau `Manual deploy`.
3. Încarcă arhiva `vacation-planner-amplify.zip` din rădăcina proiectului.
4. După deploy, copiază URL-ul aplicației, de forma `https://main.xxxxxx.amplifyapp.com`.

### Varianta mai bună, din Git

1. Pune proiectul într-un repo GitHub/GitLab/Bitbucket.
2. În Amplify, conectează repo-ul.
3. Amplify poate folosi `amplify.yml`; nu există build step, doar publică `index.html`, `styles.css` și `app.js`.

## 2. Backend AI

1. Deschide CloudFormation.
2. Creează stack nou și încarcă `aws/cloudformation-ai-proxy.yaml`.
3. Alege o regiune apropiată, de exemplu `eu-central-1` sau `eu-west-1`.
4. Completează parametrii:
   - `GeminiApiKey`: cheia providerului AI pentru template-ul curent. Nu o salva în fișiere locale reale.
   - `GeminiModel`: `gemini-2.5-flash` sau modelul configurat pentru provider.
   - `AllowedOrigin`: pentru primul test poți pune `*`; după ce ai URL-ul Amplify, schimbă-l în URL-ul aplicației.
5. La final, intră în tabul `Outputs` și copiază `AiEndpoint`.

Pentru valori exemplu fără secrete reale, vezi `aws/example.env`. Nu copia niciodată o cheie reală în GitHub sau în documentație.

Template-ul creează:

- o funcție Lambda `family-trip-planner-ai-proxy`;
- un API Gateway HTTP API;
- ruta `POST /api/ai-suggestions`;
- ruta `GET /api/fuel-prices` pentru prețuri combustibil online;
- loguri CloudWatch păstrate 14 zile.

## 3. Legarea frontendului la backend

În Amplify, mergi la `Rewrites and redirects` și adaugă regula din `aws/amplify-rewrites.example.json`.

În `target`, înlocuiește:

```text
https://YOUR_HTTP_API_ID.execute-api.eu-central-1.amazonaws.com/api/ai-suggestions
```

cu valoarea `AiEndpoint` din CloudFormation.

Important:

- regula pentru `/api/ai-suggestions` trebuie să fie prima, deasupra regulii generale către `/index.html`;
- adaugă și regulile pentru `/api/fuel-prices` și `/api/fuel-prices/`;
- statusul trebuie să fie `200 (Rewrite)`, nu `301` sau `302`;
- adaugă și varianta cu slash final `/api/ai-suggestions/`, ca fallback;
- dacă endpointul răspunde cu `301` către `/api/ai-suggestions/` sau `404` de la S3, rewrite-ul nu este prins încă.

Dacă nu pui rewrite-ul, aplicația tot poate folosi AI-ul, dar va trebui să introduci URL-ul complet în câmpul `Endpoint AI`. Cheia AI rămâne ascunsă în Lambda.

## 3.1 După modificări locale

La fiecare schimbare în fișierele frontend, refă arhiva și redeploy în Amplify:

```bash
zip -j vacation-planner-amplify.zip index.html styles.css app.js
```

Pentru Git deploy, doar faci commit/push; pentru manual deploy trebuie reîncărcat zip-ul.

## 4. Cost control

- Setează un AWS Budget la 5-10 USD/lună cât timp testezi.
- Folosește doar Amplify Hosting + Lambda + API Gateway pentru prima versiune.
- Nu porni EC2 doar pentru aplicația asta statică.
- Nu lăsa `AllowedOrigin: *` după ce treci de test.
- Pentru producție, mută cheia în Secrets Manager sau SSM Parameter Store; variabila de mediu este ok pentru primul deploy funcțional.
- Revocă imediat orice token/API key care a fost lipit accidental în chat, terminal sau GitHub.

## 5. Test după deploy

1. Deschide URL-ul Amplify.
2. Pune un traseu, de exemplu `Craiova, România -> Durrës, Albania -> Bari, Italia`.
3. Lasă `Mod AI` pe `Endpoint server`.
4. Apasă `Cere sugestii AI`.
5. Dacă primești eroare CORS, verifică `AllowedOrigin` și rewrite-ul din Amplify.

## 6. Prețuri combustibil online

Butonul `Prețuri online` folosește `GET /api/fuel-prices`.

Pentru asta:

1. Actualizează stack-ul CloudFormation cu versiunea curentă a `aws/cloudformation-ai-proxy.yaml`.
2. În Amplify, adaugă rewrite-urile pentru `/api/fuel-prices` din `aws/amplify-rewrites.example.json`.
3. Redeploy frontendul cu arhiva nouă.

Endpointul citește valori medii în EUR de pe Fuelo pentru benzină, diesel și GPL. Țările pentru care nu există date online rămân editabile manual în aplicație.
