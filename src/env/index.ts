import { z } from "zod";
import "dotenv/config";


const environmentVariablesPattern = z.object({
	PORT:           z.coerce.number().default(3300),
	DATABASE_URL:   z.string(),
	SECRET:		z.string(),

	COLOR_CARD_DEFAULT: z.string(),
	COLOR_FONT_DEFAULT: z.string(),
});


const variables = environmentVariablesPattern.safeParse(process.env);

if(!variables.success){
	console.log(variables.error?.format());
	throw new Error("Error in environment variables.");
}


export const env = variables.data;