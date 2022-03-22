class DialogueObject {
  constructor(config, dialogue) {
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })
    this.dialogue = dialogue;
    this.questions = {};
    let tempQuestions = []
    Object.values(window.Questions).forEach(q => {
      if (q.pool === this.pool) {
        tempQuestions.push(q);
      }
    })
    const shuffled = tempQuestions.sort(() => 0.5 - Math.random());
    let selected = [];
    if (shuffled.length <= this.numberOfQuestions) {
      selected = shuffled;
    } else {
      selected = shuffled.slice(0, this.numberOfQuestions);
    }
    console.log(tempQuestions);
  }

  get isActive() {
    true;
  }

  createElement() {
    super.createElement();
    this.hudElement.setAttribute("data-team", "gameObject");
  }

  getReplacedEvents(originalEvents) {
    return originalEvents;
  }

  getPostEvents() {
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

}