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
   - `AiProvider`: `gemini`, `openai`, `anthropic` sau `openrouter`.
   - `AiProviderApiKey`: cheia providerului AI pentru template-ul curent. Poate rămâne gol dacă vrei AI dezactivat temporar sau dacă folosești `AiProviderSecretArn`.
   - `AiProviderSecretArn`: opțional, ARN-ul unui secret din AWS Secrets Manager; recomandat pentru producție.
   - `AiModel`: modelul providerului ales, de exemplu `gemini-2.5-flash`.
   - `AllowedOrigin`: pentru primul test poți pune `*`; după ce ai URL-ul Amplify, schimbă-l în URL-ul aplicației.
5. La final, intră în tabul `Outputs` și copiază `AiEndpoint`.

Pentru valori exemplu fără secrete reale, vezi `aws/example.env`. Nu copia niciodată o cheie reală în GitHub sau în documentație.

### Provideri AI suportați

Proxy-ul poate folosi aceeași interfață din aplicație cu mai mulți provideri. Schimbi doar parametrii din CloudFormation sau variabilele din Terraform:

| Provider | `AiProvider` | Exemplu `AiModel` | Cheie |
| --- | --- | --- | --- |
| Google Gemini | `gemini` | `gemini-2.5-flash` | Google AI Studio / Gemini API |
| OpenAI | `openai` | `gpt-4.1-mini` | OpenAI API key |
| Anthropic | `anthropic` | `claude-sonnet-4-20250514` | Anthropic API key |
| OpenRouter | `openrouter` | `google/gemini-2.5-flash` sau alt model din OpenRouter | OpenRouter API key |

Pentru cel mai simplu test rămâi pe `gemini`. Pentru flexibilitate, `openrouter` e interesant fiindcă folosește o singură cheie pentru mai multe modele, dar verifică prețurile fiecărui model înainte să îl lași în producție.

Secretul din Secrets Manager poate fi text simplu, adică doar cheia, sau JSON:

```json
{
  "provider": "openrouter",
  "model": "google/gemini-2.5-flash",
  "apiKey": "pui_cheia_doar_in_aws_nu_in_git"
}
```

### Cum scoți cheia veche din AWS

Dacă backendul este creat cu CloudFormation:

1. Revocă cheia veche din consola providerului AI.
2. În AWS CloudFormation, intră pe stack-ul aplicației.
3. Alege `Update` și încarcă versiunea curentă din `aws/cloudformation-ai-proxy.yaml`.
4. La parametri folosește `AiProviderApiKey`, nu vechiul nume `GeminiApiKey`.
5. Dacă vrei AI oprit temporar, lasă `AiProviderApiKey` și `AiProviderSecretArn` goale și deploy-ul va elimina cheia din variabilele Lambda.
6. După update, verifică în Lambda > Configuration > Environment variables că nu mai apare `GEMINI_API_KEY`.

Pentru producție, varianta mai bună este să creezi un secret în Secrets Manager, să pui ARN-ul la `AiProviderSecretArn` și să lași `AiProviderApiKey` gol. Lambda va primi doar ARN-ul și va citi cheia la runtime.

Dacă treci backendul pe Terraform, nu amesteca Terraform peste aceeași Lambda creată de CloudFormation fără import sau migrare. Creează o Lambda nouă administrată de Terraform sau importă resursele existente în state.

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

Dacă nu pui rewrite-ul, aplicația nu va ajunge la Lambda prin `/api/ai-suggestions`, chiar dacă frontendul se încarcă. Cheia AI rămâne ascunsă în Lambda.

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
3. Deschide tabul `AI`.
4. Apasă `Cere sugestii AI`.
5. Dacă primești eroare CORS, verifică `AllowedOrigin` și rewrite-ul din Amplify.

## 6. Prețuri combustibil online

Butonul `Prețuri online` folosește `GET /api/fuel-prices`.

Pentru asta:

1. Actualizează stack-ul CloudFormation cu versiunea curentă a `aws/cloudformation-ai-proxy.yaml`.
2. În Amplify, adaugă rewrite-urile pentru `/api/fuel-prices` din `aws/amplify-rewrites.example.json`.
3. Redeploy frontendul cu arhiva nouă.

Endpointul citește valori medii în EUR de pe Fuelo pentru benzină, diesel și GPL. Țările pentru care nu există date online rămân editabile manual în aplicație.
