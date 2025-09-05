const categoryContainer = document.getElementById("category-container");
const showNewsContainer = document.getElementById("showNewsByCategory");
const bookmarkContainer = document.getElementById("bookmark-container");
const viewDetailContainer = document.getElementById("view-details");

let bookmarks = [];

// load------------------------------------
const loadCategory = () => {
    const url = "https://news-api-fs.vercel.app/api/categories";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showCategory(data.categories);
        })
        .catch(err => {
            console.log(err);
        })
}

const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `
            <li id="${cat.id}" class="cursor-pointer hover:border-b-4 border-red-600">${cat.title}</li>
        `;
    const firstLi = document.querySelector("#main");
    firstLi.classList.add("border-b-4");
  });
};


const loadNewsByCategory = (categoryId) => {
    const url = `https://news-api-fs.vercel.app/api/categories/${categoryId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        showNewsByCategory(data.articles);
      })
      .catch((err) => {
        showError();
      });
}

const showNewsByCategory = (articles) => {
    if(articles.length === 0){
        showEmptyMessage();
        return
    };
   
    showNewsContainer.innerHTML = "";
    articles.forEach(article => {
        showNewsContainer.innerHTML += `
            <div class="border-1 border-gray-300 rounded-md">
                <img class="rounded-md" src="${article.image.srcset[5].url}">
                <div id="${article.id}" class="p-2 mb-2">
                    <h2 class="font-bold ">${article.title}</h2>
                    <p class="mt-2 text-sm">${
                      article.time ? article.time : "১ সপ্তাহ আগে"
                    }</p>
                </div>
                <div class="flex justify-between px-2">
                    <button class="btn">Bookmark</button>
                    <button onclick="view_detail_modal.showModal()" class="btn">View Details</button>
                </div>
            </div>
        `;
    })
}

categoryContainer.addEventListener("click", (e) => {
  const allLi = document.querySelectorAll("li");
  allLi.forEach((li) => {
    li.classList.remove("border-b-4");
  });
  if (e.target.localName === "li") {
    e.target.classList.add("border-b-4");
    loadNewsByCategory(e.target.id);
  }
});

showNewsContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Bookmark") {
    handleBookmark(e);
  }
  if(e.target.innerText === "View Details"){
    handleViewDetails(e)
  }
});

const handleBookmark = (e) => {
  const title = e.target.parentNode.parentNode.children[1].children[0].innerText;
  const id = e.target.parentNode.parentNode.children[1].id;
  const allReadyExist = bookmarks.some((a) => a.id === e.target.parentNode.parentNode.children[1].id);
  if(!allReadyExist){
    bookmarks.push({
      title: title,
      id: id,
    });
    showBookmark(bookmarks);
  }
};


const showBookmark = (bookmarks) => {
    bookmarkContainer.innerHTML = "";
    bookmarks.forEach(bookmark => {
        bookmarkContainer.innerHTML += `
            <div class=" shadow-sm p-2 mt-2 rounded-md">
                <h2 class="font-semibold">${bookmark.title}</h2>
                <div class="flex justify-end"><button onclick="handleDeleteBookmark('${bookmark.id}')" class="btn btn-sm">Delete</button></div>           
            </div>
        `;
    })
}


const handleDeleteBookmark = (bookmarkId) => {
  const filteredBookmark = bookmarks.filter(
    (bookmark) => bookmark.id !== bookmarkId
  );
  bookmarks = filteredBookmark;
  showBookmark(bookmarks);
};


const handleViewDetails = (e) => {
    const id = e.target.parentNode.parentNode.children[1].id;
    const url = `https://news-api-fs.vercel.app/api/news/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showDetails(data.article)
        })
        .catch(err => {
            console.log(err);
        })
}

const showDetails = (article) => {
    viewDetailContainer.innerHTML = `
        <h2 class="font-semibold text-lg">${article.title}</h2>
        <p>${article.timestamp}</p>
        <img src="" alt="">
    `;
}


const showError = () => {
    showNewsContainer.innerHTML = `
        <div class="text-center font-bold text-3xl col-span-3 text-gray-500 mt-5">Something went wrong?</div>
    `
}

const showEmptyMessage = () => {
    showNewsContainer.innerHTML = `
        <div class="text-center font-bold text-3xl col-span-3 text-gray-500 mt-5">No news found for this category!</div>
    `;
}


loadCategory();
loadNewsByCategory("main");