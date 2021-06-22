// ------------- Assignment Code -------------


// ---------------- Functions ----------------
// Run on web page load
function init() {
    renderHeader();
}

function renderHeader() {
    // Build the header
    let $headerTitleH1 = $("<h1>");
    $headerTitleH1.addClass("display-5");
    $headerTitleH1.text("Weather Dashboard");

    // Append to the header on the page
    $("header").append($headerTitleH1)
}

// Calls init to retrieve data and render it to the page on load
init();

// ------------- Event Listeners -------------
