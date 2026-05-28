Salutare! Ca expert DevOps, îți voi oferi un handbook concis și la obiect despre Linux, focusat pe ce contează cu adevărat pentru automatizare, stabilitate și securitate în mediile noastre. Consideră-l un ghid rapid pentru a naviga și opera eficient pe serverele tale.

---

## Handbook Linux pentru Experți DevOps

### Introducere

Acest handbook este conceput pentru a-ți oferi un set esențial de cunoștințe și comenzi Linux, filtrate prin prisma cerințelor DevOps: automatizare, fiabilitate, scalabilitate și securitate. Nu vom acoperi fiecare detaliu, ci ne vom concentra pe elementele fundamentale care îți permit să construiești, să rulezi și să gestionezi infrastructura eficient.

### 1. Navigare și Managementul Fişierelor

Fundamentul oricărei interacțiuni cu Linux.

*   `pwd`: **P**rint **W**orking **D**irectory - Unde te afli acum.
*   `ls -lah`: **L**i**s**t - Afișează conținutul directorului cu detalii complete (`-l`), incluzând fișiere ascunse (`-a`) și dimensiuni în format lizibil (`-h`).
*   `cd /cale/catre/director`: **C**hange **D**irectory - Navighează între directoare.
    *   `cd ..`: Mergi un director înapoi.
    *   `cd ~`: Mergi în directorul personal (home directory).
*   `mkdir nume_director`: **M**a**k**e **Dir**ectory - Creează un director nou.
*   `rm -rf fisier_sau_director`: **R**e**m**ove - Șterge fișiere sau directoare. **ATENȚIE!** `-rf` este foarte puternic și ireversibil. Folosește cu precauție maximă!
*   `cp sursa destinatie`: **C**o**p**y - Copiază fișiere sau directoare (cu `-r` pentru directoare).
*   `mv sursa destinatie`: **M**o**v**e - Mute (redenumește) fișiere sau directoare.
*   `cat fisier`: **Cat**enate - Afișează conținutul unui fișier. Utila pentru fișiere mici.
*   `less fisier`: Vizualizează conținutul unui fișier pagină cu pagină. Folosește `q` pentru a ieși.

### 2. Permisiuni (Permissions)

Critice pentru securitate și controlul accesului.

*   `chmod [octal|simbolic] fisier_sau_director`: **Ch**ange **Mod**e - Modifică permisiunile.
    *   **Octal:** `chmod 755 script.sh` (rwx r-x r-x) sau `chmod 644 file.txt` (rw- r-- r--).
        *   `4`=read, `2`=write, `1`=execute. Adună-le pentru a obține combinația dorită.
    *   **Simbolic:** `chmod u+x script.sh` (adăugă executare pentru user), `chmod go-w file.txt` (elimină scrierea pentru group și others).
*   `chown user:group fisier_sau_director`: **Ch**ange **Own**er - Modifică proprietarul și/sau grupul.
    *   `chown devops:devops aplicatie/`
*   `sudo`: **S**uper **U**ser **Do** - Execută o comandă ca superutilizator (root).
    *   Configurează `sudoers` (cu `visudo`) pentru a acorda privilegii specifice fără parolă pentru anumite sarcini de automatizare.

### 3. Managementul Pachetilor

Instalarea și gestionarea software-ului.

*   **Debian/Ubuntu (APT):**
    *   `sudo apt update`: Reîncarcă lista de pachete disponibile. **Întotdeauna primul pas!**
    *   `sudo apt upgrade`: Actualizează toate pachetele instalate.
    *   `sudo apt install nume_pachet`: Instalează un pachet.
    *   `sudo apt remove nume_pachet`: Dezinstalează un pachet.
    *   `apt search termen`: Caută pachete.
*   **Red Hat/CentOS/Fedora (YUM/DNF):**
    *   `sudo yum update` sau `sudo dnf update`
    *   `sudo yum install nume_pachet` sau `sudo dnf install nume_pachet`

### 4. Managementul Proceselor și Serviciilor

Monitorizarea și controlul aplicațiilor.

*   `ps aux`: Afișează toate procesele care rulează pe sistem, cu detalii.
*   `top` / `htop`: Monitorizare interactivă a proceselor, utilizării CPU, memoriei. `htop` este mai prietenos.
*   `kill [PID]`: Oprește un proces după ID-ul său (PID).
    *   `kill -9 [PID]`: Forțează oprirea (folosit ca ultimă soluție).
*   `systemctl status nume_serviciu`: Verifică starea unui serviciu (ex: `nginx`, `docker`).
*   `systemctl start nume_serviciu`: Pornește un serviciu.
*   `systemctl stop nume_serviciu`: Oprește un serviciu.
*   `systemctl restart nume_serviciu`: Repornește un serviciu.
*   `systemctl enable nume_serviciu`: Activează un serviciu să pornească la boot.
*   `systemctl disable nume_serviciu`: Dezactivează un serviciu la boot.
*   `systemctl is-active nume_serviciu`: Verifică dacă un serviciu este activ.
*   `journalctl -u nume_serviciu -f`: Urmărește logurile unui serviciu în timp real (`-f` pentru follow).

