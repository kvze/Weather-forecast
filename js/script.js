const apiKey = "b0b35b864428347fd8e5cef88b235792";
const apiUrlGeo = `http://api.openweathermap.org/geo/1.0/direct?q=`
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`

const cityInput = document.querySelector(".city-input");
const cityButton = document.querySelector(".city-button");

const cityName = document.querySelector(".city-name");
const cityTemperature = document.querySelector(".temperature");
const cityWeatherDescription = document.querySelector(".weather-description");
const cityWind = document.querySelector(".weather-wind");
const cityHumidity = document.querySelector(".weather-humidity");
const cityPressure = document.querySelector(".weather-pressure");
const weatherIconContainer = document.querySelector(".weather-icon");

function capitalizeFirst(str){
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}

const weatherIcons = {
    Clear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`,
    Clouds: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>`,
    Rain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 13v8M8 13v8M12 15v8"/>
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
    </svg>`,
    Drizzle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 19v2M12 19v2M16 19v2"/>
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
    </svg>`,
    Thunderstorm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,
    Snow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>`,
    Mist: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 9h14M5 15h14M3 12h18"/>
    </svg>`,
    Fog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 2h6M5 6h14M3 10h18M5 14h14M3 18h18"/>
    </svg>`,
    Haze: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
    </svg>`,
    Dust: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="8" cy="8" r="2"/>
        <circle cx="16" cy="16" r="2"/>
        <path d="M10 10h4M6 14h12"/>
    </svg>`,
    Sand: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M5 8h14M7 16h10"/>
    </svg>`,
    Ash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="6" cy="6" r="1.5"/>
        <circle cx="18" cy="6" r="1.5"/>
        <circle cx="12" cy="12" r="1.5"/>
        <circle cx="6" cy="18" r="1.5"/>
        <circle cx="18" cy="18" r="1.5"/>
    </svg>`,
    Squall: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v20M8 6h8M6 10h12M4 14h16M8 18h8"/>
    </svg>`,
    Tornado: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 2h16M6 6h12M8 10h8M10 14h4M12 18h0"/>
    </svg>`
};

function getWeatherIcon(weatherMain) {
    return weatherIcons[weatherMain] || weatherIcons.Clouds;
}

const windIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 5.5C6.25 3.70508 7.70507 2.25 9.5 2.25C11.2949 2.25 12.75 3.70507 12.75 5.5C12.75 7.29493 11.2949 8.75 9.5 8.75H3C2.58579 8.75 2.25 8.41421 2.25 8C2.25 7.58579 2.58579 7.25 3 7.25H9.5C10.4665 7.25 11.25 6.4665 11.25 5.5C11.25 4.5335 10.4665 3.75 9.5 3.75C8.5335 3.75 7.75 4.5335 7.75 5.5V5.85714C7.75 6.27136 7.41421 6.60714 7 6.60714C6.58579 6.60714 6.25 6.27136 6.25 5.85714V5.5Z" fill="#e5e7eb"/>
    <path opacity="0.4" d="M3.25 14C3.25 13.5858 3.58579 13.25 4 13.25H18.5C20.8472 13.25 22.75 15.1528 22.75 17.5C22.75 19.8472 20.8472 21.75 18.5 21.75C16.1528 21.75 14.25 19.8472 14.25 17.5V17C14.25 16.5858 14.5858 16.25 15 16.25C15.4142 16.25 15.75 16.5858 15.75 17V17.5C15.75 19.0188 16.9812 20.25 18.5 20.25C20.0188 20.25 21.25 19.0188 21.25 17.5C21.25 15.9812 20.0188 14.75 18.5 14.75H4C3.58579 14.75 3.25 14.4142 3.25 14Z" fill="#e5e7eb"/>
    <path opacity="0.7" d="M14.25 7.5C14.25 5.15279 16.1528 3.25 18.5 3.25C20.8472 3.25 22.75 5.15279 22.75 7.5C22.75 9.84721 20.8472 11.75 18.5 11.75H2C1.58579 11.75 1.25 11.4142 1.25 11C1.25 10.5858 1.58579 10.25 2 10.25H18.5C20.0188 10.25 21.25 9.01878 21.25 7.5C21.25 5.98122 20.0188 4.75 18.5 4.75C16.9812 4.75 15.75 5.98122 15.75 7.5V8C15.75 8.41421 15.4142 8.75 15 8.75C14.5858 8.75 14.25 8.41421 14.25 8V7.5Z" fill="#e5e7eb"/>
