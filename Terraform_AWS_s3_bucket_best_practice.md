## Handbook Terraform AWS S3 Bucket: Cele Mai Bune Practici DevOps

Acest ghid concis îți oferă cele mai bune practici esențiale pentru gestionarea sigură și eficientă a bucket-urilor AWS S3 folosind Terraform.

---

### Cele mai importante 5 comenzi

1.  **`terraform init`**: Inițializează directorul de lucru Terraform, descarcă provideri și configurează backend-ul pentru starea Terraform.
2.  **`terraform plan`**: Generează și afișează un plan de execuție, arătând modificările propuse fără a le aplica.
3.  **`terraform apply`**: Execută planul generat, aplicând modificările de infrastructură definite în fișierele Terraform.
4.  **`terraform fmt`**: Formatează automat fișierele de configurare Terraform HCL într-un stil canonic și consistent.
5.  **`terraform validate`**: Verifică sintaxa fișierelor de configurare Terraform și compatibilitatea cu providerii.

---

### Introducere

Gestionarea eficientă și sigură a stocării obiectelor în AWS S3 este crucială. Acest handbook te ghidează prin configurarea bucket-urilor S3 cu Terraform, asigurând conformitatea cu cele mai bune practici din perspectiva unui expert DevOps. Scopul este de a automatiza crearea de bucket-uri robuste, sigure și optimizate pentru costuri.

### Cele Mai Bune Practici Esențiale

#### 1. Securitate prin Design

*   **Criptare (Encryption):**
    *   **Server-Side Encryption (SSE):** Activează întotdeauna criptarea la nivel de server. Recomandat este `aws:kms` pentru control sporit (gestionarea cheilor tale) sau `AES256` pentru simplitate.
    *   *Terraform:* `server_side_encryption_configuration { rule { apply_server_side_encryption_by_default { kms_master_key_id = ... / sse_algorithm = "AES256" } } }`
*   **Blocare Acces Public (Public Access Block):**
    *   Activează TOATE setările `public_access_block` pentru a preveni expunerea accidentală a datelor. Acestea ar trebui să fie `true` implicit, dacă nu există un caz de utilizare *specific* și *justificat* pentru acces public.
    *   *Terraform:*
        ```hcl
        block_public_acls       = true
        block_public_policy     = true
        ignore_public_acls      = true
        restrict_public_buckets = true
        ```
*   **Politici de Bucket și IAM (Bucket Policies & IAM):**
    *   **Principiul Privilegiului Minim (Least Privilege):** Acordă doar permisiunile strict necesare pentru accesul la bucket. Folosește politici IAM granulare și/sau politici de bucket pentru a defini permisiuni.
    *   *Terraform:* Folosește `aws_s3_bucket_policy` pentru politici la nivel de bucket.
*   **Versioning:**
    *   Activează versionarea pentru a proteja datele împotriva ștergerilor accidentale sau suprascrierilor.
    *   *Terraform:* `versioning { enabled = true }`
*   **MFA Delete (Opțional, pentru Securitate Înaltă):**
    *   Pentru bucket-uri critice, configurează MFA Delete pentru a necesita autentificare multi-factor la ștergerea versiunilor de obiecte sau la modificarea stării de versionare.
    *   *Terraform:* Necessită configurare în AWS Console și apoi blocare acces la consola fără MFA.

#### 2. Optimizarea Costurilor

*   **Reguli de Ciclu de Viață (Lifecycle Rules):**
    *   Definește reguli pentru a muta obiectele în clase de stocare mai ieftine (ex: Standard-IA, Glacier) sau pentru a le șterge după o anumită perioadă.
    *   *Terraform:* Utilizează `lifecycle_rule` pentru a automatiza tranzițiile și expirările.

#### 3. Fiabilitate și Durabilitate

*   **Versionare:** (Re-iterat) Pe lângă securitate, versionarea este cheia pentru recuperarea datelor.

#### 4. Observabilitate

*   **Logare Acces (Access Logging):**
    *   Activează logarea accesului pentru a monitoriza cine accesează datele din bucket și când. Log-urile ar trebui să fie trimise într-un bucket separat, dedicat logurilor.
    *   *Terraform:* Utilizează `logging { target_bucket = "..." target_prefix = "..." }`

#### 5. Structură Cod Terraform

*   **Backend S3 pentru Starea Terraform:**
    *   Stochează fișierul de stare Terraform într-un bucket S3 securizat, cu versionare și criptare activate, pentru a permite colaborarea și a preveni pierderea stării.
    *   *Terraform:* Configurarea `backend "s3"` în fișierul `main.tf` sau similar.
*   **Modularizare:**
    *   Creează module Terraform reutilizabile pentru bucket-uri S3, permițând consistență și reducând duplicarea codului.
*   **Tagging:**
    *   Folosește tag-uri consistente pentru bucket-uri (ex: `Environment`, `Project`, `Owner`) pentru organizare, cost management și automatizare.

### Exemplu de Cod Terraform (Minimal, Best Practice)

