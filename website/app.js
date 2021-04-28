/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
const baserUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = 'de30bd7ef32095adacc6840f9d387d3e';
const zipCodeInput = document.querySelector('#zip');
const feelInput = document.querySelector('#feelings');
const generateBtn = document.querySelector('#generate');

// Event listener for the generate button
generateBtn.addEventListener('click', handleBtnClick);

// Click handler funciton
function handleBtnClick(e) {
    const zipCode = zipCodeInput.value;
    const userFeel = feelInput.value;
    return getTemperature(baserUrl, zipCode, apiKey)
        .then(data => {
            // POST data to our serve
            postData('http://localhost:8000/addWeather', {
                temperature: data.main.temp,
                date: newDate,
                user_response: userFeel
            })
            // Update the UI
            .then(() => {
                updateUI();
            });
        });
}

// Async function to make a GET request to the OpenWeatherMap API
const getTemperature = async (base, code, key) => {
    const response = await fetch(`${base}${code},us&appid=${key}`);

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log('error', error);
    }
};

// Async function to make a POST request to our server
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log('error', error);
    }
};

// Update the UI dynamically
const updateUI = async () => {
    const response = await fetch('/all');

    try {
        const retrievedData = await response.json();
        document.querySelector('#date').innerHTML = retrievedData.date;
        document.querySelector('#temp').innerHTML = retrievedData.temperature;
        document.querySelector('#content').innerHTML = retrievedData.user_response;
    } catch(error) {
        console.log('error', error);
    }
};