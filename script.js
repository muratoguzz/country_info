document.getElementById("btnSearch").addEventListener("click", () => {
    let text = document.getElementById("txtSearch").value;
    console.log(text)
    document.querySelector("#loading").style.display = "block";
    displayCountry(text)
});

document.getElementById("txtSearch").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        let text = document.getElementById("txtSearch").value;
        console.log(text)
        document.querySelector("#loading").style.display = "block";
        displayCountry(text)
        // Keypressi inputa verme nedeni; enter tuşuna basılınca focus input alanına olur ve input alanına girilen value değeri displayCountry(value) fonksiyonuna gider.
    }
});

document.querySelector("#btnLocation").addEventListener("click", () => {
    // pozisyon bilgisi true dönerse; lat ve lng bilgilerini getir
    if(navigator.geolocation) {
        document.querySelector("#loading").style.display = "block";
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }
});

function onError(err) {
    console.log(err);
    document.querySelector("#loading").style.display = "none";
};

async function onSuccess(position) {
    const lat = await position.coords.latitude;
    const lng = await position.coords.longitude;
    const api_key = "7e30a034a4554250a847948db4f08264";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lng}&key=${api_key}`
    const response = await fetch(url);
    const data = await response.json();

    const country = data.results[0].components.country;
    document.getElementById("txtSearch").value = country;
    document.querySelector("#btnSearch").click();

};

async function displayCountry(country) {
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#neighbors").innerHTML = "";
    document.querySelector("#country-details").innerHTML = "";
    
    //Aratılan ülkenin getirilmesi
    try {
        const response = await fetch("https://restcountries.com/v3.1/name/" + country);
        if(!response.ok)
            throw new Error("Ülke bulunamadı");
        const data = await response.json();
        setCountry(data[0]);

    //Komşu ülkelerin getirilmesi
        const neighbors = data[0].borders;
        if(!neighbors)
            throw new Error("Komşu ülke bulunamadı");

        const response2 = await fetch('https://restcountries.com/v3.1/alpha?codes=' + neighbors.toString());
        const borders = await response2.json();
        getNeighbors(borders);
        
    }
    catch(err) {
        getError(err);
    }
}

function setCountry(data) {
                
    const html = `
            
    <div class="card-header">
        Arama Sonucu
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-4">
                <img src="${data.flags.png}" alt="" class="img-fluid">
            </div>
            <div class="col-8">
                <h3 class="card-title">${data.name.common}</h3>
                <hr>
                <div class="row">
                    <div class="col-4">Nufüs: </div>
                    <div class="col-8">${(data.population / 1000000).toFixed(1)} milyon</div>
                </div>
                <div class="row">
                    <div class="col-4">Resmi Dil: </div>
                    <div class="col-8">${Object.values(data.languages)}</div>
                </div>
                <div class="row">
                    <div class="col-4">Başkent: </div>
                    <div class="col-8">${data.capital[0]}</div>
                </div>
                <div class="row">
                    <div class="col-4">Para Birimi: </div>
                    <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                </div>
            </div>
        </div>
    </div>
    `;

        document.querySelector("#country-details").innerHTML = html;
}

function getNeighbors(data) {
    let html = "";
    for(let country of data) {
        html += `
            <div class="col-2 mt-2">
                <img src="${country.flags.png}" class=""card-img-top>
                <div class="card-body">
                    <h6 class="card-title">${country.name.common}</h6>
                </div>
            </div>
        `;
    }
    
    document.querySelector("#neighbors").innerHTML = html;
    
    
}

function getError(err) {
    document.querySelector("#loading").style.display = "none";
    const html = `
        <div class="alert alert-danger">${err.message}</div>
    `;
    setTimeout(() => {
        document.querySelector("#errors").innerHTML = "";
    }, 3000);
    document.querySelector("#errors").innerHTML = html;
}

