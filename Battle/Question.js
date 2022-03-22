class Question {
	constructor(config, numberOfOptions = 3) {
		Object.keys(config).forEach(key => {
		  this[key] = config[key];
		})
		this.options = [];
		this.numberOfOptions = numberOfOptions;
		let tempOptions = []
		Object.values(window.Answers).forEach(o => {
		  if (o.question === this.id) {
		    tempOptions.push(o);
		  }
		})
		const shuffled = tempOptions.sort(() => 0.5 - Math.random());
		if (shuffled.length <= this.numberOfOptions ) {
			this.options = shuffled;
		} else {
			this.options = shuffled.slice(0, this.numberOfOptions);
		}
	}
}