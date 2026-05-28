Absolut! Ca expert DevOps, iată un handbook scurt și la obiect pentru Kubernetes, gândit pentru a fi o referință rapidă și practică.

---

## Kubernetes Handbook pentru Experți DevOps

### Introducere

Kubernetes (K8s) este un sistem open-source de orchestrare a containerelor, esențial în ecosistemul DevOps modern. Facilitează automatizarea deployment-ului, scalarea și managementul aplicațiilor containerizate. Scopul acestui handbook este de a condensa informațiile critice pentru operarea și depanarea eficientă a clusterelor K8s.

### I. Concepte Fundamentale

#### 1. Arhitectura K8s

*   **Control Plane (Master Node):**
    *   `kube-apiserver`: Interfața principală K8s (REST API).
    *   `etcd`: Baza de date distribuită, stochează starea clusterului.
    *   `kube-scheduler`: Alocă Pod-uri pe Noduri.
    *   `kube-controller-manager`: Rulează controllere (Node Controller, Replication Controller etc.).
*   **Worker Nodes (Noduri):**
    *   `kubelet`: Agentul de pe fiecare nod, comunică cu Control Plane.
    *   `kube-proxy`: Menține regulile de rețea pentru Services.
    *   `Container Runtime`: Ex. Docker, containerd, CRI-O (rulează containere).

#### 2. Obiecte Cheie K8s

*   **`Pod`**: Cea mai mică unitate de deploy. Un Pod conține unul sau mai multe containere care partajează resurse (rețea, stocare). **Ephemeral!**
*   **`Deployment`**: Definește cum rulează aplicația (număr de replici, imagine Docker, strategii de update). Gestionează seturi de Pod-uri prin `ReplicaSet`.
*   **`Service`**: Abstracție pentru un set de Pod-uri, oferind o adresă IP stabilă și echilibrare a traficului. Tipuri comune:
    *   `ClusterIP`: Accesibil doar în interiorul clusterului.
    *   `NodePort`: Expune Service-ul pe un port specific pe fiecare Nod.
    *   `LoadBalancer`: Expune Service-ul extern printr-un cloud provider Load Balancer.
*   **`Ingress`**: Gestionează accesul HTTP/S extern la Service-uri în cluster, oferind rutare bazată pe URL/host.
*   **`ConfigMap` / `Secret`**: Stochează configurația non-sensibilă / sensibilă pentru aplicații.
*   **`PersistentVolume` (PV) / `PersistentVolumeClaim` (PVC)**:
    *   `PV`: Resursă de stocare în cluster (NFS, EBS, Azure Disk etc.).
    *   `PVC`: Cerere de stocare de către un Pod. decoupled from the actual storage implementation.
*   **`Namespace`**: Furnizează un scop pentru nume și izolare logică a resurselor.

### II. Operațiuni Esențiale

#### 1. Deployment & Scalare

*   **Creare/Actualizare:** `kubectl apply -f my-app.yaml`
*   **Verificare Stare:** `kubectl rollout status deployment/my-app`
*   **Istoric Rollout:** `kubectl rollout history deployment/my-app`
*   **Scalare Manuală:** `kubectl scale deployment/my-app --replicas=5`
*   **Scalare Automată (HPA):** `kubectl autoscale deployment/my-app --cpu-percent=80 --min=2 --max=10` (necesită Metrics Server)
*   **Rolling Back:** `kubectl rollout undo deployment/my-app`

#### 2. Rețelistică

*   **Expunere Internă:** `kubectl expose deployment my-app --port=80 --target-port=8080` (creează un Service ClusterIP)
*   **Expunere Externă (NodePort):** Modificați Service-ul existent sau creați unul cu `type: NodePort`.
*   **Expunere Externă (Ingress):** Necesită un Ingress Controller (Nginx, Traefik, ALB) instalat. Definește `Ingress` YAML.

#### 3. Stocare

*   Definirea `PersistentVolumeClaim` în YAML.
*   Montarea PVC-ului în Pod:

    ```yaml
    volumeMounts:
      - name: my-storage
        mountPath: /app/data
    volumes:
      - name: my-storage
        persistentVolumeClaim:
          claimName: my-pvc
    ```

### III. Monitorizare & Logging

*   **Metricile Clusterului:** Instalați `Metrics Server` (`kubectl top node`, `kubectl top pod`).
*   **Soluții Populare:**
    *   **Monitorizare:** Prometheus + Grafana.
    *   **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana), Loki + Grafana.
