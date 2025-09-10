import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OAuthProvider } from "./models.model";

@Entity('auth_providers')
export class AuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OAuthProvider })
  provider: OAuthProvider;

  @Column({ name: 'provider_name', length: 100, nullable: true })
  providerName: string;

  @Column({ name: 'client_id', length: 255, nullable: true })
  clientId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
