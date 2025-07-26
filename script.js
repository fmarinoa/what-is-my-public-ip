const API_URL = "https://api.ipquery.io/?format=json";

function showError(error) {
    const errorDiv = document.getElementById("error");
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerHTML = `
        <p>⚠️ Ha ocurrido un error al procesar la información:</p>
        <p>${error}</p>
        <p>Vuelva a intentar en unos minutos...</p>
    `;

    errorDiv.style.display = "flex";
}

async function main() {
    try {
        const loadingDiv = document.getElementById('loading');
        const divData = document.getElementById('data');

        // Obtener datos de IP
        const response = await fetch(API_URL);
        const data = await response.json();

        const {
            ip,
            isp: { asn, org },
            location: {
                country, country_code: countryCode, city, state, zipcode,
                latitude, longitude
            },
            risk: {
                is_mobile: isMobile, is_vpn: isVpn, is_tor: isTor,
                is_proxy: isProxy, is_datacenter: isDatacenter, risk_score: riskScore
            }
        } = data;

        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&output=embed`;

        divData.innerHTML += `
            <div class="card card-ip">
                <p><strong>Dirección IP:</strong> ${ip}</p>
                <p><strong>ASN:</strong> ${asn}</p>
                <p><strong>Proveedor de Internet:</strong> ${org}</p>
            </div>
            <div class="card card-location">
                <p><strong>Ubicación:</strong> ${country} (${countryCode}), ${state}, ${city}</p>
                <p><strong>Coordenadas:</strong></p>
                <ul>
                    <li>Latitud: ${latitude}</li>
                    <li>Longitud: ${longitude}</li>
                </ul>
                <div class="map-container">
                    <iframe src="${googleMapsUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                ${zipcode ? `<p><strong>Código Postal:</strong> ${zipcode}</p>` : ''}
            </div>
            <div class="card card-risk">
                <p><strong>Riesgos:</strong></p>
                <ul>
                    <li>Móvil: ${isMobile ? 'Sí' : 'No'}</li>
                    <li>VPN: ${isVpn ? 'Sí' : 'No'}</li>
                    <li>Tor: ${isTor ? 'Sí' : 'No'}</li>
                    <li>Proxy: ${isProxy ? 'Sí' : 'No'}</li>
                    <li>Centro de Datos: ${isDatacenter ? 'Sí' : 'No'}</li>
                    <li>Puntuación de Riesgo: ${riskScore}</li>
                </ul>
            </div>
        `;

        // Obtener clima
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,apparent_temperature,relative_humidity_2m&forecast_days=1`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const now = new Date();
        const currentUTCHour = now.toISOString().slice(0, 13) + ":00";
        const index = weatherData.hourly.time.findIndex(t => t === currentUTCHour);

        let weatherHtml = '';
        if (index === -1) {
            weatherHtml = `<p>No se encontró el clima para la hora actual.</p>`;
        } else {
            const temperature = weatherData.hourly.temperature_2m[index];
            const apparentTemperature = weatherData.hourly.apparent_temperature[index];
            const precipitation = weatherData.hourly.precipitation[index];
            const humidity = weatherData.hourly.relative_humidity_2m[index];

            const localTimeFriendly = now.toLocaleString('es-PE', {
                dateStyle: 'long',
                timeStyle: 'short',
                hour12: true
            });

            weatherHtml = `
                <h3>Clima Actual:</h3>
                <ul>
                <li>Hora local: ${localTimeFriendly}</li>
                <li>Temperatura: ${temperature} °C</li>
                <li>Sensación térmica: ${apparentTemperature} °C</li>
                <li>Precipitación: ${precipitation} mm</li>
                <li>Humedad: ${humidity} %</li>
                </ul>
            `;
        }

        divData.innerHTML += `<div class="card card-weather">${weatherHtml}</div>`;

        loadingDiv.style.display = 'none';
        divData.style.display = "block";

        fetch('https://script.google.com/macros/s/AKfycbyufN5ahvenmlNcPgh6wgABN0IU3gW4hlB0W-y02SPtpseNgJeuiMDiTIi0Usr6umDPwA/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                ip,
                asn,
                org,
                country,
                countryCode,
                state,
                city,
                latitude,
                longitude
            })
        });
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        showError(`Error: ${error.message}`);
    }
}

main();
