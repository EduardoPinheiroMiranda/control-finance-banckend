interface Dates{
	dueDate: Date,
	closeDate: Date
}

export class HandlerDueDate{

	private currentDate = new Date();
	private month = this.currentDate.getMonth();
	private year = this.currentDate.getFullYear();


	constructor(){}


	formatDate(year: number, month: number, dueDay: number){
		return new Date(
			Date.UTC(year, month, dueDay, 23, 59, 59)
		);
	}

	private buildDates(
		dueDay: number,
		closeDay: number,
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


			if(closeDay < dueDay){
				dates.push({
					dueDate: this.formatDate(year, month, dueDay),
					closeDate: this.formatDate(year, month, closeDay)
				});
			}else{
				dates.push({
					dueDate: this.formatDate(year, month, dueDay),
					closeDate: this.formatDate(year, month - 1, closeDay)
				});
			}

			month += 1;
		}
		

		return dates;
	}

	generateDueDates(
		dueDay: number,
		closeDay: number,
		amount: number,
		startOnTheInvoice: boolean
	){

		let closeDateTheCurrentMonth;

		if(closeDay < dueDay){
			closeDateTheCurrentMonth = this.formatDate(this.year, this.month, closeDay);
		}else{
			closeDateTheCurrentMonth = this.formatDate(this.year, this.month - 1, closeDay);
		}


		if(this.currentDate.getTime() > closeDateTheCurrentMonth.getTime() || startOnTheInvoice){
			return this.buildDates(dueDay, closeDay, amount, this.month + 1, this.year);
		}


		return this.buildDates(dueDay, closeDay, amount, this.month, this.year);
	}
}