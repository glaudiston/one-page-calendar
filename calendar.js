function makeCalendar(targetDOM, year){
	// set default
	if ( isNaN(year) ){
		year = (new Date()).getFullYear();
	}
	let calendar = document.createElement("div");
	calendar.className = "calendar"
	calendar.update = function(){
		calendar.querySelectorAll(".selected-day").forEach( it => it.classList.remove("selected-day"));
		dayDOM = calendar.querySelector(".day-number-"+calendar.day);
		if ( calendar.day < 32 ) {
			dayDOM.classList.add("selected-day");
		}
		let lineNumberClass="line-number-"+ ((calendar.day-1) % 7);
		calendar.querySelectorAll(".line-selected").forEach( it => it.classList.remove("line-selected"));
		calendar.querySelectorAll("." + lineNumberClass).forEach( it => it.classList.add("line-selected"))
		//calendar.querySelectorAll(".selected-month").forEach( it => it.classList.remove("selected-month"));
		//calendar.querySelector(".month-has-day-"+calendar.day).classList.add("selected-month");
		//calendar.querySelectorAll(".selected-weekday").forEach( it => it.classList.remove("selected-weekday"));
		//calendar.querySelector(".weekday-has-"+calendar.day).classList.add("selected-weekday");
	}
	let yearBlock = document.createElement("div");
	yearBlock.className = "year-block";
	let yearInput = document.createElement("input");
	yearInput.type="number";
	yearInput.value = year;
	yearInput.addEventListener('change', function(){makeCalendar(targetDOM, this.value)});
	yearBlock.appendChild(yearInput);
	let daysOfMonthBlock = document.createElement("div");
	daysOfMonthBlock.className = "days-of-month-block";
	let weekDaysBlock = document.createElement("div");
	weekDaysBlock.className = "week-days-block"
	let dayNameFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
	for ( let i = 0; i < ( 7 * 5 ); i++ ){
		let dayNumberDiv = document.createElement("div");
		dayNumberDiv.className = "day-number-div day-number-"+(i+1) + " line-number-" + (i % 7);
		dayNumberDiv.value=i+1;
		dayNumberDiv.lineNumber = i % 7;
		if ( i < 31 ) {
			let dayNumberText = document.createTextNode(i+1);
			dayNumberDiv.appendChild(dayNumberText);
		}
		dayNumberDiv.addEventListener("click", function(){
			calendar.day = this.value;
			calendar.update()
		});
		daysOfMonthBlock.appendChild(dayNumberDiv);
	}
	for ( let i = 0; i < (7*7); i++ ){
		let weekDayDiv = document.createElement("div");
		weekDayDiv.className = "week-day-div column-" + (i % 7) + " line-number-"+Math.floor(i / 7)
		let dayName = dayNameFormatter.format(new Date(year, 0, i+1 + (i / 7)));
		weekDayDiv.appendChild(document.createTextNode(dayName));
		weekDaysBlock.appendChild(weekDayDiv);
	}
	let monthsBlock = document.createElement("div");
	monthsBlock.className = "months-block";
	let data = {};
	for ( let i = 0; i < 12; i++ ){
		let firstDayOfMonth=new Date(year, i, 1);
		let monthName = firstDayOfMonth.toLocaleDateString(navigator.language, {month: "long"})
		let dayName = firstDayOfMonth.toLocaleDateString(navigator.language, {weekday: "long"})
		if ( data[dayName] == undefined ) {
			data[dayName] = [];
		}
		data[dayName].push(monthName);
	}
	for ( let i = 0; i <= 7; i++ ){
		let dayName = dayNameFormatter.format(new Date(year, 0, i+1));
		let monthsInThisDayDiv = document.createElement("div");
		monthsInThisDayDiv.className = "months-in-day-div"
		for ( let j=0; j < data[dayName].length; j++ ) {
			let monthInThisDayDiv = document.createElement("div");
			monthInThisDayDiv.className = "month-in-day month-starting-at-"+i 
			let monthInThisDay = document.createTextNode(data[dayName][j]);
			monthInThisDayDiv.addEventListener("click", function(){
				calendar.querySelectorAll(".months-block .month-selected").forEach( 
					it => it.classList.remove("month-selected")
				);
				this.classList.add("month-selected");
				calendar.querySelectorAll(".column-selected").forEach( 
					it => it.classList.remove("column-selected")
				);
				calendar.querySelectorAll(".column-"+ i).forEach( 
					it => it.classList.add("column-selected")
				)
			});
			monthInThisDayDiv.appendChild(monthInThisDay);
			monthsInThisDayDiv.appendChild(monthInThisDayDiv);
		}
		monthsBlock.appendChild(monthsInThisDayDiv);
	}
	calendar.appendChild(yearBlock);
	calendar.appendChild(daysOfMonthBlock);
	calendar.appendChild(monthsBlock);
	calendar.appendChild(weekDaysBlock);
	targetDOM.innerHTML='';
	targetDOM.appendChild(calendar)
}

window.addEventListener('load', _ => makeCalendar(document.body));
