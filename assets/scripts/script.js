// ------------- Assignment Code -------------
let autocomplete;


// ---------------- Functions ----------------
// Run on web page load
function init() {
    renderHeader();
    renderMainContent();
    searchInputAutoComplete();
}

// Create the header
function renderHeader() {
    // Build the header
    let $headerTitleH1 = $("<h1>");
    $headerTitleH1.addClass("display-5");
    $headerTitleH1.text("Weather Dashboard");

    // Append to the header on the page
    $("header").append($headerTitleH1)
}

// Create the main content
function renderMainContent() {
    // Build content DIV
    let $contentDiv = $("<div>");
    $contentDiv.addClass("row");
    $("main").append($contentDiv);

    // Build the Search column
    let $searchColumnDiv = $("<div>");
    $searchColumnDiv.attr("id", "search");
    $searchColumnDiv.addClass("col-md-3 mb-3");
    
    // Build Search column title
    let $searchTitleH2 = $("<h2>");
    $searchTitleH2.text("Search for a city:");
    $searchColumnDiv.append($searchTitleH2);

    // Build Search input text box
    let $searchInputDiv = $("<div>");
    $searchInputDiv.addClass("form-group");

    let $searchInput = $("<input>");
    $searchInput.attr("id", "searchInput");
    $searchInput.attr("type", "text");
    $searchInput.attr("placeholder", "Houston, TX");
    $searchInput.addClass("textarea form-control");

    let $searchInputId = $("<input>");
    $searchInputId.attr("id", "searchInputId");
    $searchInputId.attr("type", "hidden");

    let $searchInputLAT = $("<input>");
    $searchInputLAT.attr("id", "searchInputLAT");
    $searchInputLAT.attr("type", "hidden");

    let $searchInputLNG = $("<input>");
    $searchInputLNG.attr("id", "searchInputLNG");
    $searchInputLNG.attr("type", "hidden");

    $searchInputDiv.append($searchInput);
    $searchInputDiv.append($searchInputId);  
    $searchInputDiv.append($searchInputLAT);
    $searchInputDiv.append($searchInputLNG);
    $searchColumnDiv.append($searchInputDiv);

    // Build Search button for text box
    let searchButtonIcon = $("<i class=\"fas fa-search-location\"></i>");
    let $searchButton = $("<button>");
    $searchButton.attr("id", "searchButton");
    $searchButton.addClass("button my-3");

    let $searchButtonSpan = $("<span>");
    $searchButtonSpan.text("  Search");

    $searchButton.append(searchButtonIcon);
    $searchButton.append($searchButtonSpan);
    $searchColumnDiv.append($searchButton);

    // Build Search results separator
    let $searchSeperator = $("<div>");
    $searchSeperator.addClass("separator");
    $searchColumnDiv.append($searchSeperator);

    // Build Search history DIV
    let $searchHistoryDiv = $("<div>");
    $searchHistoryDiv.attr("id", "searchHistory");

    $searchColumnDiv.append($searchHistoryDiv);

    // Append Search to main content
    $($contentDiv).append($searchColumnDiv);

    // Build the Results column
    let $resultsColumnDiv = $("<div>");
    $resultsColumnDiv.attr("id", "results");
    $resultsColumnDiv.addClass("col-md-9");

    // Append the Results to the main content
    $($contentDiv).append($resultsColumnDiv);

    // Render Search history
    renderSearchHistory();
}

// Create the Search history
function renderSearchHistory() {
    $(".searchHistory").remove();
    // Get the list of search history items from local storage
    let searchItems = JSON.parse(localStorage.getItem("weatherDashboard_searchItems"));
    if (searchItems === null) {
        searchItems = [];
    }

    // TODO: Fix the sort on the searchItems array
    searchItems.sort(function(a, b) {
        return a.cityName - b.cityName
    });

    for (let i = 0; i < searchItems.length; i++) {
        let $searchHistoryButton = $("<button>");
        $searchHistoryButton.attr("id", `searchHistory_item${i}`);
        $searchHistoryButton.attr("cityId", searchItems[i].cityId);
        $searchHistoryButton.addClass("button searchHistory mt-3");
    
        let $searchButtonSpan = $("<span>");
        $searchButtonSpan.text(searchItems[i].cityName);

        $searchHistoryButton.append($searchButtonSpan);

        $("#searchHistory").append($searchHistoryButton);
    }
}

// Enable autocomplete on the search input to improve user experience
function searchInputAutoComplete() {
    let searchInput = document.getElementById('searchInput');
    autocomplete = new google.maps.places.Autocomplete(searchInput, {
        types: ['geocode']
    });
}

