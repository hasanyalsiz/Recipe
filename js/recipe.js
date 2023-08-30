import { elements,setLocalStorage,getFromLocal } from "./helpers.js";

export class Recipe {
  constructor() {
    // beğenilen elemanların dizisi
    this.likes = getFromLocal("likes") || [];
    // tarif hakkında bütün bilgiler
    this.info = {};
    // tarifin malzemeleri  
    this.ingredients = [];

    // local'den alınan elemanları ekran basma
    this.renderLikes();
  }

  //   tarif bilgilerini alma
  async getRecipe(id) {
    // verileri alma
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/get?rId=${id}`
    );
    // verileri işleme
    const data = await res.json();
    // class'ın içerisine aktarma
    this.info = data.recipe;
    this.ingredients = data.recipe.ingredients;
  }

  // her bir tarif için tarifi temsil eden liste elemanı oluşturur
  createIngredient() {
    const html = this.ingredients
      .map(
        (ingredient) => `
              <li>
                <i class="bi bi-check-circle"></i>
                <p>${ingredient}</p>
              </li>
    `
      )
      .join("");

    return html;
  }

  //   bu bilgileri ekran basma
  renderRecipe(recipe) {
    const markup = `
         <figure>
            <img
              src=${recipe.image_url}
            />
            <h1>${recipe.title}</h1>

            <p class="like-area">
            <i id="like-btn" class="bi ${this.isRecipeLiked() ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </p>
          </figure>

          <div class="ingredients">
            <ul>
              ${this.createIngredient()}
            </ul>
            <button id="add-to-basket">
              <i class="bi bi-cart2"></i>
              <span>Add To Baset</span>
            </button>
          </div>
          <div class="directions">
            <h2>How To Cook ?</h2>
            <p>
              Bu tarif dikkatlice
              <span>${recipe.publisher}</span> tarafından
              hazırlanmış ve test edilmiştir. Diğer detaylara onların
              websitesi üzerinden erişebilirsiniz.
            </p>
            <a href="${recipe.source_url}" target="_blank">Instruction</a>
          </div>
    `;

    elements.recipeArea.innerHTML = markup;
  }

  // eleman daha önce like verilmiş mi kontrol etme
  isRecipeLiked() {
    const found = this.likes.find((i) => i.id === this.info.recipe_id);
    return found;
  }

  // like'lama olayrını kontrol eder
  controlLike() {
    // like'lanan elemanın  değerlerini alma
    const newObject = {
      id: this.info.recipe_id,
      img: this.info.image_url,
      title: this.info.title,
    };

    // eleman daha önce eklenmiş ise çalışır
    if (this.isRecipeLiked()) {
      // tarifi likes dizisinden kaldırma
      this.likes = this.likes.filter((i) => i.id !== newObject.id);
    } else {
      // yok ise likes dizisine ekleme
      this.likes.push(newObject);
    }
    // like'ları local'e ekle
    setLocalStorage("likes",this.likes);

    // arayüzü güncel tutma
    this.renderRecipe(this.info);

    // html listesini günceller
    this.renderLikes();
  }
  // render likes ekrana basma
  renderLikes() {
    const html = this.likes.map(
      (item) => `
            <a href="#${item.id}">
              <img src="${item.img}">
              <p>${item.title}</p>
            </a>
`
    );
    elements.likeList.innerHTML = html;
  }
}
