class ScoreBoard {
  constructor(config) {
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })
  }

  get valuePercent() {
    if (this.id !== "sp") {
      const percent = this.value / this.maxValue * 100;
      return percent > 0 ? percent : 0;
    } else {
      return 100;
    }
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("ScoreBoard");
    this.hudElement.setAttribute("data-scoreboard", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    if (this.id === "sp") {
      this.hudElement.setAttribute("score-type", "amount");
      this.hudElement.innerHTML = (`
        <p class="Stat_name">${this.name}</p>
        <div class="Stat_character_crop">
          <img class="Stat_character" alt="${this.name}" src="${this.src}" />
        </div>
        <img class="Stat_type" src="${this.icon}" alt="${""}" />
        <p class="Espees"></p>
        <p class="Stat_status"></p>
      `);
    } else {
      this.hudElement.setAttribute("score-type", "percent");
      this.hudElement.innerHTML = (`
        <p class="Stat_name">${this.name}</p>
        <div class="Stat_character_crop">
          <img class="Stat_character" alt="${this.name}" src="${this.src}" />
        </div>
        <img class="Stat_type" src="${this.icon}" alt="${""}" />
        <svg viewBox="0 0 26 3" class="Stat_value-container">
          <rect x=0 y=0 width="0%" height=3 fill="#82ff71" />
          <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
        </svg>
        <p class="Stat_status"></p>
      `);
      this.valueFills = this.hudElement.querySelectorAll(".Stat_value-container > rect");
    }

    this.imageElement = document.createElement("img");
    this.imageElement.classList.add("Stat_visual");
    this.imageElement.setAttribute("src", this.src );
    this.imageElement.setAttribute("alt", this.name );

  }

  update(changes={}) {
    //Update anything incoming
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    //Update active flag to show the correct image & hud
    this.hudElement.setAttribute("data-active", true);
    this.imageElement.setAttribute("data-active", true);

    //Update HP & XP percent fills
    console.log(`${this.valuePercent}%`);
    if (this.id === "sp") {
      console.log(this.value);
      const EspeesElement = this.hudElement.querySelector(".Espees");
      EspeesElement.innerText = this.value;
    } else {
      this.valueFills.forEach(rect => rect.style.width = `${this.valuePercent}%`)
    }

    //Update status
    const statusElement = this.hudElement.querySelector(".Stat_status");
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.style.display = "block";
    } else {
      statusElement.innerText = "";
      statusElement.style.display = "none";
    }
  }

  getReplacedEvents(originalEvents) {

    if (this.status?.type === "clumsy" && utils.randomFromArray([true, false, false])) {
      return [
        { type: "textMessage", text: `${this.name} flops over!` },
      ]
    }

    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "saucy") {
      return [
        { type: "textMessage", text: "Feelin' saucy!" },
        { type: "stateChange", recover: 5, onCaster: true }
      ]
    } 
    return [];
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;
      if (this.status.expiresIn === 0) {
        this.update({
          status: null
        })
        return {
          type: "textMessage",
          text: "Status expired!"
        }
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.imageElement);
    this.update();
  }

}