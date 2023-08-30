import { elements } from "./helpers.js";

// api'den gelen sonuçları ekrana basar
export const renderResults = (recipes) => {
    elements.resultList.innerHTML = "";
    // her bir obje için ekrana sonuç basma
    recipes.slice(0,10).forEach((recipe) => {
        // kart için html hazırlama
        const markup = `
        <a href="#${recipe.recipe_id}" class="result-link">
                    <img src="${recipe.image_url}">
                    <div class="data">
                        <h4>${recipe.title}</h4>
                        <p>${recipe.publisher}</p>
                    </div>
                </a>
        `;
        // oluşturduğumuz html'i ilgili yere gönderme
      elements.resultList.insertAdjacentHTML("beforeend" ,markup);
    });
};

// ekrana yüklenme gif'i basma

export const renderLoader = (parent) => {
    const loader = `
    <div class="loader">
    <img src="IMG/pizza.gif" />
    </div>
    `;
    // loader'ı bize gelen HTML elemanının içine gönderme
    parent.insertAdjacentHTML("afterbegin", loader);
};


// ekrandaki loader'ı kaldırma fonksiyonu
export const clearLoader = () => {
    // loader'ı dökümanda bul
   const loader = document.querySelector(".loader");
    // eğer bulunduysa loader'ı HTML'den kaldır
   if(loader) loader.remove();
};

// ekrana sepeti eklenen ürünleri basar
export const renderBasketItems = (items) => {
   const markup = items.map((item)=>`
    <li data-id=${item.id}>
    <i id="delete-item" class="bi bi-trash-fill"></i>
    <span>${item.title}</span>
    </li>
    `)
    .join("");

    elements.basketList.innerHTML = markup;
}

