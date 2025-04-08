interface Dates{
	dueDate: string,
	closeDate: string
}

export class HandlerDueDate{

	private currentDate = new Date();
	private month = this.currentDate.getMonth();
	private year = this.currentDate.getFullYear();


	constructor(){}


	private formatDate(year: number, month: number, dueDay: number){
		return new Date(
			Date.UTC(year, month, dueDay, 23, 59, 59)
		);
	}

	private buildDates(
		dueDay: number,
		closeDate: number,
		amount: number,
		month: number,
		year: number
	){

		const dates: Dates[] = [];


		for(let i=0; i<amount; i++){

			if (month > 11) {
				month = 0;
				year += 1;
			}


			if(closeDate < dueDay){
				dates.push({
					dueDate: this.formatDate(year, month, dueDay).toISOString(),
					closeDate: this.formatDate(year, month, closeDate).toISOString()
				});
			}else{
				dates.push({
					dueDate: this.formatDate(year, month, dueDay).toISOString(),
					closeDate: this.formatDate(year, month - 1, closeDate).toISOString()
				});
			}

			month += 1;
		}
		

		return dates;
	}

	generateDueDates(dueDay: number, closeDate: number, amount: number){


		let closeDateTheCurrentMonth;

		if(closeDate < dueDay){
			closeDateTheCurrentMonth = this.formatDate(this.year, this.month, closeDate);
		}else{
			closeDateTheCurrentMonth = this.formatDate(this.year, this.month - 1, closeDate);
		}

		console.log(closeDateTheCurrentMonth);

		if(this.currentDate.getTime() > closeDateTheCurrentMonth.getTime()){
			return this.buildDates(dueDay, closeDate, amount, this.month + 1, this.year);
		}


		return this.buildDates(dueDay, closeDate, amount, this.month, this.year);
	}
}