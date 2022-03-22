class PlayerState {
  constructor() {
    this.stats = {
      "Well-being": {
        id: "wb",
        name: "Well-being",
        src: "/Exitus_assets/heart.png",
        icon: "",
        team: "player",
        value: 50,
        maxValue: 100,
        status: null,
      },
      "Knowledge": {
        id: "k",
        name: "Knowledge",
        src: "/Exitus_assets/book.png",
        icon: "",
        team: "player",
        value: 50,
        maxValue: 100,
        status: null,
      },
      "Spiritual Growth": {
        id: "sg",
        name: "Spiritual Growth",
        src: "/Exitus_assets/cross.png",
        icon: "",
        value: 50,
        maxValue: 100,
        status: null,
      },
      "Social Status": {
        id: "ss",
        name: "Social Status",
        src: "/Exitus_assets/party.png",
        icon: "",
        value: 50,
        maxValue: 100,
        status: null,
      },
      "Espees": {
        id: "sp",
        name: "Espees",
        src: "/Exitus_assets/money.png",
        icon: "",
        value: 200,
        status: null,
      },
    }
    this.lineup = ["Well-being", "Knowledge", "Spiritual Growth", "Social Status", "Espees"];
    this.items = [
      // { actionId: "item_recoverHp", instanceId: "item1" },
      // { actionId: "item_recoverHp", instanceId: "item2" },
      // { actionId: "item_recoverHp", instanceId: "item3" },
    ]
    this.storyFlags = {};
  }

  // addPizza(pizzaId) {
  //   const newId = `p${Date.now()}`+Math.floor(Math.random() * 99999);
  //   this.pizzas[newId] = {
  //     pizzaId,
  //     hp: 50,
  //     maxHp: 50,
  //     xp: 0,
  //     maxXp: 100,
  //     level: 1,
  //     status: null,
  //   }
  //   if (this.lineup.length < 3) {
  //     this.lineup.push(newId)
  //   }
  //   utils.emitEvent("LineupChanged");
  //   console.log(this)
  // }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    utils.emitEvent("LineupChanged");
  }

  moveToFront(futureFrontId) {
    this.lineup = this.lineup.filter(id => id !== futureFrontId);
    this.lineup.unshift(futureFrontId);
    utils.emitEvent("LineupChanged");
  }

}
window.playerState = new PlayerState();