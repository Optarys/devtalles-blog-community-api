INSERT INTO public.roles (id, name, description) VALUES
(1, 'super_admin', 'Acceso total al sistema, incluyendo gestión de usuarios y roles'),
(2, 'admin', 'Gestiona el sistema, publicaciones y usuarios, pero no a super admins'),
(3, 'editor', 'Puede crear, editar y publicar cualquier post, moderar comentarios'),
(4, 'author', 'Puede crear y publicar sus propios posts, editar solo los propios'),
(5, 'moderator', 'Puede moderar comentarios y reportes de usuarios'),
(6, 'reader', 'Usuario con rol básico, solo puede leer y comentar');

INSERT INTO public.user_statuses (id, code, name, description) VALUES
(1, 'ACTIVE', 'Activo', 'Usuario activo con acceso al sistema'),
(2, 'PENDING', 'Pendiente de verificación', 'Usuario registrado pero no verificado'),
(3, 'SUSPENDED', 'Suspendido', 'Usuario temporalmente bloqueado por incumplir reglas'),
(4, 'DELETED', 'Eliminado', 'Cuenta eliminada o dada de baja');

INSERT INTO public.permissions (id, code, description) VALUES
-- Usuarios
(1, 'user.create', 'Crear usuarios'),
(2, 'user.read', 'Ver usuarios'),
(3, 'user.update', 'Editar usuarios'),
(4, 'user.delete', 'Eliminar usuarios'),

-- Roles y permisos
(5, 'role.assign', 'Asignar roles a usuarios'),
(6, 'role.manage', 'Crear, editar y eliminar roles'),
(7, 'permission.manage', 'Gestionar permisos del sistema'),

-- Posts
(8, 'post.create', 'Crear publicaciones'),
(9, 'post.read', 'Ver publicaciones'),
(10, 'post.update', 'Editar publicaciones'),
(11, 'post.delete', 'Eliminar publicaciones'),
(12, 'post.publish', 'Publicar publicaciones'),

-- Categorías
(13, 'category.create', 'Crear categorías'),
(14, 'category.read', 'Ver categorías'),
(15, 'category.update', 'Editar categorías'),
(16, 'category.delete', 'Eliminar categorías'),

-- Comentarios
(17, 'comment.create', 'Comentar publicaciones'),
(18, 'comment.read', 'Ver comentarios'),
(19, 'comment.update', 'Editar comentarios propios'),
(20, 'comment.delete', 'Eliminar comentarios'),
(21, 'comment.moderate', 'Moderar comentarios de otros usuarios');

INSERT INTO public.post_categories (id, name, slug, description) VALUES
(1, 'Noticias', 'noticias', 'Noticias y actualizaciones del sistema o comunidad'),
(2, 'Tutoriales', 'tutoriales', 'Guías paso a paso para usuarios'),
(3, 'Opinión', 'opinion', 'Artículos de opinión y debate'),
(4, 'Anuncios', 'anuncios', 'Anuncios oficiales'),
(5, 'General', 'general', 'Publicaciones generales sin categoría específica');

-- SUPER ADMIN: todos los permisos
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 1, id FROM public.permissions;

-- ADMIN: todo menos gestión de super admins
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 2, id FROM public.permissions WHERE code NOT IN ('permission.manage');

-- EDITOR: gestiona posts y comentarios
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 3, id FROM public.permissions 
WHERE code LIKE 'post.%' OR code LIKE 'comment.%' OR code LIKE 'category.%';

-- AUTHOR: solo sus posts + comentar
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 4, id FROM public.permissions 
WHERE code IN ('post.create','post.read','post.update','post.delete','post.publish',
               'comment.create','comment.read');

-- MODERATOR: solo comentarios
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 5, id FROM public.permissions 
WHERE code LIKE 'comment.%';

-- READER: solo leer y comentar
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 6, id FROM public.permissions 
WHERE code IN ('post.read','comment.create','comment.read');