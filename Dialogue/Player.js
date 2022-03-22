class Player extends ScoreBoard {
  constructor(config, dialogue) {
    super(config);
    this.dialogue = dialogue;
  }

  get isActive() {
    return true;
  }

  createElement() {
    super.createElement();
    this.hudElement.setAttribute("data-team", "player");
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