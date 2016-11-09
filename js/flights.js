var HKGflights = {
  flight1: {
    destination: {
      id: "NRT",
      city: "Tokyo",
      country: "Japan"
    },
    depart: "16-30",
    arrive: "19-30",
    price: "230"
  },
  flight2: {
    destination: {
      id: "HND",
      city: "Tokyo",
      country: "Japan"
    },
    depart: "11-30",
    arrive: "15-30",
    price: "270"
  }
}

var flights = {
  HKG: {
    destination: {
      HND: {
        city: "Tokyo",
        country: "Japan",
        depart: "11-30",
        arrive: "15-30",
        price: "270"
      },
      NRT: {
        city: "Tokyo",
        country: "Japan",
        depart: "16-30",
        arrive: "20-30",
        price: "230"
      }
    }
  }
}
