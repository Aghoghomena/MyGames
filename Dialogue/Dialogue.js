class Dialogue {
  constructor({ object, onComplete }) {

    this.object = object;
    this.onComplete = onComplete;

    this.participants = {}

    //Dynamically add the Player team
    this.addParticipant("player", window.playerState);
    this.addParticipant("gameObject", object);

    //Start empty
    this.items = []
    
    this.usedInstanceIds = {};

  }

  addParticipant(id, config) {
    if (id === "player") {
      this.participants[id] = new Player({...config}, this);
    } else {
      this.participants[id] = new DialogueObject({...config}, this);
    }
    console.log(this)
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Dialogue");
    this.element.innerHTML = (`
    <div class="Dialogue_hero">
      <img src="${'/images/characters/people/hero.png'}" alt="Hero" />
    </div>
    <div class="Dialogue_object">
      <img src=${this.object.src} alt=${this.object.name} />
    </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player");
    this.objectTeam = new Team("gameObject");

    Object.keys(this.participants).forEach(key => {
      let participant = this.participants[key];
      participant.id = key;
      participant.init(this.element)
      
      //Add to correct team
      if (participant.id === "player") {
        this.playerTeam.participants.push(participant);
      } else {
        this.objectTeam.participants.push(participant);
      }
    })

    this.playerTeam.init(this.element);
    this.questionsTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      dialogue: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const dialogueEvent = new DialogueEvent(event, this)
          dialogueEvent.init(resolve);
        })
      },
      onComplete: winner => {

        if (winner === "player") {
          const playerState = window.playerState;
          Object.keys(playerState.pizzas).forEach(id => {
            const playerStatePizza = playerState.pizzas[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStatePizza.hp = combatant.hp;
              playerStatePizza.xp = combatant.xp;
              playerStatePizza.maxXp = combatant.maxXp;
              playerStatePizza.level = combatant.level;
            }
          })

          //Get rid of player used items
          playerState.items = playerState.items.filter(item => {
            return !this.usedInstanceIds[item.instanceId]
          })

          //Send signal to update
        }

        utils.emitEvent("PlayerStateUpdated");
        this.element.remove();
        this.onComplete(winner === "player");
      }
    })
    this.turnCycle.init();


  }

}