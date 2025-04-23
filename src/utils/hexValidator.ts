import { env } from "@/env";
import { DataValidationError } from "@/errors/custonErros";


export async function hexValidator(
	font: string | null,
	background: string | null
){

	const colorFont = font ? font : env.COLOR_FONT_DEFAULT;
	const backgroundColor = background ? background : env.COLOR_BACKGROUND_DEFAULT;


	const regexValidationHexadecimal = /#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)/;
	const colorFontIsValid = regexValidationHexadecimal.test(colorFont);
	const backgroundIsValid = regexValidationHexadecimal.test(backgroundColor);
    
    
	if(!backgroundIsValid || !colorFontIsValid){
		throw new DataValidationError("Valores hexadecimais informados inválidos, corrija para prosseguir com o processo. ");
	}


	return {
		font: colorFont.toUpperCase(),
		background: backgroundColor.toUpperCase()
	};
}