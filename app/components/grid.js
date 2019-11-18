import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GridComponent extends Component {
	@tracked testGrid = [
		[0, 0, 0, 0, 0],
    	[0, 0, 0, 0, 0],
    	[0, 0, 0, 0, 0],
    	[0, 0, 0, 0, 0],
    	[0, 0, 0, 0, 0]
    ];
    @tracked x = 0;
    @tracked y = 4;
    @tracked commands = "PLACE 1,2,EAST\nMOVE\nMOVE\nLEFT\nMOVE\nREPORT";
    @tracked imageClass = "degrees0";
    @tracked placeHandler = false;
    @tracked clearCommands = true;
	constructor() {
		super(...arguments);					
	}

	setZero() {
		const {x,y,testGrid} = this;
		let temp = testGrid[y].slice();
		temp[x] = 0;
		testGrid[y] = temp;
		this.testGrid = [...testGrid];
	}

	@action
	moveRight() {				
		const { x,y, testGrid } = this;
		let temp = testGrid[y].slice();
		if(x < 4 && x >= 0 ) {
			temp[x] = 0;
			temp[x + 1] = 1;
			this.x += 1;			
		}
		this.testGrid[y] = temp;
		this.testGrid = [...testGrid];
	}
	@action
	moveLeft() {				
		const { x,y, testGrid } = this;
		let temp = this.testGrid[y].slice();
		if(x <= 4 && x > 0 ) {
			temp[x] = 0;
			temp[x - 1] = 1;
			this.x -= 1;			
		}
		this.testGrid[y] = temp;
		this.testGrid = [...testGrid];
	}
	@action
	moveDown() {						
		const { x,y, testGrid } = this;
		if(y < 4 && y >= 0 ) {
			this.setZero();
			let temp = this.testGrid[this.y + 1].slice();
			temp[this.x] = 1;
			this.y += 1;			
			this.testGrid[this.y] = temp;
			this.testGrid = [...this.testGrid];
		}
	}		
	@action
	moveUp() {						
		if(this.y <= 4 && this.y > 0 ) {
			this.setZero();
			let temp = this.testGrid[this.y - 1].slice();
			temp[this.x] = 1;
			this.y -= 1;			
			this.testGrid[this.y] = temp;
			this.testGrid = [...this.testGrid];
		}
	}		
	@action
	command(e) {
		e.preventDefault();		
		this.clearCommands = true;
		this.read(this.commands);	
		if(this.clearCommands) {
			this.commands = "";
		}
	}

	read = (arr) => {		
		arr = arr.split(`\n`);
		arr.forEach(o=> {
			o = o.trim();
			if(new RegExp(/^(PLACE)\s\d,\d,(\b(NORTH)|\b(SOUTH)|\b(EAST)|\b(WEST))$/im).test(o)) {
				let parser = o.split(' ')[1].split(',');
				let [x,y,face] = [+parser[0],4- +parser[1],parser[2]];
				if(x>=0 && x<=4 && y>=0 && y<=4) {
					this.place(x,y,face);
					this.placeHandler = true;
				}	
			} else if(this.placeHandler && new RegExp(/^(\b(LEFT)|\b(RIGHT))$/im).test(o) ) {
				if(o.toUpperCase() === "LEFT") {
					this.imageClass  = (+this.imageClass.match(/(\d+)/)[0] - 90);
					this.imageClass = ((this.imageClass%360)+360)%360					
					this.imageClass = "degrees" + this.imageClass
				} else if(o.toUpperCase() === "RIGHT") {
					this.imageClass  = (+this.imageClass.match(/(\d+)/)[0] + 90);
					this.imageClass = ((this.imageClass%360)+360)%360					
					this.imageClass = "degrees" + this.imageClass					
				}
			} else if(this.placeHandler && new RegExp(/^(\b(MOVE))$/im).test(o)) {			
				switch(this.imageClass) {
					case "degrees0":
						this.moveUp()
						break;
					case "degrees90":
						this.moveRight()
						break;
					case "degrees180":
						this.moveDown()
						break;
					case "degrees270":
						this.moveLeft()
						break;
				}
			} else if(this.placeHandler && new RegExp(/^(\b(REPORT))$/im).test(o)) {
				let facing;
				switch(this.imageClass) {
					case "degrees0":
						facing = "NORTH";
						break;
					case "degrees90":
						facing = "EAST"
						break;
					case "degrees180":
						facing = "SOUTH"
						break;
					case "degrees270":
						facing = "WEST"
						break;				
					default:
						console.error("Error with read method in GridComponent");
					}				
				this.commands = "Output: " + this.x + "," + (4 - this.y) + "," + facing;
				this.clearCommands = false;
			}
		});		

	}

	place = (x2, y2,facing) => {
		const {x,y,testGrid} = this;
		this.setZero();
		this.setFacing(facing);
		this.x = x2; this.y = y2; this.y % 4;
		let temp = this.testGrid[this.y].slice();
		temp[this.x] = 1;		
		this.testGrid[this.y] = temp;
		this.testGrid = [...this.testGrid];
	}

	@action
	setFacing(e) {				
		switch(e.toUpperCase()) {
			case "NORTH":
				this.imageClass = "degrees0"
				break;
			case "SOUTH":
				this.imageClass = "degrees180"
				break;
			case "EAST":
				this.imageClass = "degrees90"
				break;
			case "WEST":
				this.imageClass = "degrees270"
				break;
			default: 
				console.error("Error with setFacing method in GridComponent");
		}
	}

}


