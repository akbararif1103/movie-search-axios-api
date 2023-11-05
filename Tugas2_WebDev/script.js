const main = document.querySelector(".container-film");
const apikey = "98f03ad5";

function OnChangeSearch(searchParam, page) {
  axios
    .get(`https://www.omdbapi.com/?apikey=${apikey}&s=${searchParam}&page=${page}`)
    .then((response) => {
      const movies = response.data.Search;
      if (movies === undefined) {
        const foundText = document.querySelector(".found");
        foundText.textContent = `You Searched For: '${searchParam}'`;
        main.innerHTML = notFound();
      } else {
        let cards = "";
        movies.forEach((data) => (cards += showCards(data)));
        const foundText = document.querySelector(".found");
        foundText.textContent = `You Searched For: '${searchParam}'`;
        main.innerHTML = cards;        

        const cardsDetail = document.querySelectorAll(".card-film");

        cardsDetail.forEach((detail) => {
          detail.addEventListener("click", function () {
            const imdbId = detail.getAttribute("data-id");
            axios.get(`https://www.omdbapi.com/?apikey=${apikey}&i=${imdbId}`)
              .then((response) => {
                const details = response.data;
                console.log(details);
                const movieDetail = contentDetail(details);
                const detailcontent = document.querySelector(".container-detail");
                detailcontent.style.display = "flex";
                detailcontent.innerHTML = movieDetail;
        
                const buttonx = document.querySelector(".closeDetail");
                buttonx.addEventListener("click", () => (detailcontent.style.display = "none"));
              })
              .catch((error) => {
                console.error(error);
              });
          });
        });        
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const showCards = (data) => {
  return `
    <div class="card-film" data-id="${data.imdbID}">
      <img src="${data.Poster}" alt="${data.Title}"/>
      <h3>${data.Title} (${data.Year})</h3>
      <button class="detail-button">Detail</button>
    </div>
  `;
};

const notFound = () => {
  return `
    <h1 class="notFound">Film Yang Anda Cari Tidak Ditemukan</h1>
  `;
};

const contentDetail = (data) => {
  return `
  <div class="content-detail">
  <div class="movie-poster">
    <img src="${data.Poster !== "N/A" ? data.Poster : "image_not_found.png"}" alt="movie poster">
  </div>
  <div class="movie-info">
    <h3 class="movie-title">${data.Title}</h3>
    <ul class="movie-misc-info">
      <li class="year">Year: ${data.Year}</li>
      <li class="rating">Ratings: ${data.imdbRating}</li>
      <li class="rated">Rated: ${data.Rated}</li>
      <li class="released">Released: ${data.Released}</li>
    </ul>
    <p class="genre"><b>Genre:</b> ${data.Genre}</p>
    <p class="writer"><b>Writer:</b> ${data.Writer}</p>
    <p class="actors"><b>Actors: </b>${data.Actors}</p>
    <p class="plot"><b>Plot:</b> ${data.Plot}</p>
    <p class="language"><b>Language:</b> ${data.Language}</p>
    <p class="awards"><b><i class='bx bx-trophy' ></i></b> ${data.Awards}</p>
    <button type="button" class="closeDetail"><i class='bx bx-x'></i></button>
  </div>
</div>
  `;
};

const input = document.getElementById("search");
const btnSearch = document.getElementById("btn-search");
btnSearch.addEventListener("click", () => {
  OnChangeSearch(input.value);
});

const nextPage = document.querySelector(".next");
const prevPage = document.querySelector(".prev");
const page = document.querySelector(".page-number");
let currentPage = 1;

nextPage.addEventListener("click", () => {
  currentPage++;
  page.innerText = currentPage;
  OnChangeSearch(input.value, currentPage);
});

prevPage.addEventListener("click", () => {
  if (page.innerText > 1) {
    currentPage--;
    page.innerText = currentPage;
    OnChangeSearch(input.value, currentPage);
  }
});

input.addEventListener("blur", () => {
  currentPage = 1;
  page.innerText = currentPage;
  OnChangeSearch(input.value, currentPage);
});

