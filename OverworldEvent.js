class OverworldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)

  }

  removeWall(resolve) {
    this.map.removeWall(this.event.x, this.event.y);
    resolve();
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }

  options(resolve) {
    const menu = new Options({
      question: this.event.question,
      onComplete: submission => {
        window.Questions[question.name].answered = true;
        resolve(submission)
      }
    })
    menu.init( document.querySelector(".game-container") )
  }

  changeMap(resolve) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      });
      resolve();

      sceneTransition.fadeOut();

    })
  }

  // battle(resolve) {
  //   const battle = new Battle({
  //     enemy: Enemies[this.event.enemyId],
  //     onComplete: (didWin) => {
  //       resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE");
  //     }
  //   })
  //   battle.init(document.querySelector(".game-container"));

  // }

  dialogue(resolve) {
    const object = window.InteractiveObjects[this.event.id];
    const questions = utils.getQuestions(object.pool, object.numberOfQuestions);
    questions.forEach(q => {
      const menu = new Options({
        question: q,
        onComplete: submission => {
          window.Questions[q.name].answered = true;
          // resolve(submission)
        }
      })
      menu.init( document.querySelector(".game-container") )
    });
    // for (let i=0; i<newEvents.length; i++) {
    //   const eventHandler = new OverworldEvent({
    //     event: newEvents[i],
    //     map: this.map,
    //   })
    //   const result = eventHandler.init();
    // }
    resolve();

    // const dialogue = new Dialogue({
    //   object: InteractiveObjects[this.event.id], 
    //   onComplete: () => {
    //     resolve();
    //   }
    // })
    // dialogue.init(document.querySelector(".game-container"));
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  removeStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = false;
    resolve();
  }

  save(resolve) {
    this.event.progress.save();
    resolve();
  }

  craftingMenu(resolve) {
    const menu = new CraftingMenu({
      pizzas: this.event.pizzas,
      onComplete: () => {
        resolve();
      }
    })
    menu.init(document.querySelector(".game-container"))
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}