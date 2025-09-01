import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthenticateUserRequestDto {
	@IsEmail({}, { message: 'El formato del email no es válido' })
	email: string;

	@IsString({ message: 'La contraseña debe ser una cadena de texto' })
	@MinLength(1, { message: 'La contraseña es requerida' })
	password: string;
}