</svg>`;

const humidityIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M15.0066 3.25608C16.8483 2.85737 19.1331 2.8773 22.2423 3.65268C22.7781 3.78629 23.1038 4.32791 22.9699 4.86241C22.836 5.39691 22.2931 5.7219 21.7573 5.58829C18.8666 4.86742 16.9015 4.88747 15.4308 5.20587C13.9555 5.52524 12.895 6.15867 11.7715 6.84363L11.6874 6.89494C10.6044 7.55565 9.40515 8.28729 7.82073 8.55069C6.17734 8.82388 4.23602 8.58235 1.62883 7.54187C1.11607 7.33724 0.866674 6.75667 1.0718 6.24513C1.27692 5.73359 1.85889 5.48479 2.37165 5.68943C4.76435 6.6443 6.32295 6.77699 7.492 6.58265C8.67888 6.38535 9.58373 5.83916 10.7286 5.14119C11.855 4.45445 13.1694 3.6538 15.0066 3.25608Z" fill="#e5e7eb"/>
    <path d="M22.2423 7.64302C19.1331 6.86765 16.8483 6.84772 15.0066 7.24642C13.1694 7.64415 11.855 8.44479 10.7286 9.13153C9.58373 9.8295 8.67888 10.3757 7.492 10.573C6.32295 10.7673 4.76435 10.6346 2.37165 9.67977C1.85889 9.47514 1.27692 9.72393 1.0718 10.2355C0.866674 10.747 1.11607 11.3276 1.62883 11.5322C4.23602 12.5727 6.17734 12.8142 7.82073 12.541C9.40515 12.2776 10.6044 11.546 11.6874 10.8853L11.7715 10.834C12.895 10.149 13.9555 9.51558 15.4308 9.19621C16.9015 8.87781 18.8666 8.85777 21.7573 9.57863C22.2931 9.71224 22.836 9.38726 22.9699 8.85275C23.1038 8.31825 22.7781 7.77663 22.2423 7.64302Z" fill="#e5e7eb"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9998 10.0266C18.6526 10.0266 18.3633 10.2059 18.1614 10.4772C18.0905 10.573 17.9266 10.7972 17.7089 11.111C17.4193 11.5283 17.0317 12.1082 16.6424 12.7555C16.255 13.3996 15.8553 14.128 15.5495 14.8397C15.2567 15.5213 14.9989 16.2614 14.9999 17.0117C15.0006 17.2223 15.0258 17.4339 15.0604 17.6412C15.1182 17.9872 15.2356 18.4636 15.4804 18.9521C15.7272 19.4446 16.1131 19.9674 16.7107 20.3648C17.3146 20.7664 18.0748 21 18.9998 21C19.9248 21 20.685 20.7664 21.2888 20.3648C21.8864 19.9674 22.2724 19.4446 22.5192 18.9522C22.764 18.4636 22.8815 17.9872 22.9393 17.6413C22.974 17.4337 22.9995 17.2215 22.9998 17.0107C23.0001 16.2604 22.743 15.5214 22.4501 14.8397C22.1444 14.128 21.7447 13.3996 21.3573 12.7555C20.968 12.1082 20.5803 11.5283 20.2907 11.111C20.073 10.7972 19.909 10.573 19.8382 10.4772C19.6363 10.2059 19.3469 10.0266 18.9998 10.0266ZM20.6119 15.6257C20.3552 15.0281 20.0049 14.3848 19.6423 13.782C19.4218 13.4154 19.2007 13.0702 18.9998 12.7674C18.7989 13.0702 18.5778 13.4154 18.3573 13.782C17.9948 14.3848 17.6445 15.0281 17.3878 15.6257L17.3732 15.6595C17.1965 16.0704 16.9877 16.5562 17.0001 17.0101C17.0121 17.3691 17.1088 17.7397 17.2693 18.0599C17.3974 18.3157 17.574 18.5411 17.8201 18.7048C18.06 18.8643 18.4248 19.0048 18.9998 19.0048C19.5748 19.0048 19.9396 18.8643 20.1795 18.7048C20.4256 18.5411 20.6022 18.3156 20.7304 18.0599C20.8909 17.7397 20.9876 17.3691 20.9996 17.01C21.0121 16.5563 20.8032 16.0705 20.6265 15.6597L20.6119 15.6257Z" fill="#e5e7eb"/>
    <path d="M14.1296 11.5308C14.8899 11.2847 15.4728 12.076 15.1153 12.7892C14.952 13.1151 14.7683 13.3924 14.4031 13.5214C13.426 13.8666 12.6166 14.3527 11.7715 14.8679L11.6874 14.9192C10.6044 15.5799 9.40516 16.3115 7.82074 16.5749C6.17735 16.8481 4.23604 16.6066 1.62884 15.5661C1.11608 15.3615 0.866688 14.7809 1.07181 14.2694C1.27694 13.7578 1.8589 13.509 2.37167 13.7137C4.76436 14.6685 6.32297 14.8012 7.49201 14.6069C8.67889 14.4096 9.58374 13.8634 10.7286 13.1654C11.8166 12.5021 12.9363 11.9171 14.1296 11.5308Z" fill="#e5e7eb"/>
</svg>`;

const pressureIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" viewBox="0 0 487.913 487.913" fill="#e5e7eb">
    <g transform="translate(0 -540.36)">
        <g>
            <g>
                <path d="M292.256,606.573L292.256,606.573c6.4-19.3,0.5-41.1-15.8-54.2c-18.1-16-46-16-64.9-0.1c-16.3,13.1-22.3,35-15.9,54.3     c-95.2,21.8-166.5,106.9-166.5,208.1c0,117.8,96.3,213.6,214.8,213.6s214.8-95.8,214.8-213.6     C458.756,713.473,387.456,628.473,292.256,606.573z M224.156,567.872L224.156,567.872c0.1-0.1,0.2-0.1,0.2-0.2     c11.5-9.7,28.3-9.8,39-0.2c0.1,0.1,0.3,0.2,0.4,0.4c10.5,8.4,13.8,23,8.4,35.1c-9.2-1.2-18.7-1.8-28.2-1.8     c-9.6,0-19,0.6-28.2,1.8C210.256,590.872,213.556,576.272,224.156,567.872z M243.956,1008.373c-107.4,0-194.8-86.8-194.8-193.6     c0-106.7,87.4-193.6,194.8-193.6s194.8,86.8,194.8,193.6C438.756,921.473,351.356,1008.373,243.956,1008.373z"/>
                <path d="M395.056,788.372c-5.8-35.5-24.3-67.6-51.9-90.4c-57.5-47.3-140.8-47.3-198.3,0c-27.6,22.8-46.1,54.9-51.9,90.4     c-5.7,35,1,71.3,19,102.3c1.7,3.1,5,5,8.6,5h246.9c3.5,0,6.8-1.9,8.6-5C394.056,859.672,400.856,823.372,395.056,788.372z      M361.456,875.672h-235.1c-29.2-55.5-16.6-122.9,31.1-162.2c50.1-41.3,122.8-41.3,172.9,0     C378.056,752.772,390.656,820.172,361.456,875.672z"/>
                <path d="M295.256,784.172c-2.2,0-4.4,0.7-6.2,2.1l-35.2,27.7v-70.2c0-5.5-4.5-10-10-10s-10,4.5-10,10v70.2l-35.2-27.7     c-4.3-3.4-10.6-2.6-14,1.7c-3.4,4.3-2.6,10.6,1.7,14l51.4,40.4c3.7,2.9,8.8,2.9,12.4,0l51.4-40.4c4.3-3.4,5.1-9.7,1.6-14     C301.156,785.472,298.256,784.172,295.256,784.172z"/>
            </g>
        </g>
    </g>
</svg>`;

setDefaultWeather();


async function getEnglishCityName(foreignName){

    const geoUrl = apiUrlGeo + foreignName + "&limit=5&appid=" + apiKey;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoResponse.ok || !geoData.length){
        throw new Error("Город не найден");
    }

    return geoData[0].name;
}

async function getWeather(englishCity){
    const url = apiUrl + englishCity + "&appid=" + apiKey + "&lang=ru";
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok){
        throw new Error("Прогноз погоды не найден");
    }

    return data;
};

async function setDefaultWeather() {
    const data = await getWeather("Moscow");
    updateWeatherUI(data, "Москва");
}

function updateWeatherUI(data, cityDisplayName) {
    cityName.textContent = cityDisplayName;
    cityTemperature.textContent = Math.round(data.main.temp) + "°C";
    cityWeatherDescription.textContent = capitalizeFirst(data.weather[0].description);
    
    const weatherMain = data.weather[0].main;
    weatherIconContainer.innerHTML = getWeatherIcon(weatherMain);
    
    cityWind.innerHTML = `Ветер: ${data.wind.speed} м/с ${windIconSVG}`;
    cityHumidity.innerHTML = `Влажность: ${data.main.humidity} % ${humidityIconSVG}`;
    cityPressure.innerHTML = `Давление: ${data.main.pressure} гПа ${pressureIconSVG}`;
}


cityButton.addEventListener("click", async () =>{
    try {
        const query = cityInput.value.trim();

        if (!query){
            alert("Пожалуйста, введите название города.");
            cityInput.focus();
            return;
        }

        if (!/^[a-zA-Zа-яА-ЯёЁ\s-]{2,}$/.test(query)){
            alert("Название города должно содержать только буквы и быть не короче 2 символов.");
            cityInput.focus();
            return;
        }

        const englishCity = await getEnglishCityName(query);
        const data = await getWeather(englishCity);

        updateWeatherUI(data, capitalizeFirst(query));
        

    } catch (err) {
        alert(err.message || "Произошла ошибка при получении погоды.");
    }
});

