import { 
  ApiProperty, 
  ApiPropertyOptional 
} from "@nestjs/swagger";
import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsUUID
} from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from "class-validator";


// ---------- Custom Validator ---------- //
@ValidatorConstraint({ name: "PostReference", async: false })
export class PostReferenceConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.idPost || obj.slugPost); // al menos uno requerido
  }

  defaultMessage(_: ValidationArguments) {
    return "Debe proporcionar al menos idPost o slugPost";
  }
}

export function AtLeastOnePostRef(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "AtLeastOnePostRef",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: PostReferenceConstraint,
    });
  };
}

// ---------- DTO ---------- //
export class AddCommentDto {
  @ApiProperty({
    description: "Contenido del comentario",
    example: "Excelente artículo, me ayudó mucho 🚀",
  })
  @IsString()
  @IsNotEmpty({ message: "El contenido del comentario no puede estar vacío" })
  content: string;

  @ApiProperty({
    description: "Identificador del autor (externalId del usuario)",
    example: "9f8a3c92-1234-4f9d-8888-7b1c2b9f3e1d",
  })

  @ApiPropertyOptional({
    description: "ID numérico del Post (opcional si se usa slugPost)",
    example: "42",
  })
  @IsOptional()
  @IsString()
  idPost?: string;

  @ApiPropertyOptional({
    description: "Slug del Post (opcional si se usa idPost)",
    example: "introduccion-a-nestjs",
  })
  @IsOptional()
  @IsString()
  slugPost?: string;

  // Validación: al menos uno de los dos debe estar presente
  @AtLeastOnePostRef({
    message: "Debe proporcionar al menos idPost o slugPost",
  })
  _atLeastOne!: string;
}