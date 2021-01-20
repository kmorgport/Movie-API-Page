"use strict"
const movieSearch = document.getElementById('movieSearchButton')
const movieTitle = document. getElementById('addMovieTitle')
const movieYear = document.getElementById('addMovieYear')
const movieGenre = document.getElementById('addMovieGenre')
const imdbID = document.getElementById('addImdbID')
const submitMovie = document.getElementById('submit')
const searchDropdown = document.getElementById("searchResults")
const newMovieInput = document.getElementById("newMovieInput")
let movieID="";
const title = document.getElementById('title')
const rating = document.getElementById('rating')
const Year = document.getElementById('year')
const Genre = document.getElementById('genre')
const director = document.getElementById('director')
const plot = document.getElementById('plot')
const actors = document.getElementById('actors')

function createCard(movieTitle, poster, genre, movieId){
    const allRow = document.getElementById('allRow')
    const card = document.createElement('div')
    card.setAttribute('class','card m-3 col-3 w-auto')
    card.setAttribute('id',`${movieId}a`)
    const image = document.createElement('img')
    image.setAttribute('src',`${poster}`)//add json property here
    image.setAttribute('class','card-img-top')
    const cardBody = document.createElement('div')
    cardBody.setAttribute('class','card-body text-center')
    const title = document.createElement('h5');
    title.setAttribute('class','card-title')
    title.innerText = `${movieTitle}` //add Jason object property here
    // const anchor = document.createElement('a')
    // anchor.innerText = 'View Profile'
    // anchor.setAttribute('href','#')
    // anchor.setAttribute('class','btn btn-primary')
    // anchor.setAttribute('data-micromodal-trigger','modal-2')
    const button = document.createElement('button')
    button.setAttribute('type','button')
    button.setAttribute('class','btn btn-primary edit')
    button.setAttribute('data-toggle','modal')
    button.setAttribute('data-target','#modal2')
    button.innerText = 'Information'
    const deleteButton = document.createElement('button')
    deleteButton.setAttribute('type','button')
    deleteButton.setAttribute('class','btn btn-danger delete')
    deleteButton.setAttribute('id', movieId)
    deleteButton.innerText = 'Delete'
    cardBody.appendChild(title)
    cardBody.appendChild(button)
    cardBody.appendChild(deleteButton)
    // cardBody.appendChild(anchor)
    card.appendChild(image)
    card.append(cardBody)
    allRow.appendChild(card)
    sortMovieGenre(genre, card)
}
MicroModal.init()

//This function takes a text input, and plugs it into the OMDB API. The OMDB API only returns information for full words. If the API detects a full word,
//it pushes all of the movies that it detects containing that word onto an array. This function is grabbing all of those returned movies from the API, and returning them
//as an array.

//created together
function autoFillModal(){
    // movieGenre.placeholder = 'test'
    // movieTitle.placeholder = 'test'
    // movieYear.placeholder = 'test'
    let movieSearch=document.getElementById("newMovieInput").value
    movieSearch.replace(' ', "+")
    retrieveSearchedMovies(movieSearch)



    // movieTitle.placeholder = jsonObj.Search[0].Title
    // movieYear.placeholder = jsonObj.Search[0].Year
}

//james-mcbride
function retrieveSearchedMoviesGenre(){
    // this commented out promise takes the movies provided by the OMDB API,. accesses the TMDB API, and grabs each movies genre.

    fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${TMDB_TOKEN}&language=en-US`)
        .then(response => response.json())
        .then(image => {
            let genre = image.genres
            let genreString = ""
            genre.forEach(element=>genreString+=element.name+" ")
            movieGenre.placeholder = genreString
            movieGenre.value = genreString
        })
        .catch(error => console.log(error))

    /* review was created successfully */
}

//this function will grab the top movie match from the add movies search bar, when the search bar is hit.
//james-mcbride
function retrieveSearchedMovies(movie) {
    var movieInfo=[]
    fetch(`http://www.omdbapi.com/?s=${movie}&apikey=${OMDB_TOKEN}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response==="True") {
                for (let i = 0; i < data.Search.length; i++) {
                    movieInfo.push(data.Search[i])
                }
            }
            if (movieInfo.length>0){
                movieTitle.placeholder = movieInfo[0].Title
                movieTitle.value = movieInfo[0].Title
                movieYear.placeholder = movieInfo[0].Year
                movieYear.value = movieInfo[0].Year
                movieID = movieInfo[0].imdbID
                imdbID.placeholder = movieID
                imdbID.value = movieID
            }
            return data
        })
        .then(data=> {
            retrieveSearchedMoviesGenre()
        })
}

