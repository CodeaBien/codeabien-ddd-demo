import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
	@IsEmail({}, { message: 'El formato del email no es válido' })
	email: string;

	@IsString({ message: 'La contraseña debe ser una cadena de texto' })
	@MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
	password: string;
}
