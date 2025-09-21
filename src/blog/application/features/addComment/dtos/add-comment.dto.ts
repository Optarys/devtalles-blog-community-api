import { 
  ApiProperty, 
  ApiPropertyOptional 
} from "@nestjs/swagger";
import { 
  IsNotEmpty, 
  IsString, 
  IsOptional,
  IsInt
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

  @ApiPropertyOptional({
    description: "ID numérico del Post (opcional si se usa slugPost)",
    example: "42",
  })
  @IsOptional()
  @IsInt({message: "El valor debe ser un numero entero"})
  postId?: number;
}