// UUID IMPORT
import { v4 } from 'https://jspm.dev/uuid';
import { elements,setLocalStorage,getFromLocal,controlBtn } from "./js/helpers.js";
import { Search } from "./js/api.js";
import { clearLoader, renderLoader, renderResults,renderBasketItems, } from "./js/ui.js";
import { Recipe } from "./js/recipe.js";

const recipe = new Recipe();

//! Olay izleyicilieri
elements.form.addEventListener("submit", handleSubmit);




// uzun yol
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

//! Fonksiyonlar
async function handleSubmit(e){
    e.preventDefault();

// aratılan kelime
  const query = elements.searchInput.value;
  // arama terimi boş değilse çalışır
  if(query){
    // search sınıfının bir örneğini oluşturur.
   const search = new Search(query);

   //istek atmaya başlamadan önce loader'ı ekrana bas
    renderLoader(elements.resultList);
   // istek atma
   try{
    await search.getResults();

    // isteğe cevap gelince loader'ı ekrandan kaldır.
    clearLoader();
    

    // gelen cevabı ekrana bas
    renderResults(search.result);
   } catch(err) {
    alert("Aradığınız kriterlere uygunt tarif bulunamadı")
    clearLoader();
   }
  }
}

// tarif detaylarını alma
const controlRecipe = async () => {
  const id = location.hash.replace('#', '');
  if (id) {
    // ekran loader'ı basma
    renderLoader(elements.recipeArea);

    try {
      // tarif bilgilerini alma
      await recipe.getRecipe(id);

      // loader'ı kaldır
      clearLoader();

      // ekrana tarif arayüzünü basma
      recipe.renderRecipe(recipe.info);

      // tarif arayüzüne scroll smooth kaydırma
      elements.recipeArea.scrollIntoView({behavior:"smooth"});

    } catch (err) {
      clearLoader();
    }
  }
};

// iki farklı olayı izleme
['hashchange', 'load'].forEach((eventName) => {
  window.addEventListener(eventName, controlRecipe);
});


//! Sepet Alanı
// local storage'de sepet dizisi varsa onu al
// ama basket değeri undefined ise boş dizi tanımla
 let basket = getFromLocal("basket") || [];

 // sayfanın yüklenme olayını izleme
 document.addEventListener("DOMContentLoaded", () => {
 renderBasketItems(basket)
 // sepette eleman varsa butonu göster
 controlBtn(basket);
 
});

// tarif alanındaki tıklanmalarda çalışır
const handleClick = (e) => {
  if(e.target.id === "add-to-basket"){
    // tarifler dizisini dön
    recipe.ingredients.forEach((title) => {
      // her bir tarif için obje oluştur ve id ekle
      const newItem = {
        id: v4(),
        title,
      };

      // yeni oluşan tarifleri sepete ekle
      basket.push(newItem);
    });

    // sepeti local storage'e kaydetme
    setLocalStorage("basket",basket);

    // ekrana sepet elemanlarını basma
    renderBasketItems(basket);

    // sepete ekle butonunu göster
    controlBtn(basket);
  }

  if(e.target.id === "like-btn"){
    recipe.controlLike();
  }
};

// sepetten eleman kaldırma
const deleteItem = (e) => {  
  if(e.target.id === "delete-item"){
    // kapsayıcıya erişme
     const parent = e.target.parentElement;
     // seçilen ürünü diziden kaldırma
    basket = basket.filter((i)=> i.id !== parent.dataset.id)

    // local storage'ı güncelleme
    setLocalStorage("basket",basket);

    // elemanı HTML'den kaldırma
     parent.remove();

     // temizle butonunu kontrol eder
     controlBtn(basket);
  }
};

// sepette tümüzü temizleme
const handleClear = () => {
  // kullanıcı'dan onay alma.
 const res = confirm("Do you want to Clear All?");
 if(res){
   // local' i temizleme
    setLocalStorage("basket", null);
    // sepet dizisini sıfırlama
    basket= [];

    // butonu ortadan kaldırma
    controlBtn(basket);

  // arayüz' ü temizleme
  elements.basketList.innerHTML = "";
 }
};

// Add To Basket butonuna tıklanmayı izleme
elements.recipeArea.addEventListener("click", handleClick);

// sepet üzerinde tıklanma olaylarını izler
elements.basketList.addEventListener("click", deleteItem);

// temizle butonuna tıklanmayı izler
elements.clearBtn.addEventListener("click", handleClear);


