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
            <h3>${title}</h3>
            <div class="location">Standort: ${location}</div>
            <p class="publishToDate">Veröffentlicht bis: ${publishedToDate}</p>
            <p class="shortName">${shortName}</p>
            <a href="${url}" class="btn-bewerben">Jetzt bewerben</a>
          `;

            // Card dem Grid hinzufügen
            container.appendChild(card);
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
