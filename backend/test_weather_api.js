
const API_KEY = "sk-live-LvGPMP4oWBLKKleWcVDMPQgmx0HmVDdb5CMjcaUA";

async function run() {
    console.log("Fetching Cities List...");
    let cityResponse = await fetch("https://weather.indianapi.in/india/cities", {
        headers: { 'x-api-key': API_KEY }
    });
    let citiesData = await cityResponse.json();

    if (!Array.isArray(citiesData) && typeof citiesData === 'object') {
        const keys = Object.keys(citiesData);
        const firstKey = keys[10]; // Pick 10th item, maybe 0 is weird
        const cityName = citiesData[firstKey];
        console.log(`City Key: ${firstKey}, City Name: ${cityName}`);

        // Try India endpoint
        console.log(`Trying /india/weather?city=${encodeURIComponent(cityName)}`);
        let r1 = await fetch(`https://weather.indianapi.in/india/weather?city=${encodeURIComponent(cityName)}`, {
            headers: { 'x-api-key': API_KEY }
        });
        console.log("India Status:", r1.status);
        console.log("India Body:", (await r1.text()).substring(0, 500));

    }
}

run();
