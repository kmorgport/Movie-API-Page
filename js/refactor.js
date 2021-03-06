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
const updateMovie = document.getElementById('update')
const jsonid = document.getElementById('id')

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
    title.setAttribute("id",`${movieId}b`)
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

//kmorgport
function movieManipulation(id, method, title){
    fetch(`https://apple-veil-game.glitch.me/movies/${id}`, method)
        .then(response =>console.log(response))
        .catch(error =>console.log(error))
    let cardTitle = document.getElementById(`${id}b`)
    cardTitle.innerText = title;
}

//james-mcbride

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
//james-mcbride
newMovieInput.addEventListener("keyup",() =>{
    let movieSearchValue=document.getElementById("newMovieInput").value
    movieSearchValue.replace(' ', "+")
    if (movieSearchValue.length>5) {
        searchMoviesDropdown(movieSearchValue)

    } else if (movieSearchValue.length===0){
        searchDropdown.innerHTML=""
    }


})

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
                return movie.id
            })
        return data
    }).then(id =>{
        let button = document.getElementById(id)
        button.addEventListener('click',()=>{
            fetch(`https://apple-veil-game.glitch.me/movies/${id}`, deleteMethod)
                .then(response=>console.log(response))
                .catch(error =>console.log(error))
            let card = document.getElementById(`${id}a`)
            let row = card.parentNode
            row.removeChild(card)
        })
    })
}

fetch("https://apple-veil-game.glitch.me/movies", getOptions)
    .then( response => response.json() )
    .then(movies => {
        movies.forEach(movie=>{
            createCard(movie.title, movie.poster, movie.genre, movie.id)
        })
        //This hides the loading div, which was running up until all of the cards were generated.
        $("#loading").hide()
        movieSearch.addEventListener('click',()=>{
            autoFillModal()
        })
        submitMovie.addEventListener('click',()=>{
            postToDatabase()
        })
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
            console.log(id)
            fetch(`https://apple-veil-game.glitch.me/movies/${id}`, getOptions)
                .then(response=>response.json())
                .then(data=>{
                    title.placeholder = data.title
                    title.value = data.title
                    rating.placeholder = data.rating[0]
                    rating.value = data.rating[0]
                    Year.placeholder = data.year
                    Year.value = data.year
                    jsonid.value = data.id
                    Genre.placeholder = data.genre
                    Genre.value = data.genre
                    director.placeholder = data.director
                    director.value = data.director
                    plot.placeholder = data.plot
                    plot.value = data.plot
                    actors.placeholder = data.actors
                    actors.value = data.actors

                })
            // let update = document.getElementById(`${id}b`)
            // update.innerText = updateObj.title;

        })

    })
    updateMovie.addEventListener('click',()=>{
        let updateReq = {
            title: title.value,
            rating: rating.value,
            year: Year.value,
            genre: Genre.value,
            director: director.value,
            plot: plot.value,
            actors: actors.value,
            id : jsonid.value
        }
        console.log(updateReq)
        const patchMethod = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateReq)
        }
        movieManipulation(updateReq.id, patchMethod, updateReq.title);

    })
})