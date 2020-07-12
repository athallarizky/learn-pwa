var vm = new Vue({
  el: "#app",
  data: {
    uri: "https://my-json-server.typicode.com/brexcool/fake-api/products",
    currentColor: "",
    colors: [],
    products: [],
  },

  created: async function () {
    // Checking if service worker available or not
    
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js").then(
          function (registration) {
            // Registration was successful
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope
            );
          },
          function (err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
          }
        );
      });
    }

    await axios.get(this.uri).then(async (res) => {
      await this.products.push(res.data);
      await res.data.map((car) => {
        if (!this.colors.includes(car.carColor)) this.colors.push(car.carColor);
      });
    });
  },

  methods: {
    updateCarInfo: async function (e) {
      let color = e.target.value;
      let _uri = color === "all" ? this.uri : this.uri + "?carColor=" + color;
      this.products = [];
      await axios.get(_uri).then((res) => this.products.push(res.data));
    },
  },
});
