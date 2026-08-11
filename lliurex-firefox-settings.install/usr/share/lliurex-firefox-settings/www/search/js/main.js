<<<<<<< Updated upstream
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function rss(){
    list_rss = ["https://portal.edu.gva.es/cvtic/va/category/inici/feed/","https://portal.edu.gva.es/lliurex/?feed=rss2"];
    for( x in list_rss){
        console.log(x);
        fetch("https://cors-anywhere.herokuapp.com/"+list_rss[x])
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            console.log(data);
            const items = data.querySelectorAll("item");
            let html = document.querySelector("#rss").innerHTML;
            items.forEach(el => {
                let stringscaped = escapeHtml(el.querySelector("description").childNodes[0].nodeValue);
            html += `
                <div class="row">
                    <a href="${el.querySelector("link").innerHTML}" title="${stringscaped}">${el.querySelector("title").innerHTML}</a>
    
                </div>
            `;
            document.querySelector("#rss").innerHTML = html;
            });
        });
    }
}
rss();

async function checkServer(url,elementId){
=======
const DEFAULT_IMAGE = 'images/default.png';
>>>>>>> Stashed changes

function isValidUrl(url) {
    if (typeof url !== 'string') {
        return false;
    }
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === '_url' || trimmed.startsWith('#') || /\s/.test(trimmed)) {
        return false;
    }
    try {
        new URL(trimmed, location.href);
        return true;
    } catch (error) {
        console.log(`URL ${trimmed} not valid`);
        return false;
    }
}
<<<<<<< Updated upstream
checkServer('http://server','conditional-bookmark')
=======

async function isReachable(url) {
    try {
        await fetch(url, {method: 'HEAD', mode: 'no-cors', cache: 'no-store'});
        return true;
    } catch (error) {
        console.log(`URL ${url} not accesible`);
        return false;
    }
}

function createCard(card) {
    const link = document.createElement('a');
    link.href = card.url;

    const img = document.createElement('img');
    img.alt = card.title;
    img.src = card.image || DEFAULT_IMAGE;
    img.onerror = function () {
        img.src = DEFAULT_IMAGE;
    };
    link.appendChild(img);

    const label = document.createTextNode(card.title || card.url);
    link.appendChild(label);

    document.querySelector('nav.sidebar').appendChild(link);
}

async function loadCards() {
    try {
        const response = await fetch('cards.json', {cache: 'no-store'});
        if (!response.ok) {
            console.log(`cards.json not accesible (${response.status})`);
            return;
        }
        const data = await response.json();
        for (const card of data.cards) {
            if (!isValidUrl(card.url)) {
                console.log(`Skipping card with url ${card.url}`);
                continue;
            }
            if (card.condition) {
                if (!isValidUrl(card.condition)) {
                    continue;
                }
                if (!(await isReachable(card.condition))) {
                    continue;
                }
            }
            createCard(card);
        }
    } catch (error) {
        console.log('cards.json not accesible');
    }
}

loadCards();
>>>>>>> Stashed changes
