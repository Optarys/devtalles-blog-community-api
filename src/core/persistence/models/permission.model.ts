import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.model";

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  code: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}