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
    $searchColumnDiv.addClass("col-sm-3 col-md-3 col-lg-3");
    
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

    let $searchInputLAT = $("<input>");
    $searchInputLAT.attr("id", "searchInputLAT");
    $searchInputLAT.attr("type", "hidden");

    let $searchInputLONG = $("<input>");
    $searchInputLONG.attr("id", "searchInputLNG");
    $searchInputLONG.attr("type", "hidden");

    $searchInputDiv.append($searchInput);
    $searchInputDiv.append($searchInputLAT);
    $searchInputDiv.append($searchInputLONG);
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

    // Render Search history
    renderSearchHistory();

    searchInput = document.getElementById("searchInput");

    // Build the Results column

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
        return a.searchCity - b.searchCity
    });

    for (let i = 0; i < searchItems.length; i++) {
        let $searchHistoryButton = $("<button>");
        $searchHistoryButton.attr("id", `searchHistory_item${i}`);
        $searchHistoryButton.addClass("button searchHistory");
    
        let $searchButtonSpan = $("<span>");
        $searchButtonSpan.text(searchItems[i].searchCity);

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

        // Set the new entry for the array
        let searchCity = document.getElementById("searchInput").value.trim();
        let cityLAT = document.getElementById('searchInputLAT').value;
        let cityLNG = document.getElementById('searchInputLNG').value;
        let newEntry = {
            "searchCity": searchCity,
            "cityLAT": cityLAT,
            "cityLNG": cityLNG
        }

        // Check if an item already exists in the array and either add new or delete and add
        let validateCity = searchItems.filter(city =>(city.searchCity === searchCity));
        let cityIndex = searchItems.findIndex(city => city.searchCity === searchCity);
        if (validateCity.length === 0 && newEntry.searchCity.length > 0) {
            // Does not exist in array so add
            searchItems.push(newEntry);
        } else if (newEntry.searchCity.length > 0 && cityIndex != -1) {
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
})

google.maps.event.addListener(autocomplete, "place_changed", function() {
    let searchPlace = autocomplete.getPlace();

    document.getElementById('searchInputLAT').value = searchPlace.geometry.location.lat();
    document.getElementById('searchInputLNG').value = searchPlace.geometry.location.lng();

})