### 5. Rețea

Diagnosticarea conectivității.

*   `ip a`: Afișează adresele IP ale interfețelor de rețea.
*   `ping destinatie`: Testează conectivitatea la o gazdă (IP sau nume de domeniu).
*   `curl -I URL`: Realizează o cerere HTTP (util pentru testarea API-urilor, web serverelor). `-I` afișează doar headerele.
*   `netstat -tulnp` / `ss -tulnp`: Afișează porturile ascultate (listening ports) și conexiunile active. `ss` este mai nou și mai rapid decât `netstat`.
*   `hostname -I`: Afișează adresa IP a mașinii locale.
*   `sudo ufw status`: Verifică starea firewall-ului UFW (Uncomplicated Firewall) pe Ubuntu.
*   `sudo firewall-cmd --list-all`: Verifică starea firewall-ului `firewalld` pe CentOS/Red Hat.

### 6. Spațiu pe Disc

Monitorizarea resurselor.

*   `df -h`: **D**isk **F**ree - Afișează spațiul liber pe partiții în format lizibil.
*   `du -sh /cale/catre/director`: **D**isk **U**sage - Afișează dimensiunea totală a unui director în format lizibil.
*   `du -h --max-depth=1 /cale/catre/director | sort -rh`: Găsește directoarele cele mai mari.

### 7. Manipularea Textului și Log-uri

Analiza datelor și depanare.

*   `grep "termen_cautat" fisier`: Caută un șir de caractere într-un fișier.
    *   `grep -i "error" /var/log/syslog`: Ignoră case-ul.
    *   `grep -r "pattern" /etc`: Caută recursiv în directoare.
*   `tail -f /var/log/aplicatie.log`: Afișează ultimele rânduri dintr-un fișier și continuă să afișeze rândurile noi pe măsură ce apar (`-f` pentru "follow"). Esențial pentru monitorizarea logurilor în timp real.
*   `head fisier`: Afișează primele rânduri dintr-un fișier.
*   `sed 's/vechi/nou/g' fisier`: **S**tream **Ed**itor - Înlocuiește "vechi" cu "nou" în fișier (fără a modifica fișierul original direct; redirecționează ieșirea).
*   `awk '{print $1, $3}' fisier`: Procesează text pe bază de coloane/câmpuri.

### 8. SSH și Acces la Distanță

Piatra de temelie a administrării remote.

*   `ssh utilizator@adresa_ip_sau_hostname`: Conectare securizată la un server.
*   `ssh-keygen`: Generează perechi de chei SSH (publică/privată). **Obligatoriu pentru securitate și automatizare!**
*   `ssh-copy-id utilizator@adresa_ip`: Copiază cheia publică pe un server remote, permițând autentificarea fără parolă.

### 9. Monitorizare Sistem de Bază

Verificarea rapidă a sănătății sistemului.

*   `uptime`: Cât timp a rulat sistemul, numărul de utilizatori și încărcarea medie.
*   `free -h`: Memoria RAM disponibilă.
*   `dmesg | less`: Mesaje din kernel (utile pentru probleme hardware sau drivere).
*   `vmstat 1`: Raport periodic despre activitatea virtual memory.

### Best Practices DevOps pentru Linux

1.  **Idempotență:** Scrie scripturi și configurații care pot fi rulate de mai multe ori fără efecte secundare neintenționate. Instrumente precum Ansible, Puppet, Chef se bazează pe acest principiu.
2.  **Automatizare:** Aproape orice sarcină repetitivă ar trebui automatizată. Folosește Bash, Python, sau limbajul tău preferat pentru scripting.
3.  **Securitate prin Design:**
    *   **Least Privilege:** Acordă utilizatorilor și serviciilor doar permisiunile absolut necesare.
    *   **Chei SSH:** Folosește autentificarea cu chei SSH și dezactivează autentificarea cu parolă pentru SSH.
    *   **Firewall:** Configurează firewall-ul (UFW/firewalld) pentru a permite doar traficul necesar.
    *   **Actualizări:** Aplică regulat actualizările de securitate (ex: `apt upgrade`).
4.  **Monitorizare și Logging:** Colectează și analizează loguri și metrici. `journalctl` este un prieten bun, dar integrează-te cu soluții centralizate (ELK, Prometheus/Grafana).
5.  **Controlul Versiunilor (Git):** Păstrează toate scripturile, fișierele de configurare și codul în Git.
6.  **Documentare:** Chiar și cel mai scurt script sau set de comenzi ar trebui să fie ușor de înțeles de către alți membri ai echipei.
7.  **Nu rula niciodată ca root dacă nu este absolut necesar.** Folosește `sudo`.

---

Acest handbook este doar un punct de plecare. Practica constantă și explorarea sunt cheia. În mediul DevOps, stăpânirea Linux-ului este o superputere! Succes!