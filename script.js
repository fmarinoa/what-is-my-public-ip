const API_URL = "https://api.ipquery.io/?format=json";

function showError(error) {
    const errorDiv = document.getElementById("error");
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerHTML = `
        <p>⚠️Ha ocurrido un error al procesar la información:</p>
        <p>${error}</p>
        <p>Vuelva a intentar en unos minutos...</p>
    `;

    errorDiv.style.display = "flex";
}

axios.get(API_URL)
    .then(response => {
        document.getElementById('loading').style.display = 'none';

        const data = response.data;

        const ip = data.ip;
        const asn = data.isp.asn;
        const org = data.isp.org;
        const country = data.location.country;
        const countryCode = data.location.country_code;
        const city = data.location.city;
        const state = data.location.state;
        const zipcode = data.location.zipcode;
        const latitude = data.location.latitude;
        const longitude = data.location.longitude;
        const timezone = data.location.timezone;
        const localtime = data.location.localtime;
        const isMobile = data.risk.is_mobile;
        const isVpn = data.risk.is_vpn;
        const isTor = data.risk.is_tor;
        const isProxy = data.risk.is_proxy;
        const isDatacenter = data.risk.is_datacenter;
        const riskScore = data.risk.risk_score;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&output=embed`;
        
        const divData = document.getElementById('data');
        divData.insertAdjacentHTML('beforeend', `
            <p><strong>Dirección IP:</strong> ${ip}</p>
            <p><strong>ASN:</strong> ${asn}</p>
            <p><strong>Proveedor de Internet:</strong> ${org}</p>
            <p><strong>Ubicación:</strong> ${country} (${countryCode}), ${state}, ${city}</p>
            <P><strong>Coordenadas:</strong></p>
            <ul>
                <li>Latitud: ${latitude}</li>
                <li>Longitud: ${longitude}</li>
            </ul>
            <div class="map-container">
                <iframe src="${googleMapsUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            ${zipcode ? `<p><strong>Código Postal:</strong> ${zipcode}</p>` : ''}
            <p><strong>Zona Horaria:</strong> ${timezone}</p>
            <p><strong>Hora Local:</strong> ${localtime}</p>
            <p><strong>Riesgos:</strong></p>
            <ul>
                <li>Móvil: ${isMobile ? 'Sí' : 'No'}</li>
                <li>VPN: ${isVpn ? 'Sí' : 'No'}</li>
                <li>Tor: ${isTor ? 'Sí' : 'No'}</li>
                <li>Proxy: ${isProxy ? 'Sí' : 'No'}</li>
                <li>Centro de Datos: ${isDatacenter ? 'Sí' : 'No'}</li>
                <li>Puntuación de Riesgo: ${riskScore}</li>
            </ul>
            
        `);
        divData.style.display = "flex";
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        showError(`Error: ${error.message}`);
    });