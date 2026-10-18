fetch('jobs.xml')
    .then(response => {
        if (!response.ok) {
            throw new Error('Der Zaubereikristall muss neu aufgeladen werden.');
        }
        return response.text();
    })
    .then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const container = document.getElementById('ausschreibungen-container');
        container.innerHTML = ''; // Lade-Text entfernen

        // Alle <job>-Elemente aus der XML holen
        const jobs = xmlDoc.getElementsByTagName('job');

        if (jobs.length === 0) {
            container.innerHTML = '<p>Aktuell sind keine Stellen offen.</p>';
            return;
        }

        // Schleife durch alle Jobs
        for (let i = 0; i < jobs.length; i++) {
            const title = jobs[i].getElementsByTagName('title')[0]?.textContent || 'Kein Titel';
            const location = jobs[i].getElementsByTagName('location')[0]?.textContent || 'Hauptstandort';
            const shortName = jobs[i].getElementsByTagName('shortName')[0]?.textContent || '';
            const url = jobs[i].getElementsByTagName('url')[0]?.textContent || '';
            //Datum umwandeln          
            const publishedToDate = new Intl.DateTimeFormat('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(new Date((jobs[i].getElementsByTagName('publishToDate')[0]?.textContent).replace(/\./g, '-')));

            // HTML für eine einzelne Card erstellen
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <h3>${title}</h3>
                    <div class="location">Standort: ${location}</div>
                    <p class="publishToDate">Veröffentlicht bis: ${publishedToDate}</p>
                    <p class="shortName">${shortName}</p>
                    <a href="${url}" class="btn-bewerben">Jetzt bewerben</a>
                    <div class="qr small-qr">
                    <span class="hover-text">Klicke hier für den QR-Code.</span>
                    </div>
                </div>
                <div class="card-back">
                    <h3>${title}</h3>
                    <div class="div-box">
                    <p>Scannen zum Bewerben</p>
                    <div class="qr large-qr"></div>
                    </div>
                    <button class="btn-zurueck">Zurück zur Übersicht</button>
                </div>
            </div>
          `;

            // Card dem Grid hinzufügen
            container.appendChild(card);

            const smallQrPlaceholder =card.querySelector('.small-qr');
            if(url){
                new QRCode(smallQrPlaceholder, {text:url, width:50,height:50,colorDark : "#000000",colorLight : "#ffffff"});
            }
            
            const largeQrPlaceholder =card.querySelector('.large-qr');
            if(url){
                new QRCode(largeQrPlaceholder, {text:url, width:160,height:160,colorDark : "#000000",colorLight : "#ffffff"});
            }

            smallQrPlaceholder.addEventListener('click', function(e) {
                e.stopPropagation();
                card.classList.add('is-flipped');
            });
            
            card.querySelector('.btn-zurueck').addEventListener('click', function(e) {
                e.stopPropagation();
                card.classList.remove('is-flipped');
            });
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        document.getElementById('ausschreibungen-container').innerHTML = `
          <div class="error-msg">
            Die Stellenausschreibungen konnten nicht geladen werden. (Fehler: XML fehlt oder CORS-Problem)
          </div>
        `;
    });
document.querySelectorAll('.disabled-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        alert('Aktuell bieten wir keine Plätze an. Versuche es bitte über die Initiativbewerbungen.');
    });
});
