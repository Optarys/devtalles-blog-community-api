import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.model";
import { OAuthProvider } from "./models.model";

@Entity('user_identities')
export class UserIdentityEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.identities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'enum', enum: OAuthProvider })
    provider: OAuthProvider;

    @Column({ name: 'provider_user_id', length: 255 })
    providerUserId: string;

    @Column({ name: 'provider_user_data', type: 'jsonb', nullable: true })
    providerUserData: any;

    @Column({ name: 'access_token', type: 'text', nullable: true })
    accessToken: string;

    @Column({ name: 'refresh_token', type: 'text', nullable: true })
    refreshToken: string;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
    expiresAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}