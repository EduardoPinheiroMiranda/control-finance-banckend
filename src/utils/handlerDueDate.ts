import { Dates } from "@/@types/customTypes";


export class HandlerDueDate{

	private currentDate: Date;
	private month: number;
	private year: number;


	constructor(
		private purchaseDate?: string | null
	){
		this.currentDate = new Date(this.purchaseDate ?? new Date().toISOString());
		this.month = this.currentDate.getMonth();
		this.year = this.currentDate.getFullYear();
	}


	formatDate(year: number, month: number, dueDay: number){
		return new Date(
			Date.UTC(year, month, dueDay, 23, 59, 59)
		);
	}

	buildDates(
		dueDay: number,
		closeDay: number,
		amount: number,
		month: number,
		year: number
	){

		let currentMonth = month;
		let currentYear = year;
		const dates: Dates[] = [];


		for(let i=0; i<amount; i++){

			if (currentMonth > 11) {
				currentMonth = 0;
				currentYear += 1;
			}


			if(closeDay < dueDay){
				dates.push({
					dueDate: this.formatDate(currentYear, currentMonth, dueDay),
					closeDate: this.formatDate(currentYear, currentMonth, closeDay)
				});
			}else{
				dates.push({
					dueDate: this.formatDate(currentYear, currentMonth, dueDay),
					closeDate: this.formatDate(currentYear, currentMonth - 1, closeDay)
				});
			}

			currentMonth += 1;
		}
		

		return dates;
	}

	generateDueDates(
		dueDay: number,
		closeDay: number,
		amount: number,
		startOnTheInvoice: boolean
	){

		let closeDateTheCurrentMonth: Date;

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