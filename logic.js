var searchBtn = document.getElementById("searchBtn");
var searchBox = document.getElementById("searchBox");
var searchMessage = document.getElementById("searchResultsAre")



var searchInput = document.querySelector("#searchBar");
var searchBtn = document.querySelector("#searchBtn");

//for loading saved nominations onscreen
function loadNominations() {
    //forEach loop pulls movie data from local storage by stored key
    Object.keys(localStorage).forEach(function (item, i) {
       

        let uniqueID = localStorage.key([i])
        let movieDetails = JSON.parse(localStorage.getItem(uniqueID))
        let savedTitle = movieDetails.title
        let savedYear = movieDetails.year

        let nominatedMovies = document.querySelector("#nominatedMovies")
        let listItem = document.createElement("li")
        let button = document.createElement("button")

        listItem.classList.add("list-group-item")
        button.classList.add("btn")
        button.classList.add("btn-secondary")
        button.classList.add("float-right")

        listItem.innerText = `${savedTitle} (${savedYear}) `;
        button.innerText = "Remove";
        listItem.append(button);
        nominatedMovies.append(listItem);

        button.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("You CLICKED ME!")
            listItem.remove();
            localStorage.removeItem(uniqueID)
        })



    })

}
//for determining if a movie is nominated or not based on unique ID. If it is truthy it is, undefined or falsy is not nominated
function isMovieNominated(uniqueID) {

    return Object.keys(localStorage).indexOf(uniqueID) >= 0
}



// Our Search box Functionality, Also calls the display movie function
document.querySelector("#searchBtn").addEventListener("click", function (event) {
    event.preventDefault();
    $("#movieResults").empty()

    let search = searchInput.value.trim();



    if (search === "") {
        searchMessage.innerText = "Search cannot be blank!"

    } else {

        displayMovies(search);
    }
});



// for displaying searched movies
function displayMovies(userInput) {
    //API key and query URL
    const apiKey = "b3284248";

    queryUrl = "https://www.omdbapi.com/?apikey=" + (apiKey) + "&s=" + (userInput)



    //our ajax API call
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (results) {
        //everything here is dependent on an actionable response from our API call. If not there is basic error handling after this function
        //displays search result message
        searchMessage.innerHTML = `Search Results for "${userInput}"`;


        console.log(results)

        // for rendering our search results with forEach loop
        Object.values(results).forEach(function (item, i) {

            //declaring variables from returned API call
            let movieTitle = results.Search[i].Title;
            let movieYear = results.Search[i].Year;
            let uniqueID = results.Search[i].imdbID;





            //identifying target area of page to render results
            let movieResults = document.querySelector("#movieResults");
            //creating elements to render
            let listItem = document.createElement("li");
            let button = document.createElement("button");
            //adding classes to elements
            listItem.classList.add("list-group-item")
            button.classList.add("btn")
            button.classList.add("btn-secondary")
            button.classList.add("float-right")

            //disabling nomination button if movie exists in local storage and onscreen at the same time
            if (isMovieNominated(uniqueID)) {
                button.classList.add("disabled")
            }
            //adding ID to button
            button.setAttribute("id", `"${uniqueID}"`)

            //assigning inner text, appending button, appending list item
            listItem.innerText = `${movieTitle} (${movieYear})`
            button.innerText = "Nominate";
            listItem.append(button);
            movieResults.append(listItem);
            //creating event listener, onclick functionality
            button.addEventListener("click", function (event) {
                event.preventDefault();

                //for disabling a nomination button after it's clicked
                let thisButton = document.getElementById(`"${uniqueID}"`)
                thisButton.classList.add("disabled")



                //formatting our result to be used later in local storage. This also saves us from having to do extra API calls when doing a page reload
                let storedMovie = {
                    title: `${movieTitle}`,
                    year: `${movieYear}`
                }
                //for setting maximum number of nominations
                if (localStorage.length > 4) {
                    
                    $('#6nominations').modal('show')
                            
                     
                    
                    return
                } else {
                    //nomination button also pushes item to local storage

                    localStorage.setItem(uniqueID, JSON.stringify(storedMovie))
                }

                //same logic here as when we rendered our search results
                let listItem = document.createElement("li")
                let button = document.createElement("button")

                listItem.classList.add("list-group-item")
                button.classList.add("btn")
                button.classList.add("btn-secondary")
                button.classList.add("float-right")
                button.setAttribute("id", `"remove${uniqueID}"`)

                listItem.innerText = `${movieTitle} (${movieYear})`
                button.innerText = "Remove"
                listItem.append(button);
                nominatedMovies.append(listItem)

                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    // if a movie is removed from the nomination list while it's still a search result, this reactivates the search result nomination button
                    let searchResultButton = document.getElementById(`"${uniqueID}"`)

                    if (searchResultButton) {
                        searchResultButton.classList.remove("disabled")
                    }

                    console.log("You CLICKED ME!")
                    listItem.remove();
                    localStorage.removeItem(uniqueID)
                })




            })





        })



        //basic error handling if we don't get anything actionable from our API call (usually either too many results or undefined)
    }).fail(function(){
        searchMessage.innerHTML = `Couldn't find results for "${userInput}"`;
        console.log("Too Many Search Results");
    });










}
//function call to load stored nominations on page load
loadNominations();



