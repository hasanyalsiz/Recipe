export class Search{
    constructor(query){
        this.query = query;
        this.result = [];
    }

    async getResults(){
        // istek atma
       const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`
        );
        // gelen veriyi işleme
        const data = await res.json()

        // geşen veriyi sınıf yardımıyla oluşturduğumuz objenin içine aktar.
        this.result = data.recipes;
    }
}