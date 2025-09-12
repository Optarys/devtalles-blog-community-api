// src/models/role-permission.model.ts
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Role } from './role.model';
import { Permission } from './permission.model';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @PrimaryColumn()
  role_id: number;

  @PrimaryColumn()
  permission_id: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