```hcl
# backend.tf - Stocarea starii Terraform intr-un S3 bucket (exemple)
terraform {
  backend "s3" {
    bucket         = "nume-bucket-stare-terraform-001" # Inlocuieste cu numele real
    key            = "devops/s3-bucket-best-practice.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "nume-tabela-dynamodb-lock" # Optional, pentru blocarea starii
  }
}

# main.tf
resource "aws_s3_bucket" "my_secure_bucket" {
  bucket = "nume-bucket-exemplu-devops-001" # Inlocuieste cu un nume unic global
  acl    = "private" # Restrictive per default

  # Securitate: Criptare Server-Side (SSE-S3)
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  # Securitate: Blocare Acces Public
  # Setarile de public_access_block sunt critice pentru securitate
  # S3 API blocheaza accesul public by default daca acestea sunt omise, dar este mai bine sa le setati explicit.
  # Acestea pot fi gestionate prin resource "aws_s3_bucket_public_access_block" separat
  # sau incluse direct in "aws_s3_bucket" pentru Terraform versions >= 3.0
  # Pentru versiuni mai vechi sau control explicit:
  # resource "aws_s3_bucket_public_access_block" "my_secure_bucket_block" {
  #   bucket                  = aws_s3_bucket.my_secure_bucket.id
  #   block_public_acls       = true
  #   block_public_policy     = true
  #   ignore_public_acls      = true
  #   restrict_public_buckets = true
  # }
  # Pentru simplitate, presupunem Terraform AWS Provider >= v3.x care permite block_public_acls direct
}

# Blocare acces public ca resursa separata (pentru mai multa claritate/flexibilitate)
resource "aws_s3_bucket_public_access_block" "my_secure_bucket_block" {
  bucket = aws_s3_bucket.my_secure_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Versionare pentru recuperare si audit
resource "aws_s3_bucket_versioning" "my_secure_bucket_versioning" {
  bucket = aws_s3_bucket.my_secure_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Logging (trimitere loguri catre un alt bucket dedicat logurilor)
resource "aws_s3_bucket_logging" "my_secure_bucket_logging" {
  bucket = aws_s3_bucket.my_secure_bucket.id
  target_bucket = "nume-bucket-loguri-s3-001" # Inlocuieste cu un nume real, dedicat logurilor
  target_prefix = "access-logs/${aws_s3_bucket.my_secure_bucket.id}/"
}

# Reguli de ciclu de viata (exemplu: muta obiectele vechi in S3 Intelligent-Tiering)
resource "aws_s3_bucket_lifecycle_configuration" "my_secure_bucket_lifecycle" {
  bucket = aws_s3_bucket.my_secure_bucket.id

  rule {
    id     = "intelligent-tiering"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }

    # Alte reguli, de exemplu, pentru expirare
    # expiration {
    #   days = 365 # Sterge obiectele dupa 365 de zile
    # }
  }
}

# Tagging pentru organizare si cost management
resource "aws_s3_bucket_ownership_controls" "my_secure_bucket_ownership" {
  bucket = aws_s3_bucket.my_secure_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "my_secure_bucket_acl" {
  bucket = aws_s3_bucket.my_secure_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_tagging" "my_secure_bucket_tags" {
  bucket = aws_s3_bucket.my_secure_bucket.id
  tag_set {
    Environment = "Dev"
    Project     = "DevOpsHandbook"
    Owner       = "YourTeam"
  }
}

```

### Sfaturi Cheie

*   **Automatizează Totul:** Orice configurare S3 ar trebui să fie definită în cod (Infrastructure as Code) pentru reproductibilitate și auditabilitate.
*   **Revizuire Cod:** Implementează revizuirea codului pentru fișierele Terraform pentru a detecta erori sau abateri de la cele mai bune practici înainte de deployment.
*   **Immutable Infrastructure:** Tratează infrastructura S3 ca fiind imuabilă; modificările ar trebui să se facă prin actualizarea codului Terraform, nu manual.
*   **Testare:** Testează configurările S3 în medii non-producție înainte de a le implementa în producție.

### Troubleshooting Rapid

*   **Erori de permisiuni (Access Denied):** Verifică politicile IAM ale entității care rulează Terraform și politicile de bucket S3. Asigură-te că există permisiunile necesare (`s3:CreateBucket`, `s3:PutObject`, etc.).
*   **`terraform plan` arată modificări neașteptate:** Rulează `terraform refresh` pentru a sincroniza starea locală cu infrastructura reală AWS. Revizuiește cu atenție planul înainte de `apply`.
*   **Bucket-ul nu este creat/modificat:** Verifică logs-urile CloudTrail în AWS pentru a identifica erori specifice API-ului S3.
*   **Starea Terraform coruptă:** Dacă folosești un backend S3, ai o copie de rezervă a stării. Dacă starea se corupe, încearcă `terraform state pull` pentru a descărca starea și a o inspecta manual, sau `terraform state rm` pentru a elimina resurse orfane.

Acest handbook te echipează cu principiile și instrumentele necesare pentru a gestiona bucket-uri S3 securizate, eficiente și automatizate prin puterea Terraform și a practicilor DevOps.