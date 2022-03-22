class Options { 
  constructor({ question, onComplete }) {
    this.question = question;
    this.onComplete = onComplete;

  }

  getPages() {
    return {
      options: [
        {
          ...this.question.options.map(option => {
          	return {
          	  label: option.content,
          	  description: "",
          	  handler: () => {
          	  	this.menuSubmit(option);
          	  }
          	}
          })
        },
      ],
    }
  }

  menuSubmit(option) {

    this.keyboardMenu?.end();

    this.onComplete({
      option,
    })
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions( this.getPages().options )
  }

  init(container) {
  	this.showMenu(container)
  }
}