// Render the Results column
function renderResults(cityId) {

    let searchItems = JSON.parse(localStorage.getItem("weatherDashboard_searchItems"));

    for (let i = 0; i < searchItems.length; i++) {
        if (searchItems[i].cityId === cityId) {

            // Set the requestUrl for the weather API
            let requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${searchItems[i].cityLAT}&lon=${searchItems[i].cityLNG}&units=imperial&exclude=minutely,hourly&appid=33e00170884c3cd4fa86aa23f7431b3e`

            // Clear and Build the Result column
            $("#results").empty();

            fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // TODO: Remove console.log from the code before finishing
                console.log(data);

                // Build current weather Div
                let $resultsCurrWXDiv = $("<div>");
                $resultsCurrWXDiv.attr("id", "currWX");
                $resultsCurrWXDiv.addClass("card");

                // Build the header row
                let $resultsCurrWXTitle = $("<h2>");
                $resultsCurrWXTitle.addClass("card-header text-white");
                $resultsCurrWXTitle.text(searchItems[i].cityName);

                // Build the weather image next to the title
                let $resultsCurrWX = $("<img>");
                let imgSrc = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`;
                $resultsCurrWX.attr("src", imgSrc);
                $resultsCurrWX.attr("title", data.current.weather[0].description);
                $resultsCurrWX.attr("alt", data.current.weather[0].description);

                // Append the header
                $resultsCurrWXTitle.append($resultsCurrWX);
                $resultsCurrWXDiv.append($resultsCurrWXTitle);

                // Build the current weather card body
                let $resultsCurrDtls = $("<div>");
                $resultsCurrDtls.addClass("card-body container");

                // Build the current temperature on card body
                let $resultsCurrWXTemp = $("<p>");

                let $resultsCurrWXTempTitle = $("<span>");
                $resultsCurrWXTempTitle.text("Temperature: ");
                $resultsCurrWXTemp.append($resultsCurrWXTempTitle);
                $resultsCurrWXTemp.append(`${data.current.temp} &#176;F`);
                $resultsCurrDtls.append($resultsCurrWXTemp);

                // Build the current wind on card body
                let $resultsCurrWXWind = $("<p>");

                let $resultsCurrWXWindTitle = $("<span>");
                $resultsCurrWXWindTitle.text("Wind: ");
                $resultsCurrWXWind.append($resultsCurrWXWindTitle);
                $resultsCurrWXWind.append(`${data.current.wind_speed} MPH`);
                $resultsCurrDtls.append($resultsCurrWXWind);

                // Build the current humidity on card body
                let $resultsCurrWXHum = $("<p>");

                let $resultsCurrWXHumTitle = $("<span>");
                $resultsCurrWXHumTitle.text("Humidity: ");
                $resultsCurrWXHum.append($resultsCurrWXHumTitle);
                $resultsCurrWXHum.append(`${data.current.humidity} %`);
                $resultsCurrDtls.append($resultsCurrWXHum);

                // Build the current UV index on card body
                let $resultsCurrWXUVI = $("<p>");

                let $resultsCurrWXUVITitle = $("<span>");
                $resultsCurrWXUVITitle.text("UV Index: ");
                $resultsCurrWXUVI.append($resultsCurrWXUVITitle);
                let $resultsCurrWXUVIBadge = $("<span>");
                $resultsCurrWXUVIBadge.addClass("badge rounded-pill");

                let varUVI = data.current.uvi;

                switch(true) {
                    case (0 <= varUVI && varUVI < 3):
                        // UV index is low
                        $resultsCurrWXUVIBadge.addClass("bg-success");
                        break;
                    case ( 3 <= varUVI && varUVI < 8):
                        // UV index is moderate to high
                        $resultsCurrWXUVIBadge.addClass("bg-warning text-dark");
                        break;
                    case ( 8 <= varUVI):
                        // UV index very high to extreme
                        $resultsCurrWXUVIBadge.addClass("bg-danger");
                        break;
                }

                $resultsCurrWXUVIBadge.text(varUVI);
                $resultsCurrWXUVI.append($resultsCurrWXUVIBadge);
                $resultsCurrDtls.append($resultsCurrWXUVI);

                let $resultsForcWX = $("<div>");
                $resultsForcWX.addClass("row row-cols-md-5");

                for (let i = 1; i < 6; i++) {
                    // Build current weather Div
                    let $resultsForcWXDiv = $("<div>");
                    $resultsForcWXDiv.addClass("card text-white forcWX mb-3 col-xxl-2 col-lg-3 col-md-4 col-5 m-2");

                    // Build the header row
                    let $resultsForcWXTitle = $("<div>");
                    $resultsForcWXTitle.addClass("card-header");
                    $resultsForcWXTitle.text(moment(data.daily[i].dt * 1000).format("YYYY-MM-DD"));

                    // Build the current weather card body
                    let $resultsForcWXDtls = $("<div>");
                    $resultsForcWXDtls.addClass("card-body");

                    // Build the weather image next for the forecast
                    let $resultsForcWXImg = $("<img>");
                    let forcImgSrc = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`;
                    $resultsForcWXImg.attr("src", forcImgSrc);
                    $resultsForcWXImg.attr("title", data.daily[i].weather[0].description);
                    $resultsForcWXImg.attr("alt", data.daily[i].weather[0].description);
                    $resultsForcWXDtls.append($resultsForcWXImg);

                    // Build the current temperature on card body
                    let $resultsForcWXTemp = $("<p>");

                    let $resultsForcWXTempTitle = $("<span>");
                    $resultsForcWXTempTitle.text("Temperature: ");
                    $resultsForcWXTemp.append($resultsForcWXTempTitle);
                    $resultsForcWXTemp.append(`${data.daily[i].temp.day} &#176;F`);
                    $resultsForcWXDtls.append($resultsForcWXTemp);

                    // Build the current wind on card body
                    let $resultsForcWXWind = $("<p>");

                    let $resultsForcWXWindTitle = $("<span>");
                    $resultsForcWXWindTitle.text("Wind: ");
                    $resultsForcWXWind.append($resultsForcWXWindTitle);
                    $resultsForcWXWind.append(`${data.daily[i].wind_speed} MPH`);
                    $resultsForcWXDtls.append($resultsForcWXWind);

                    // Build the current humidity on card body
                    let $resultsForcWXHum = $("<p>");

                    let $resultsForcWXHumTitle = $("<span>");
                    $resultsForcWXHumTitle.text("Humidity: ");
                    $resultsForcWXHum.append($resultsForcWXHumTitle);
                    $resultsForcWXHum.append(`${data.daily[i].humidity} %`);
                    $resultsForcWXDtls.append($resultsForcWXHum);

                    $resultsForcWXDiv.append($resultsForcWXTitle);
                    $resultsForcWXDiv.append($resultsForcWXDtls);
                    $resultsForcWX.append($resultsForcWXDiv);
                }

                // Append current weather and forecast to results
                $resultsCurrDtls.append($resultsForcWX);
                $resultsCurrWXDiv.append($resultsCurrDtls);
                $("#results").append($resultsCurrWXDiv);







// <div class="card text-white bg-secondary mb-3" style="max-width: 18rem;">
//  <div class="card-header">Header</div>
//  <div class="card-body">
//    <h5 class="card-title">Secondary card title</h5>
//    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//  </div>
// </div>


            });
        }
    }
}

