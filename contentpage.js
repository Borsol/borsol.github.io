const params = new URLSearchParams(window.location.search);
const stellenId = params.get("id");

const titelElement = document.getElementById("stellen-titel");
const inhaltElement = document.getElementById("stellen-inhalt");
const bewerbenButton = document.getElementById("bewerben-button");
const fehlerElement = document.getElementById("fehler-meldung");

async function ladeStelle() {
    try {
        if (!stellenId) {
            throw new Error("Keine Stellen-ID angegeben.");
        }

        const response = await fetch("jobs.xml");

        if (!response.ok) {
            throw new Error("XML-Datei konnte nicht geladen werden.");
        }

        const xmlText = await response.text();
        const xml = new DOMParser().parseFromString(
            xmlText,
            "application/xml"
        );

        if (xml.querySelector("parsererror")) {
            throw new Error("Die XML-Datei ist fehlerhaft.");
        }

        const stellen = Array.from(xml.querySelectorAll("job"));

        const stelle = stellen.find(job =>
            job.querySelector("id")?.textContent.trim() === stellenId
        );

        if (!stelle) {
            throw new Error("Ausschreibung nicht gefunden.");
        }
        const inhalt = stelle.querySelector("content")?.textContent.trim();
        const bewerbungsUrl = stelle.querySelector("url")?.textContent.trim();

        if (!inhalt || !bewerbungsUrl) {
            throw new Error("Daten der Ausschreibung sind unvollständig.");
        }

        // Die Beschreibung stammt aus dem HTML in CDATA.
        inhaltElement.innerHTML = inhalt;

        bewerbenButton.href = bewerbungsUrl;

    } catch (error) {
        console.error(error);
        inhaltElement.hidden = true;
        bewerbenButton.hidden = true;
        fehlerElement.hidden = false;
    }
}

ladeStelle();