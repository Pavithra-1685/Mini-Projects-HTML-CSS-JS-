const btns = document.querySelectorAll("button");
const newsContainer = document.querySelector(".news-container");
const loader = document.querySelector(".loader");


function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}


function renderNews(data) {
    newsContainer.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h3");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        card.appendChild(title);
        card.appendChild(description);
        newsContainer.appendChild(card);
    });
}

async function fetchNews(category) {
    try {
        showLoader();

        const response = await fetch(
            "https://api.sampleapis.com/futurama/episodes"
        );
        const data = await response.json();

        
        let filteredData = [];

        if (category === "technology") {
            filteredData = data.slice(0, 10);
        } else if (category === "sports") {
            filteredData = data.slice(10, 20);
        } else if (category === "business") {
            filteredData = data.slice(20, 30);
        } else if (category === "entertainment") {
            filteredData = data.slice(30, 40);
        }

        const formattedNews = filteredData.map(item => ({
            title: item.title,
            description: item.desc
        }));

        renderNews(formattedNews);
    } catch (error) {
        newsContainer.innerHTML = "<p>Failed to load news.</p>";
    } finally {
        hideLoader();
    }
}


btns.forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.textContent.toLowerCase();
        fetchNews(category);
    });
});
