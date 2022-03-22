class DialogueObject extends ScoreBoard {
  constructor(config, dialogue) {
    super(config);
    this.completed = false;
    this.dialogue = dialogue;
    this.questions = {};
  }

  get isActive() {
    true;
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Participant");
    this.hudElement.setAttribute("data-participant", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = (`
      <p class="Participant_name">${this.name}</p>
      <p class="Participant_level"></p>
      <div class="Participant_character_crop">
        <img class="Participant_character" alt="${this.name}" src="${this.src}" />
      </div>
      <img class="Participant_type" src="${this.icon}" alt="${this.type}" />
      <svg viewBox="0 0 26 3" class="Participant_life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 26 2" class="Participant_xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
      </svg>
      <p class="Participant_status"></p>
    `);
  }

  update(changes={}) {
    //Update anything incoming
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    //Update active flag to show the correct pizza & hud
    this.hudElement.setAttribute("data-active", this.isActive);

    //Update level on screen
    this.hudElement.querySelector(".Participant_level").innerText = this.level;

    //Update status
    const statusElement = this.hudElement.querySelector(".Participant_status");
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
    this.update();
  }

}