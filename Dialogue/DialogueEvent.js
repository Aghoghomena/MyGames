class DialogueEvent {
  constructor(event, dialogue) {
    this.event = event;
    this.dialogue = dialogue;
  }
  
  textMessage(resolve) {

    const text = this.event.text
    .replace("{CASTER}", this.event.caster?.name)
    .replace("{TARGET}", this.event.target?.name)
    .replace("{ACTION}", this.event.action?.name)

    const message = new TextMessage({
      text,
      onComplete: () => {
        resolve();
      }
    })
    message.init( this.dialogue.element )
  }

  async stateChange(resolve) {
    const {caster, target, damage, recover, status, action} = this.event;
    let who = this.event.onCaster ? caster : target;

    if (damage) {
      //modify the target to have less HP
      target.update({
        hp: target.hp - damage
      })
      
    }

    if (recover) {
      let newHp = who.hp + recover;
      if (newHp > who.maxHp) {
        newHp = who.maxHp;
      }
      who.update({
        hp: newHp
      })
    }

    if (status) {
      who.update({
        status: {...status}
      })
    }
    if (status === null) {
      who.update({
        status: null
      })
    }


    //Wait a little bit
    await utils.wait(600)

    //Update Team components
    this.dialogue.playerTeam.update();
    this.dialogue.enemyTeam.update();

    //stop blinking
    target.pizzaElement.classList.remove("battle-damage-blink");
    resolve();
  }

  submissionMenu(resolve) {
    const {caster} = this.event;
    const menu = new SubmissionMenu({
      caster: caster,
      other: this.event.other,
      onComplete: submission => {
        //submission { what move to use, who to use it on }
        resolve(submission)
      }
    })
    menu.init( this.dialogue.element )
  }

  giveXp(resolve) {
    let amount = this.event.xp;
    const {combatant} = this.event;
    const step = () => {
      if (amount > 0) {
        amount -= 1;
        combatant.xp += 1;

        //Check if we've hit level up point
        if (combatant.xp === combatant.maxXp) {
          combatant.xp = 0;
          combatant.maxXp = 100;
          combatant.level += 1;
        }

        combatant.update();
        requestAnimationFrame(step);
        return;
      }
      resolve();
    }
    requestAnimationFrame(step);
  }

  animation(resolve) {
    const fn = DialogueAnimations[this.event.animation];
    fn(this.event, resolve);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}