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
    // Build the Search column
    let $searchColumnDiv = $("<div>");
    $searchColumnDiv.attr("id", "search");
    $searchColumnDiv.addClass("col-md-3");
    
    // Build Search column title
    let $searchTitleH2 = $("<h2>");
    $searchTitleH2.addClass("display-6");
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
    $searchButton.addClass("button");

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
    $("main").append($searchColumnDiv);

    // Build the Results column
    let $resultsColumnDiv = $("<div>");
    $resultsColumnDiv.attr("id", "results");
    $resultsColumnDiv.addClass("col-md-9");

    // Append the Results to the main content
    $("main").append($resultsColumnDiv);

    // Render Search history
    renderSearchHistory();

    searchInput = document.getElementById("searchInput");
}

// Create the Search history
function renderSearchHistory() {
    $("#searchHistory").empty();
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
        $searchHistoryButton.addClass("button searchHistory");
    
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
            // Build Result column title
            $("#results").empty();
            let $resultsTitleH2 = $("<h2>");
            $resultsTitleH2.addClass("display-6");
            $resultsTitleH2.text(searchItems[i].cityName);

            // Append the results to the Results column
            $("#results").append($resultsTitleH2);
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

    console.log(searchPlace);

    document.getElementById('searchInputId').value = searchPlace.place_id;
    document.getElementById('searchInputLAT').value = searchPlace.geometry.location.lat();
    document.getElementById('searchInputLNG').value = searchPlace.geometry.location.lng();
    

})