// Calls init to retrieve data and render it to the page on load
init();

// ------------- Event Listeners -------------
// Add an action for buttons when they are clicked in the search section
document.querySelector("#search").addEventListener("click", function(event) {
    if (event.target.matches("button") === true || event.target.parentNode.matches("button") === true) {
        const id = event.target.id || event.target.parentNode.id;
        // Get search history items from local storage
        let searchItems = JSON.parse(localStorage.getItem("weatherDashboard_searchItems"));
        if (searchItems === null) {
            searchItems = [];
        }

        let cityId = $(`#${id}`).attr("cityId");

        // Set the new entry for the array
        if (typeof cityId === typeof undefined) {
            let searchCity = document.getElementById("searchInput").value.trim();
            cityId = document.getElementById("searchInputId").value;
            let cityLAT = document.getElementById('searchInputLAT').value;
            let cityLNG = document.getElementById('searchInputLNG').value;
            let newEntry = {
                "cityId": cityId,
                "cityName": searchCity,
                "cityLAT": cityLAT,
                "cityLNG": cityLNG
            }

            // Check if an item already exists in the array and either add new or delete and add
            let validateCity = searchItems.filter(city =>(city.cityId === cityId));
            let cityIndex = searchItems.findIndex(city => city.cityId === cityId);
            if (validateCity.length === 0 && newEntry.cityId.length > 0) {
                // Does not exist in array so add
                searchItems.push(newEntry);
            } else if (newEntry.cityId.length > 0 && cityIndex != -1) {
                // Does exist in the array so delete and add
                searchItems.splice(searchCity, 1);
                searchItems.push(newEntry);
            } else if (cityIndex != -1){
                // Delete entry in the array
                searchItems.splice(searchCity, 1);
            }
            
            // Store changes back to local storage
            localStorage.setItem("weatherDashboard_searchItems", JSON.stringify(searchItems));
    
            // Render Search history
            renderSearchHistory();

        } 

        // Render Results column
        renderResults(cityId);
    }
})

google.maps.event.addListener(autocomplete, "place_changed", function() {
    let searchPlace = autocomplete.getPlace();
    
    document.getElementById('searchInputId').value = searchPlace.place_id;
    document.getElementById('searchInputLAT').value = searchPlace.geometry.location.lat();
    document.getElementById('searchInputLNG').value = searchPlace.geometry.location.lng();
    

})


