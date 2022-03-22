class QuestionCycle {
  constructor({ dialogue, onNewEvent, onComplete }) {
    this.dialogue = dialogue;
    this.onNewEvent = onNewEvent;
    this.onComplete = onComplete;
    this.currentTeam = "gameObject";
    this.startPhrases = ["Just a few questions. ", "How about we have some fun? ", "Let's go! "];
  }

  async turn() {
    //Get the caster
    const caster = this.dialogue.participants[this.currentTeam];
    const other = this.dialogue.participants[caster.team === "player" ? "gameObject" : "player"];

    if (caster.team === "player") {

    }

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      other,
    })

    if (submission.instanceId) {

      //Add to list to persist to player state later
      this.dialogue.usedInstanceIds[submission.instanceId] = true;

      //Removing item from battle state
      this.dialogue.items = this.dialogue.items.filter(i => i.instanceId !== submission.instanceId)
    }

    // const resultingEvents = caster.getReplacedEvents(submission.action.success);

    for (let i=0; i<resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      }
      await this.onNewEvent(event);
    }

    //Did the target die?
    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({ 
        type: "textMessage", text: `${submission.target.name} is ruined!`
      })

      if (submission.target.team === "enemy") {

        const playerActivePizzaId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;

        await this.onNewEvent({
          type: "textMessage",
          text: `Gained ${xp} XP!`
        })
        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: this.battle.combatants[playerActivePizzaId]
        })
      }
    }

    //Do we have a winning team?
    const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: "Winner!"
      })
      this.onWinner(winner);
      return;
    }
      
    //We have a dead target, but still no winner, so bring in a replacement
    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: "replacementMenu",
        team: submission.target.team
      })
      await this.onNewEvent({
        type: "replace",
        replacement: replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `${replacement.name} appears!`
      })
    }


    //Check for post events
    //(Do things AFTER your original turn submission)
    const postEvents = caster.getPostEvents();
    for (let i=0; i < postEvents.length; i++ ) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target, 
      }
      await this.onNewEvent(event);
    }

    //Check for status expire
    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent)
    }

    this.nextTurn();
  }

  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "questions" : "player";
    this.turn();
  }

  // getWinningTeam() {
  //   return "player";
  // }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: utils.randomFromArray(this.startPhrases)
    })

    //Start the first turn!
    this.turn();

  }

}

