# App vers1

Prototype local pentru planificarea concediilor de familie.

## Ce face acum

- Calculează km, combustibil, taxe, bac, cazare și buget de mâncare.
- Estimează automat km/ore pentru orașe introduse liber.
- Afișează hartă reală OpenStreetMap cu linia traseului calculat.
- Detectează automat țările de tranzit din geometria rutei live, nu din trasee prestabilite.
- Propune variante de coridor, inclusiv prin Ungaria/Slovenia, Serbia/Croația/Slovenia și variante cu bac.
- Permite puncte intermediare și segmente de bac pe traseu.
- Permite lipirea unui traseu complet cu puncte intermediare separate prin săgeți, linii noi sau `;`.
- Include comutator RO/EN pentru interfața principală și mod light/dark.
- Trasează separat drumul auto și bacul pe hartă.
- Include panou AI cu endpoint server pentru sugestii de locuri de văzut, fără API key în browser după deploy.
- Poate folosi un endpoint server-side `/api/ai-suggestions`, ca API key-ul să stea în AWS, nu în browser.
- Compară auto direct, auto cu oprire, auto + bac și avion + transfer.
- Permite alegere combustibil: benzină, diesel, GPL sau electric.
- Calculează combustibil și taxe pe țări de tranzit, cu valori editabile.
- Poate actualiza online prețurile pentru benzină, diesel și GPL prin endpoint server.
- Estimează taxele de drum pe țări: rovinietă/vignetă sau €/km pe autostrăzi taxate.
- Descarcă un JSON cu prețuri combustibil, taxe și structura curentă de traseu.
- Propune opriri pe traseu, zone de văzut și cazări candidate.
- Generează un plan pe zile și exportă scenariul în JSON.
- Rulează local pentru funcțiile de bază; harta/rutele folosesc servicii publice, iar AI-ul folosește endpoint server după deploy.

## Cum îl deschizi

Deschide `index.html` în browser sau servește folderul cu orice server static.

## Deploy AWS

Vezi pașii din `aws/README.md`. Pe scurt: Amplify Hosting pentru frontend și CloudFormation pentru Lambda + API Gateway, astfel încât cheia Gemini să rămână în AWS.

## Următorul pas bun

Adăugarea unor conectori reali:

- rute și timpi: Google Routes API sau openrouteservice;
- cazări: API/affiliate pentru availability și prețuri;
- zboruri: Amadeus Flight Offers;
- ferry: furnizor B2B/affiliate unde există acces.
