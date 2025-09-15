import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConfigurationType } from "./models.model";


@Entity('configurations')
export class ConfigurationModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'config_type',
        type: 'enum',
        enum: ConfigurationType,
        default: ConfigurationType.GENERAL
    })
    configType: ConfigurationType;

    @Column({
        name: 'value',
        type: 'jsonb',
        nullable: false
    })
    value: any

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp with time zone'
    })
    createdAt: Date

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
        nullable: true
    })
    updatedAt?: Date

}