## K8s Troubleshooting Handbook: Ghid Rapid pentru DevOps

Acest ghid scurt este conceput pentru experți DevOps care doresc să diagnosticheze și să rezolve rapid problemele comune din cluster-ele Kubernetes.

---

### Cele mai importante 5 comenzi

1.  `kubectl get pods -o wide --all-namespaces`: Vizualizează starea tuturor pod-urilor, nodurile pe care rulează și IP-urile lor.
2.  `kubectl describe pod <pod-name> -n <namespace>`: Oferă detalii complete despre un pod specific, inclusiv evenimente recente, condiții și configurare.
3.  `kubectl logs <pod-name> -n <namespace> --previous`: Afișează log-urile containerului pentru debug, inclusiv cele de la o instanță anterioară a containerului.
4.  `kubectl exec -it <pod-name> -n <namespace> -- bash`: Permite accesul la un shell interactiv în interiorul unui container pentru inspecție directă.
5.  `kubectl get events -n <namespace> --sort-by='.lastTimestamp'`: Listează evenimentele recente dintr-un namespace, esențiale pentru a identifica cauze de eșec.

---

### Fundamentele Troubleshooting-ului K8s

*   **Observă:** Începe întotdeauna prin a obține starea generală. Folosește `kubectl get` pentru `pods`, `deployments`, `services`, `nodes`, `events`.
*   **Descrie:** Comanda `kubectl describe` este cea mai puternică. Verifică în special secțiunea `Events` pentru indicii despre ce nu a funcționat (ex: eșecuri la programare, probleme de imagine, erori la montarea volumelor).
*   **Log-uri:** Log-urile sunt cruciale. Folosește `kubectl logs` pentru a vedea ce se întâmplă în container. Utilizează flag-uri ca `--follow` (pentru log-uri în timp real) sau `--since=5m` (pentru log-uri din ultimele 5 minute).
*   **Execută:** Atunci când log-urile nu sunt suficiente, intră direct în container (`kubectl exec`) pentru a verifica manual fișierele de configurare, starea proceselor, conectivitatea (`ping`, `curl`).

### Scenarii Comune și Soluții Rapide

1.  **Pod-uri în Starea `Pending`**
    *   **Cauze posibile:** Resurse insuficiente (CPU/Memory) în cluster, lipsa nodurilor potrivite (taints/tolerations, node selectors), probleme cu Volume Persistent Claims (PVCs) sau StorageClass.
    *   **Acțiune:** `kubectl describe pod <pod-name>`. Verifică secțiunea `Events` pentru mesaje precum `FailedScheduling`, `No nodes are available that match all of the following predicates`. Verifică `kubectl get nodes` și `kubectl get pvc`.

2.  **Pod-uri în Starea `CrashLoopBackOff` sau `Error`**
    *   **Cauze posibile:** Aplicația din container nu pornește corect, se oprește imediat după pornire, erori de configurare, probe de liveness/readiness configurate greșit, lipsa dependențelor.
    *   **Acțiune:**
        *   `kubectl logs <pod-name>`: Caută erori specifice aplicației.
        *   `kubectl describe pod <pod-name>`: Verifică `ImagePullBackOff` (imagine incorectă sau inaccesibilă), `Readiness/Liveness Probes` (timpi de timeout, căi incorecte).
        *   `kubectl exec -it <pod-name> -- bash`: Rulează comanda de start manual pentru a vedea erorile.

3.  **Serviciu (Service) Inaccesibil**
    *   **Cauze posibile:** Selectorul serviciului nu se potrivește cu etichetele pod-urilor, pod-urile backing sunt down/nefuncționale, probleme de rețea (Network Policies, firewall-uri), port incorect.
    *   **Acțiune:**
        *   `kubectl get svc <service-name> -n <namespace>`: Verifică porturile și tipul serviciului.
        *   `kubectl get ep <service-name> -n <namespace>`: Asigură-te că există Endpoints (IP-uri de pod) asociate serviciului. Dacă nu, verifică `selector`-ul din Service și `labels`-urile din Pod-uri.
        *   `kubectl describe svc <service-name>`: Verifică evenimente și configurație.
        *   Testează conectivitatea din interiorul clusterului (dintr-un alt pod): `curl <service-name>.<namespace>.svc.cluster.local:<port>`.

4.  **Noduri în Starea `NotReady` sau `Unknown`**
    *   **Cauze posibile:** Daemonul Kubelet nu rulează, probleme de rețea între nod și control plane, resurse epuizate pe nod, probleme hardware.
    *   **Acțiune:**
        *   `kubectl get nodes`: Identifică nodul problematic.
        *   SSH pe nod: Verifică starea serviciilor `kubelet` și `containerd`/`docker`. Inspectează log-urile `journalctl -u kubelet` și `journalctl -u containerd`.
        *   Verifică resursele sistemului: `df -h`, `free -h`, `top`.

5.  **ConfigMaps/Secrets nu sunt Montate sau Utilizate Corect**
    *   **Cauze posibile:** Nume incorect, chei lipsă, montare greșită ca fișiere sau variabile de mediu.
    *   **Acțiune:**
        *   `kubectl get configmap <name>` / `kubectl get secret <name> -o yaml`: Verifică existența și conținutul.
        *   `kubectl describe pod <pod-name>`: Verifică secțiunile `Environment` și `Volumes` pentru a te asigura că sunt referințele corecte.
        *   `kubectl exec -it <pod-name> -- ls /path/to/mount` sau `kubectl exec -it <pod-name> -- env`: Verifică direct în container.

### Best Practices pentru Troubleshooting

*   **Observabilitate:** Implementează monitorizare (Prometheus/Grafana), logging centralizat (ELK Stack/Loki) și tracing (Jaeger/Zipkin). O vizibilitate bună previne problemele.
*   **Probes Adecvate:** Configurează `liveness` și `readiness` probes pentru toate aplicațiile, cu praguri și timeout-uri realiste.
*   **Resurse (Requests & Limits):** Definește `requests` și `limits` pentru CPU și Memorie pentru toate containerelor. Acest lucru ajută scheduler-ul și previne `noisy neighbor` syndrome.
*   **Version Control:** Păstrează toate manifestele K8s (YAML) într-un sistem de control al versiunilor (Git).
*   **Testare Continuă:** Integrează testele în pipeline-ul CI/CD pentru a detecta problemele devreme.
*   **Documentație:** Documentează arhitectura clusterului, procesele de deployment și procedurile comune de troubleshooting.

Acest ghid este un punct de plecare rapid. Adâncimea investigației depinde de complexitatea problemei și a aplicației.