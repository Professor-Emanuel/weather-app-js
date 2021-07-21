/* after page has loaded, get the location */
window.addEventListener('load', () =>{
    let myLongitude;
    let myLatitude;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector(".location-timezone");
    let temperatureSection = document.querySelector('.degree-section');
    const temperatureSpan = document.querySelector('.degree-section span');


    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            /* open INSPECTOR and you will see the variable position
            has the coords attribute which contains among others, longitude and latitude */
          myLongitude = position.coords.longitude;
          myLatitude = position.coords.latitude; 
        
          const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${myLatitude}&lon=${myLongitude}&exclude=minutely&appid=9dd97c6cc827388076be21f1128cefef`;
        
          fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data =>{
                console.log(data);
                /* Go in INSPECT to see data, you will see "current" which contains "temp" */
                /* Pull out everything in "current", or specify between curly brackets the items wanted from "current" (see exact names in INSPECTOR) */
                const {temp} = data.current;
                const {description} = data.current.weather[0];
                const {icon} = data.current.weather[0];

                //Set DOM elements from the API
                temperatureDegree.textContent = temp;
                temperatureDescription.textContent = description;
                locationTimezone.textContent = data.timezone;
                

                //Change icon variable to match skycons.js' names, the API has different encoding for icon
                let skyconsIcon = "";
                switch(icon){
                    case '01d':skyconsIcon = skyconsIcon+"CLEAR_DAY";
                    break;
                    case '01n':skyconsIcon = skyconsIcon+"CLEAR_NIGHT";
                    break;
                    case '02d':
                    case '04d':skyconsIcon = skyconsIcon+"PARTLY_CLOUDY_DAY";
                    break;
                    case '02n':
                    case '04n':skyconsIcon = skyconsIcon+"PARTLY_CLOUDY_NIGHT";
                    break;
                    case '03d':
                    case '03n':skyconsIcon = skyconsIcon+"CLOUDY";
                    break;
                    case '09d':skyconsIcon = skyconsIcon+"SHOWERS_DAY";
                    break;
                    case '09n':skyconsIcon = skyconsIcon+"SHOWERS_NIGHT";
                    break;
                    case '10d':
                    case '10n':skyconsIcon = skyconsIcon+"RAIN";
                    break;
                    case '11d':
                    case '11n':skyconsIcon = skyconsIcon+"THUNDER";
                    break;
                    case '13d':
                    case '13n':skyconsIcon = skyconsIcon+"SNOW";
                    break;
                    case '50d':
                    case '50n':skyconsIcon = skyconsIcon+"FOG";
                    break;
                } 
                
                /* can remove this, just added it to verify its content */
                console.log(skyconsIcon);

                //FORMULA for CELCIUS
                // temp is the variable received from the API, see INSPECTOR
                let celcius = (temp - 273.15);
                let fahrenheit = (celcius * 1.80 + 32.00);
                

                // SET Icon
                setIcons(skyconsIcon, document.querySelector(".icon"));

                // Change degree temperature unit
                temperatureSection.addEventListener('click', ()=>{
                    if(temperatureSpan.textContent === "K"){
                        temperatureSpan.textContent = "C";
                        temperatureDegree.textContent = celcius.toFixed(2);
                    }else if(temperatureSpan.textContent === "C"){
                        temperatureSpan.textContent = "F";
                        temperatureDegree.textContent = fahrenheit.toFixed(2);
                    }else {
                        temperatureSpan.textContent = "K";
                        temperatureDegree.textContent = temp;
                    }
                });

            
            });
        });
    }else{
        h1.textContent = "You need to allow Geolocation!"
    }

    function setIcons(icon, iconID){
        const skycons = new Skycons({color:"white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});