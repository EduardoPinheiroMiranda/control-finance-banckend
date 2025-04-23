import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";
import { hexValidator } from "@/utils/hexValidator";
import { describe, it, expect } from "@jest/globals";


describe("util/HexValidator", () => {
    
	it("check that default values ​​are returned if hexadecimal values ​​are not provided", async () => {
        
		const result = await hexValidator(null, null);

		expect(result).toEqual({
			font: env.COLOR_FONT_DEFAULT,
			background: env.COLOR_BACKGROUND_DEFAULT
		});
	});

	it("will trigger an error if the hexadecimal value is invalid.", async () => {

		await expect(
			hexValidator("#12DSUI", "#EDDCAA")
		).rejects.toBeInstanceOf(DataValidationError);
	});

	it("check the values entered pass the test.", async () => {

		const result = await hexValidator("#3E4DFE", "#56786A");

		expect(result).toEqual({
			font: "#3E4DFE",
			background: "#56786A"
		});
	});

	it("check if lowercase values ​​are converted to uppercase.", async () => {

		const result = await hexValidator("#3e4dfe", "#56786a");

		expect(result).toEqual({
			font: "#3E4DFE",
			background: "#56786A"
		});
	});
});