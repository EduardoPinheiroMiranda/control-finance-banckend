import { HandlerDueDate } from "@/utils/handlerDueDate";
import { describe, it, jest, beforeEach, afterEach } from "@jest/globals";


describe("utils/handler due dates", () => {

	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-03-05T12:00:00Z"));
	});

	afterEach(() => {
		jest.useRealTimers();
	});


	it("Make sure the due and ending dates are created in the same month.", async () => {
		// check if an array of objects is created, 
		// each object must have a due date and a closing date. Ex:
		// {
		//     dueDate: "2025-04-10T23:59:59.000Z",
		//     closingDate: "2025-04-02T23:59:59.000Z"
		// }
		// 


		const dueDay = 10;
		const closingDay = 2;
		const amount = 3;


		const dueDates = new HandlerDueDate().generateDueDates(
			dueDay,
			closingDay,
			amount,
			false
		);

		// check if the number of objects created is correct
		expect(dueDates.length).toBe(amount);

		// check if the dates are being created correctly.
		expect(dueDates[0]).toEqual({
			dueDate: new Date("2025-04-10T23:59:59.000Z"),
			closingDate: new Date("2025-04-02T23:59:59.000Z")
		});

		// // check whether the dates from one object to another follow a chronological flow.
		expect(dueDates).toEqual([
			{
				dueDate: new Date("2025-04-10T23:59:59.000Z"),
				closingDate: new Date("2025-04-02T23:59:59.000Z")
		  	},
		  	{
				dueDate: new Date("2025-05-10T23:59:59.000Z"),
				closingDate: new Date("2025-05-02T23:59:59.000Z")
			},
			{
				dueDate: new Date("2025-06-10T23:59:59.000Z"),
				closingDate: new Date("2025-06-02T23:59:59.000Z")
		  	}
		]);
	});

	it("Make sure the due date is created in one month and the closing date in the previous month.", async () => {
		// verify that an array of objects has been created,
		// where each object will contain a due date in one month
		// and a closing date in the month before the due month. Ex:

		// {
		//     dueDate: "2025-04-10T23:59:59.000Z",
		//     closingDate: "2025-03-28T23:59:59.000Z"
		// }


		const dueDay = 10;
		const closingDay = 28;
		const amount = 3;


		const dueDates = new HandlerDueDate().generateDueDates(
			dueDay,
			closingDay,
			amount,
			false
		);

		// check if the number of objects created is correct
		expect(dueDates.length).toBe(amount);

		// check if the dates are being created correctly.
		expect(dueDates[0]).toEqual({
			dueDate: new Date("2025-04-10T23:59:59.000Z"),
			closingDate: new Date("2025-03-28T23:59:59.000Z")
		});

		// // check whether the dates from one object to another follow a chronological flow.
		expect(dueDates).toEqual([
			{
				dueDate: new Date("2025-04-10T23:59:59.000Z"),
				closingDate: new Date("2025-03-28T23:59:59.000Z")
		  	},
		  	{
				dueDate: new Date("2025-05-10T23:59:59.000Z"),
				closingDate: new Date("2025-04-28T23:59:59.000Z")
			},
			{
				dueDate: new Date("2025-06-10T23:59:59.000Z"),
				closingDate: new Date("2025-05-28T23:59:59.000Z")
		  	}
		]);

	});

	it("check if the first invoice is for the following month based on the month of purchase if startOnTheInvoice is true.", async () => {
		
		const dueDay = 10;
		const closingDay = 3;
		const amount = 3;
		const startOnTheInvoice = true;


		const dueDates = new HandlerDueDate().generateDueDates(
			dueDay,
			closingDay,
			amount,
			startOnTheInvoice
		);


		expect(
			dueDates[0].closingDate.getTime() > new Date().getTime()
		).toBe(true);
	});

	it("Check if you can create invoices from a specific date", async () => {

		const dueDay = 10;
		const closingDay = 5;
		const amount = 3;
		const startOnTheInvoice = false;
		const purchaseDate = "2025-02-03";


		const handlerDueDate = new HandlerDueDate(purchaseDate);
		const dueDates = handlerDueDate.generateDueDates(
			dueDay,
			closingDay,
			amount,
			startOnTheInvoice
		);

		
		expect(dueDates[0].closingDate.getMonth() == 1).toBe(true);
	});

	it("check if invoice list starts next month by startOnTheInvoice property.", async () => {

		const dueDay = 10;
		const closingDay = 7;
		const amount = 12;
		const startOnTheInvoice = true;
		const purchaseDate = null;


		const handlerDueDate = new HandlerDueDate(purchaseDate);
		const dueDates = handlerDueDate.generateDueDates(
			dueDay,
			closingDay,
			amount,
			startOnTheInvoice
		);

		expect(dueDates[0].dueDate.getMonth() > new Date().getMonth()).toBe(true);
		expect(dueDates.length).toBe(amount);
		expect(dueDates[dueDates.length -1].dueDate.getFullYear() > new Date().getFullYear());
	});
});