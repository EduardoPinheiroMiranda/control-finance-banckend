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
		//     closeDate: "2025-04-02T23:59:59.000Z"
		// }
		// 


		const dueDay = 10;
		const closeDay = 2;
		const amount = 3;


		const dueDates = new HandlerDueDate().generateDueDates(
			dueDay,
			closeDay,
			amount
		);

		// check if the number of objects created is correct
		expect(dueDates.length).toBe(amount);

		// check if the dates are being created correctly.
		expect(dueDates[0]).toEqual({
			dueDate: new Date("2025-04-10T23:59:59.000Z"),
			closeDate: new Date("2025-04-02T23:59:59.000Z")
		});

		// // check whether the dates from one object to another follow a chronological flow.
		expect(dueDates).toEqual([
			{
				dueDate: new Date("2025-04-10T23:59:59.000Z"),
				closeDate: new Date("2025-04-02T23:59:59.000Z")
		  	},
		  	{
				dueDate: new Date("2025-05-10T23:59:59.000Z"),
				closeDate: new Date("2025-05-02T23:59:59.000Z")
			},
			{
				dueDate: new Date("2025-06-10T23:59:59.000Z"),
				closeDate: new Date("2025-06-02T23:59:59.000Z")
		  	}
		]);
	});

	it("Make sure the due date is created in one month and the closing date in the previous month.", async () => {
		// verify that an array of objects has been created,
		// where each object will contain a due date in one month
		// and a closing date in the month before the due month. Ex:

		// {
		//     dueDate: "2025-04-10T23:59:59.000Z",
		//     closeDate: "2025-03-28T23:59:59.000Z"
		// }


		const dueDay = 10;
		const closeDay = 28;
		const amount = 3;


		const dueDates = new HandlerDueDate().generateDueDates(
			dueDay,
			closeDay,
			amount
		);

		// check if the number of objects created is correct
		expect(dueDates.length).toBe(amount);

		// check if the dates are being created correctly.
		expect(dueDates[0]).toEqual({
			dueDate: new Date("2025-04-10T23:59:59.000Z"),
			closeDate: new Date("2025-03-28T23:59:59.000Z")
		});

		// // check whether the dates from one object to another follow a chronological flow.
		expect(dueDates).toEqual([
			{
				dueDate: new Date("2025-04-10T23:59:59.000Z"),
				closeDate: new Date("2025-03-28T23:59:59.000Z")
		  	},
		  	{
				dueDate: new Date("2025-05-10T23:59:59.000Z"),
				closeDate: new Date("2025-04-28T23:59:59.000Z")
			},
			{
				dueDate: new Date("2025-06-10T23:59:59.000Z"),
				closeDate: new Date("2025-05-28T23:59:59.000Z")
		  	}
		]);

	});
});