*   **Verificare evenimente K8s:** `kubectl get events --all-namespaces`

### IV. Securitate

*   **RBAC (Role-Based Access Control):** Definește cine (User/Service Account) are permisiunea să facă ce (Role/ClusterRole) pe ce resurse (RoleBinding/ClusterRoleBinding). **Principiul minimului privilegiu!**
*   **Network Policies:** Controlează traficul de intrare/ieșire între Pod-uri.
*   **Image Security:** Scanați imaginile containerelor pentru vulnerabilități.
*   **Secrets Management:** Nu hardcodați secrete în YAML. Folosiți `Secrets`, vault-uri externe sau injectare la runtime.

### V. Troubleshooting (Depanare)

Acesta este nucleul expertizei DevOps în K8s. Urmați o metodologie structurată:

1.  **Identificați Problema:** Care este simptomul? (Aplicația nu răspunde, Pod-ul e în Pending/CrashLoopBackOff etc.)
2.  **Verificați Starea Generală:**
    *   `kubectl get nodes`: Sunt toate nodurile `Ready`?
    *   `kubectl get pods --all-namespaces -o wide`: Există Pod-uri în stări anormale (`CrashLoopBackOff`, `Pending`, `Evicted`)?
3.  **Investigați Resursa Problematică:**
    *   `kubectl describe pod <pod-name>`: Citiți secțiunea `Events`. De ce nu a pornit? Imagini invalide, resurse insuficiente, erori de rețea, erori de configurare?
    *   `kubectl logs <pod-name>` / `kubectl logs -f <pod-name>`: Verificați log-urile aplicației.
    *   `kubectl exec -it <pod-name> -- bash`: Accesați containerul pentru depanare directă (dacă imaginea are bash/shell).
4.  **Verificați Dependențele:**
    *   **Serviciu:** `kubectl describe service <service-name>`. Are Endpoint-uri valide?
    *   **Ingress:** `kubectl describe ingress <ingress-name>`. Rutarea este corectă?
    *   **ConfigMaps/Secrets:** Sunt montate corect? Au valorile așteptate?
    *   **PersistentVolumeClaims:** Sunt legate (`Bound`) la un `PersistentVolume`?
5.  **Verificați Control Plane:**
    *   Dacă multiple Pod-uri/Deployments nu funcționează, problema ar putea fi în Control Plane.
    *   Verificați log-urile componentelor Control Plane (depinde de configurarea clusterului, ex. pe nodul master, în `/var/log/containers/` sau ca Pod-uri statice).
6.  **Rețea:**
    *   Verificați `Network Policies` dacă există probleme de conectivitate între Pod-uri.
    *   `kubectl get networkpolicy -A`
    *   Folosiți Pod-uri `busybox` sau `curl` pentru a testa conectivitatea din interiorul clusterului.

### VI. Bune Practici DevOps în K8s

*   **Infrastructure as Code (IaC):** Toate resursele K8s definite în fișiere YAML controlate prin Git (GitOps).
*   **Immutable Infrastructure:** Nu modificați manual Pod-uri sau Deployments în producție. Actualizați YAML-ul și aplicați modificările.
*   **Health Checks:** Folosiți `livenessProbe` și `readinessProbe` pentru a asigura că aplicația este sănătoasă și gata să primească trafic.
*   **Resource Limits & Requests:** Specificați cererile (`requests`) și limitele (`limits`) CPU/Memory pentru a preveni consumul excesiv și a permite schedulerului să funcționeze optim.
*   **Microservicii și Domenii Bounded Context:** Proiectați aplicații modulare care se integrează bine cu K8s.
*   **CI/CD Integration:** Automatizați construirea imaginilor Docker și deployment-ul în K8s.
*   **Backups:** Asigurați backup-uri regulate pentru `etcd` și `PersistentVolumes`.
*   **Observabilitate:** Integrați monitorizarea, logarea și trasabilitatea de la început.
*   **Namespaces Coerente:** Organizați-vă resursele folosind Namespaces logice (ex: `dev`, `staging`, `prod` sau per-aplicație).

### Concluzie

Kubernetes este un instrument puternic, dar complex. Stăpânirea sa necesită înțelegerea conceptelor fundamentale, exercițiu practic și o abordare metodologică a depanării. Acest handbook este doar un punct de plecare. Continuați să explorați documentația oficială, comunitatea și, cel mai important, să experimentați.

---