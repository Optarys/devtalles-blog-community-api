import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { AuthCredentialType } from "./models.model";

@Entity('user_credentials')
export class UserCredential {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.credentials, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'enum', enum: AuthCredentialType })
    type: AuthCredentialType;

    @Column({ length: 255 })
    identifier: string;

    @Column({ name: 'credential_hash', length: 255, nullable: true })
    credentialHash: string;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
    lastLoginAt: Date;
}