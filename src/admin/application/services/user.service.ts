import { PostCommentEntity, PostEntity, UserEntity, UserSessionEntity, UserStatusEntity } from '@core/persistence/models';
import { PostSavedEntity } from '@core/persistence/models/post_saved.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminContext } from 'src/admin/infrastructure/context/admin.context';

@Injectable()
export class UserService {

    constructor(private readonly context: AdminContext) {
    }

    async findAllBy(externalId?: string, status?: 'active' | 'deleted'): Promise<UserEntity[]> {
        const where: any = {};

        if (externalId) where.externalId = externalId;

        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'deleted') {
            where.isActive = false;
        }
        return this.context.users.find({
            where,
            relations: ['status', 'roles', 'posts', 'comments', 'savedPosts', 'savedPosts.post'],
        });
    }


    async findById(id: number): Promise<UserEntity> {
        const user = await this.context.users.findOne({
            where: { id },
            relations: ['status', 'roles', 'posts', 'comments', 'savedPosts'],
        });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    async findRoles(userId: number) {
        const user = await this.context.users.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
        return user?.roles ?? [];
    }

    async findStatus(userId: number): Promise<UserStatusEntity | null> {
        const user = await this.context.users.findOne({
            where: { id: userId },
            relations: ['status'],
        });
        return user?.status ?? null;
    }

    // 🔹 Posts del usuario
    async findPosts(userId: number): Promise<PostEntity[]> {
        const user = await this.context.users.findOne({
            where: { id: userId },
            relations: ['posts'],
        });
        return user?.posts ?? [];
    }

    // 🔹 Comentarios del usuario
    async findComments(userId: number): Promise<PostCommentEntity[]> {
        const user = await this.context.users.findOne({
            where: { id: userId },
            relations: ['comments'],
        });
        return user?.comments ?? [];
    }

    // 🔹 Sesiones del usuario
    async findSessions(userId: number): Promise<UserSessionEntity[]> {
        const user = await this.context.users.findOne({
            where: { id: userId },
            relations: ['sessions'],
        });
        return user?.sessions ?? [];
    }

    // 🔹 Posts guardados por el usuario
    async findSavedPosts(userId: number): Promise<PostSavedEntity[]> {
        const user = await this.context.users.findOne({
            where: { id: userId },
            relations: ['savedPosts'],
        });
        return user?.savedPosts ?? [];
    }

    async create(data: Partial<UserEntity>): Promise<UserEntity> {
        const user = this.context.users.create(data);
        return this.context.users.save(user);
    }

    async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
        const user = await this.findById(id);
        Object.assign(user, data);
        return this.context.users.save(user);
    }

    async remove(id: number): Promise<boolean> {
        const user = await this.findById(id);
        await this.context.users.remove(user);
        return true;
    }
}
