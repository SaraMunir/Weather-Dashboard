// Initial array of cities
      //var cities =[]
      let cities = localStorage.cities ? JSON.parse( localStorage.cities ) : [];
      // const latitude;
      // const longitude;
      // var cities = ["Toronto", "New York", "Ottawa", "Florida"];
      // Function for displaying city data
      function renderButtons(userText) {
        // Delete the content inside the buttons-view div prior to adding new cities
        $(`#buttons-view`).empty();
        // Loop through the array of cities, then generate buttons for each city in the array
                //=========================
      for (var i=0; i < cities.length; i++){
          $("#buttons-view").append(`<div id="cityBtn${i}" class="cityBtns" onClick="apiCityWeather('${cities[i]}')" onMouseOver="$('#cityBtnDelete${i}').show()" onMouseOut="$('#cityBtnDelete${i}').hide()">${cities[i]}<i id='cityBtnDelete${i}' onClick="deleteBtn(${i})" class="fa fa-times" aria-hidden="true" style='display:none;'></i></div>`);
        }
      }
        function deleteBtn( cityIdx ){
          // alert(this)
          // remove from array & save
          cities.splice(cityIdx, 1);
          console.log(cities);
          localStorage.cities = JSON.stringify( cities );
          // re-render list with the new indexes
          renderButtons();
          // $(`#buttons-view`).empty();
        }
      // =========================

      // This function handles events where the add city button is clicked
      $("#add-city").on("click", function(event) {
        event.preventDefault();
        const userText = $("#city-input").val();
        for (var i=0; i < cities.length; i++){
          if ( userText == cities[i] || userText == ""){
              return;
            }
          }
        cities.push(userText);
        localStorage.cities = JSON.stringify( cities );
        renderButtons();
      });
      function apiCityWeather(city){
        $(".cityInfo").empty();
        $.ajax({
          url:`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=50c5d43afecf110116d57d26c974a684`,
          method: "GET"
        }).then(getInfo)
      }
      function getInfo(apiResult){

          console.log(apiResult);
          const cityName = apiResult.city.name;
          const listCurrentDay =apiResult.list[0];
          var temper = listCurrentDay.main.temp;
          const cloudiness = listCurrentDay.clouds.all
          const temperature = Math.ceil(temper - 273.15);
          const humidity = listCurrentDay.main.humidity;
          const windSpeed = listCurrentDay.wind.speed;
          const latitude = apiResult.city.coord.lat;
          const longitude = apiResult.city.coord.lon;
          // const cityName = apiResult.city.name;
          // const cityName = apiResult.city.name;
          var date = moment().format('L');
          var m = moment().format('MMMM Do YYYY');
          // var date = moment().format('MMMM Do YYYY');
          // var weather = (temp - 273.15) * 1.80 + 32;
          
          $(".cityInfo").append(
            `<div class="col-md-7" id="mainWeathInfo">
              <p id="currentDay" class="lead"></p>
              <h3 class="lead">${cityName}</h3>
            </div>
            <div class="col-md-4 otherInfo">
              <p>Humidity: ${humidity}%</p>
              <p>Wind Speed: ${windSpeed}MPH</p>
            </div>
            <div class="col">
              <h2>${temperature}°</h2>
            </div>
            `
          );
          $("#currentDay").text(m);
          $(".futureDays").empty();
          for (var i=7; i <40; i+=8){
              var futureDates = moment().add(i, 'days').format('l');
              const listFutureDay =apiResult.list[i];
              const date = listFutureDay.dt_txt;
              var temper = listFutureDay.main.temp;
              const temperature = Math.ceil(temper- 273.15);
              const humidity = listFutureDay.main.humidity;
              const windSpeed = listFutureDay.wind.speed;
              const latitude = apiResult.city.coord.lat;
              const longitude = apiResult.city.coord.lon;
              $(".fiveDayFore").text("5-Day Forecast ")
              $(".futureDays").append(
                `
                <div id="day${i}" class="card">
                    <h5>${date}</h5>
                    <h3>${temperature}°</h3>
                    <p>Humidity: ${humidity}%</p>
                </div>
                `
              )
              // now get the UV stuff
        }
              apiCityUv( `#day${i}`, latitude, longitude );
      }
      //==========for the uv value

      function apiCityUv( destId, latitude, longitude){
            var APIKey = "50c5d43afecf110116d57d26c974a684";
            // latitude = apiResult.city.coord.lat;
            // longitude = apiResult.city.coord.lon;
            // Here we are building the URL we need to query the database
            var queryURL = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${APIKey}&lat=${latitude}&lon=${longitude}&cnt=8`;

            $.ajax({
              url: queryURL,
              method: "GET"
            }).then( function(response){
              const currentDayUvI= response[0].value;

              $(".otherInfo").append(`<p> UV index: <span class="uvBox">${currentDayUvI}</span></p>`);

              if ( currentDayUvI <= 2 ){
                    $(".uvBox").css("background-image", "linear-gradient(45deg, #96deda, #50c9c3)");
                  } else if ( 2 < currentDayUvI, currentDayUvI <= 5 ){
                    $(".uvBox").css("background-image", "linear-gradient(45deg, #B7F8DB, rgb(160, 250, 164))");
                  } else if ( 5 < currentDayUvI, currentDayUvI <= 7 ){
                    $(".uvBox").css("background-image", "linear-gradient(45deg, rgb(139, 177, 90), rgb(236, 206, 105))");
                  } else if ( 7 < currentDayUvI, currentDayUvI <= 10  ){
                    $(".uvBox").css("background-image", "linear-gradient(45deg, rgb(236, 206, 105), rgb(235, 154, 88))");
                  } else  {
                    $(".uvBox").css("background-image", "linear-gradient(45deg, rgb(235, 154, 88),rgb(236, 89, 84))");
                  }

              //for 5 day forecast
              // for (var j=1; j < 6; j++){
              //   const futureDayUvI= response[j].value;
              //   $(`#day${i}`).append(`<p>UV index: ${futureDayUvI}</p>`);
              //   //for updating html for the uv values
              //   if ( futureDayUvI <= 2 ){
              //       $(`#day${i}`).css("background-image", "linear-gradient(45deg, #96deda, #50c9c3)");
              //     } else if ( 2 < futureDayUvI, futureDayUvI <= 5 ){
              //       $(`#day${i}`).css("background-image", "linear-gradient(45deg, #B7F8DB, rgb(160, 250, 164))");
              //     } else if ( 5 < futureDayUvI, futureDayUvI <= 7 ){
              //       $(`#day${i}`).css("background-image", "linear-gradient(45deg, rgb(139, 177, 90), rgb(236, 206, 105))");
              //     } else if ( 7 < futureDayUvI, futureDayUvI <= 10  ){
              //       $(`#day${i}`).css("background-image", "linear-gradient(45deg, rgb(236, 206, 105), rgb(235, 154, 88))");
              //     } else  {
              //       $(`#day${i}`).css("background-image", "linear-gradient(45deg, rgb(235, 154, 88),rgb(236, 89, 84))");
              //     }
              // }
            })
          }
      renderButtons();