// ------------- Assignment Code -------------


// ---------------- Functions ----------------
// Run on web page load
function init() {
    renderHeader();
    renderMainContent();
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
    let $searchInput = $("<input>");
    $searchInput.attr("id", "searchInput");
    $searchInput.attr("type", "text");
    $searchInput.addClass("textarea");
    $searchColumnDiv.append($searchInput);

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


    // Append Search to main content
    $("main").append($searchColumnDiv);

    // Build the Results column

}

// Calls init to retrieve data and render it to the page on load
init();

// ------------- Event Listeners -------------
