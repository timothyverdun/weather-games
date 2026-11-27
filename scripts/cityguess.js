function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Chosir 4 villes au hasard dont une bonne réponse 

fetch("citydata.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
    })
    .then((response) => {
        console.log(response);
        let cities = []
        for (let i = 0; i < 4; i++) {
            let index = getRandomInt(0, response.length - 1)
            cities.push(response[index])
            response.splice(index, 1)
        }
        console.log(cities)
        const choosedindex = getRandomInt(0, 3)
        let choosedcity = cities[choosedindex]
        let citylat = choosedcity.lat
        let citylong = choosedcity.long

        // Récupérer et afficher les informations météo
        let data;
        let apiurl = 'https://api.open-meteo.com/v1/forecast?latitude=' + citylat + '&longitude=' + citylong + '&current=temperature_2m,relative_humidity_2m,is_day,precipitation,wind_speed_10m,wind_direction_10m&forecast_days=1'
        console.log(apiurl)
        fetch(apiurl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                return response.json();
            })
            .then((response) => {
                data = response.current
                console.log(data);

                document.getElementById("humidity").innerHTML = data.relative_humidity_2m
                document.getElementById("temperature").innerHTML = data.temperature_2m
            })
            .catch((error) => {
                console.error(error);
            });

        //Afficher les 4 options de réponse
        let isanwser = false
        let anwsersBox = document.getElementById("anwsersBox")
        anwsersBox.innerHTML = ""
        cities.forEach((city) => {
            let newButton = document.createElement('button')
            newButton.addEventListener('click', (event) => {
                checkAnwser(event.currentTarget);
            })
            newButton.innerHTML = city.name + " (" + city.country + ")"
            anwsersBox.appendChild(newButton)
        })

        //Fonction lorsque réponse choisie
        let allButtons = anwsersBox.querySelectorAll('button')
        function checkAnwser(element) {
            if (isanwser == false) {
                if (element.innerHTML == choosedcity.name) {
                    element.style.color = 'green'
                } else {
                    element.style.color = 'red'
                }
                allButtons.not(element).forEach((e) => { e.classList.add('disabled-button') })
                isanwser = true
            }
        }

    })
    .catch((error) => {
        console.error(error);
    });
