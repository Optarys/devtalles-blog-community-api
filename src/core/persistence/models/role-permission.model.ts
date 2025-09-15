// src/models/role-permission.model.ts
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { RoleEntity } from './role.model';
import { PermissionEntity } from './permission.model';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @PrimaryColumn()
  role_id: number;

  @PrimaryColumn()
  permission_id: number;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
