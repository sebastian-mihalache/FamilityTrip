# Ghid Rapid DevOps pentru Azure Kubernetes Service (AKS)

Acest handbook scurt este conceput pentru a oferi expertiza esențială DevOps în lucrul cu Azure Kubernetes Service (AKS), concentrându-se pe rapiditate și eficiență.

## Cele mai importante 5 comenzi

1.  `az aks create --resource-group <rg> --name <aks-name> --node-count 1 --generate-ssh-keys`: Creează un nou cluster AKS cu un nod implicit.
2.  `az aks get-credentials --resource-group <rg> --name <aks-name> --overwrite-existing`: Configurează `kubectl` pentru a te conecta la clusterul AKS specificat.
3.  `kubectl get pods -A`: Afișează toate pod-urile din toate namespace-urile pentru a verifica starea generală.
4.  `kubectl apply -f deployment.yaml`: Implementează (sau actualizează) resursele Kubernetes definite într-un fișier YAML.
5.  `kubectl logs <pod-name> -n <namespace>`: Vizualizează log-urile unui pod specific, esențial pentru depanare.

---

### Introducere în AKS pentru DevOps

Azure Kubernetes Service (AKS) simplifică implementarea, gestionarea și operaționalizarea aplicațiilor containerizate. Ca expert DevOps, AKS îți permite să te concentrezi pe dezvoltarea aplicațiilor, nu pe gestionarea infrastructurii Kubernetes, oferind un plan de control (control plane) gestionat de Azure.

### Crearea și Conectarea la un Cluster AKS

**1. Creează un Grup de Resurse:**
```bash
az group create --name myAKSResourceGroup --location westeurope
```

**2. Creează Clusterul AKS:**
```bash
az aks create --resource-group myAKSResourceGroup --name myAKSCluster --node-count 1 --generate-ssh-keys --node-vm-size Standard_B2s
```
_**Notă:** Alege dimensiunea VM-ului (ex: `Standard_B2s`) și numărul de noduri în funcție de cerințe._

**3. Configurează kubectl:**
```bash
az aks get-credentials --resource-group myAKSResourceGroup --name myAKSCluster --overwrite-existing
```
Acum poți folosi `kubectl` pentru a interacționa cu clusterul tău.

### Implementarea unei Aplicații Simple

**1. Creează un fișier `nginx-deployment.yaml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer # Creează un IP public pentru acces extern
```

**2. Implementează Aplicația:**
```bash
kubectl apply -f nginx-deployment.yaml
```

**3. Verifică și Accesează Aplicația:**
```bash
kubectl get services --watch
```
Așteaptă până când `EXTERNAL-IP` pentru `nginx-service` apare. Apoi, poți accesa IP-ul într-un browser.

### Sfaturi DevOps Esențiale pentru AKS

*   **Automatizare CI/CD:** Integrează AKS cu Azure DevOps, GitHub Actions sau GitLab CI/CD pentru implementări automate.
*   **Monitorizare & Logare:** Activează Azure Monitor Container Insights pentru vizibilitate profundă în performanța și log-urile clusterului/aplicațiilor.
*   **Securitate:**
    *   Folosește Azure Active Directory pentru autentificare și RBAC.
    *   Implementează Azure Policy pentru conformitate.
    *   Configurează Network Policies pentru izolarea traficului între pod-uri.
*   **Optimizare Costuri:**
    *   Folosește Cluster Autoscaler pentru a ajusta automat numărul de noduri.
    *   Monitorizează utilizarea resurselor pentru a dimensiona corect pod-urile (`requests` și `limits`).
*   **Upgrades:** Planifică și execută regulat upgrade-uri pentru AKS și versiunile Kubernetes pentru a beneficia de cele mai recente funcționalități, patch-uri de securitate și suport. Folosește `az aks upgrade`.
*   **Managementul Configurării:** Folosește Helm pentru a gestiona și implementa pachete de aplicații complexe.

### Troubleshooting Rapid

*   **Verifică starea generală:** `kubectl get all -A`
*   **Detalii despre o resursă:** `kubectl describe <resource-type> <resource-name> -n <namespace>` (ex: `kubectl describe pod my-pod`)
*   **Log-uri pod:** `kubectl logs <pod-name> -n <namespace>` (adăugă `-f` pentru a urmări log-urile în timp real)
*   **Evenimente cluster:** `kubectl get events -A` (utile pentru a vedea erori de scheduling, trageri de imagini eșuate etc.)
*   **Starea clusterului AKS (Azure):** `az aks show --resource-group myAKSResourceGroup --name myAKSCluster --query provisioningState`

Acest ghid scurt ar trebui să te pună rapid pe drumul cel bun în operarea Azure Kubernetes Service din perspectiva DevOps. Succes!