//this function will be run as the search input is typed. It will add add a dropdown suggestion list.
//james-mcbride
function searchMoviesDropdown(movie) {
    let movieInfo=[]
    fetch(`http://www.omdbapi.com/?s=${movie}&apikey=${OMDB_TOKEN}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response==="True") {
                console.log(data)
                for (let i = 0; i < data.Search.length; i++) {
                    movieInfo.push(data.Search[i])
                }
            }
            if (movieInfo.length>0){
                console.log(movieInfo)
                let dropdownHTML=""
                movieInfo.forEach((element, index) => {
                    if (index<=2) {
                        dropdownHTML += `<div class="dropDownMovie"> ${element.Title}</div>`
                    }
                })
                searchDropdown.innerHTML = dropdownHTML

            }
            console.log(movieID)
        })
        .then(data=> {
            // let movieSearchValue=document.getElementById("newMovieInput").value
            let dropDownElements=document.getElementsByClassName("dropDownMovie")
            for (let i=0; i<dropDownElements.length; i++){
                dropDownElements[i].addEventListener("click", ()=>{
                    document.getElementById("newMovieInput").value=dropDownElements[i].innerText
                    searchDropdown.innerHTML=""

                })
            }
        })


        .catch(error => console.error(error)); /* handle errors */
    return movieInfo
}




const getOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    // body: JSON.stringify(reviewObj),
};

const deleteMethod = {
    method: 'DELETE'
}
//lines 181-92 james-mcbride : lines 193-231 kmorgport
//This promise loads the movies from glitch, and makes a card for each movie in the JSON file.
fetch("https://apple-veil-game.glitch.me/movies", getOptions)
    .then( response => response.json() )
    .then(data => {
        console.log(data)
        for (let i=0; i<data.length; i++) {
            createCard(data[i].title, data[i].poster, data[i].genre, data[i].id)
        }
        //This hides the loading div, which was running up until all of the cards were generated.
        $("#loading").hide()
        return [...document.getElementsByClassName('delete')]
    }).then(buttons=>{
    buttons.forEach(button=>{
        let id = button.id
        button.addEventListener('click',()=>{
            fetch(`https://apple-veil-game.glitch.me/movies/${id}`, deleteMethod)
                .then(response=>console.log(response))
                .catch(error=>console.log(error))
            let card = document.getElementById(`${id}a`)
            let row = card.parentNode
            row.removeChild(card)
        })
    })
    return [...document.getElementsByClassName('edit')]
}).then(editButtons =>{
    editButtons.forEach(button =>{
        let sibling = button.nextElementSibling
        let id = sibling.id
        button.addEventListener('click',()=>{
            fetch(`https://apple-veil-game.glitch.me/movies/${id}`, getOptions)
                .then(response=>response.json())
                .then(data=>{
                    console.log(data)
                    title.placeholder = data.title
                    title.value = data.title
                    rating.placeholder = data.rating[1]
                    rating.value = data.rating[1]
                    Year.placeholder = data.year
                    Year.value = data.year
                    Genre.placeholder = data.genre
                    Genre.value = data.genre
                    director.placeholder = data.director
                    director.value = data.director
                    plot.placeholder = data.plot
                    plot.value = data.plot
                    actors.placeholder = data.actors
                    actors.value = data.actors
                })
        })
    })
})
    /* review was created successfully */
    .catch( error => console.error(error) ); /* handle errors */

//This event listener is waiting for the add movies search bar to be typed in, and will suggest movies as the titles are typed by the user.
newMovieInput.addEventListener("keyup",() =>{
    let movieSearchValue=document.getElementById("newMovieInput").value
    movieSearchValue.replace(' ', "+")
    if (movieSearchValue.length>5) {
        searchMoviesDropdown(movieSearchValue)

    } else if (movieSearchValue.length===0){
        searchDropdown.innerHTML=""
    }


})

// console.log(movieOption)
//james-mcbride and kmorgport
movieSearch.addEventListener('click',()=>{
    autoFillModal()

})
//kmorgport
submitMovie.addEventListener('click',()=>{
    postToDatabase()
})
//kmorgport
function postToDatabase(){
    let movie = imdbID.value
    fetch(`http://www.omdbapi.com/?i=${movie}&apikey=${OMDB_TOKEN}`)
        .then(response => response.json())
        .then(data => {
            let movieObj = {
                title: data.Title,
                rating: data.Ratings[1],
                poster: data.Poster,
                year: data.Year,
                genre: data.Genre,
                director: data.Director,
                plot: data.Plot,
                actors: data.Actors,
            }
            return {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieObj)
            }

        }).then(postOpt=>{
        fetch("https://apple-veil-game.glitch.me/movies",postOpt)
            .then(response =>console.log(response))
            .catch(error=>console.log(error))
    }).then(data=>{
        fetch("https://apple-veil-game.glitch.me/movies", getOptions)
            .then(response=>response.json())
            .then(movies=>{
                let movie = movies[movies.length-1]
                createCard(movie.title, movie.poster, movie.genre, movie.id)
            })
    })
}

//james-mcbride
let searchInput=document.getElementById("searchInput")
searchInput.addEventListener("keyup", ()=>{
    let searchInputValue=searchInput.value.toLowerCase()
    let cards = document.getElementsByClassName("card")
    for (let i=0; i<cards.length; i++){
        let currentCardText=cards[i].innerHTML.toLowerCase()
        if (currentCardText.indexOf(searchInputValue)===-1){
            cards[i].style["display"]="none"
        } else if(searchInputValue===""){
            cards[i].style["display"]="block"
        }
    }
})

//james-mcbride
function sortMovieGenre(genre, originalCard){

    let actionRow=document.getElementById("actionRow")
    let comedyRow=document.getElementById("comedyRow")
    let dramaRow=document.getElementById("dramaRow")
    let romanceRow=document.getElementById("romanceRow")
    let horrorRow=document.getElementById("horrorRow")
    let fantasyRow=document.getElementById("scififantRow")
    let movieGenres=genre.split(", ")
    let actionAdventureCounter=0;
    let scifiFantasyCounter=0;
    movieGenres.forEach((element,index) =>{
        let card=originalCard.cloneNode(true)
        if (element==="Action" || element==="Adventure"){
            if (actionAdventureCounter===0) {
                actionRow.appendChild(card)
                actionAdventureCounter++
            }
        } else if(element==="Comedy"){
            comedyRow.appendChild(card)
        } else if(element==="Drama"){
            dramaRow.appendChild(card)
        } else if(element==="Romance"){
            romanceRow.appendChild(card)
        } else if(element==="Horror"){
            horrorRow.appendChild(card)
        } else if(element==="Fantasy" || element==="Sci-Fi"){
            if (scifiFantasyCounter===0) {
                fantasyRow.appendChild(card)
                scifiFantasyCounter++
            }
        }
    })
}





