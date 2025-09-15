
/* -------------------- ENUMS -------------------- */
export enum AuthCredentialType {
  EMAIL_PASSWORD = 'email_password',
  USERNAME_PASSWORD = 'username_password',
}

export enum OAuthProvider {
  GOOGLE = 'google',
  DISCORD = 'discord',
  GITHUB = 'github',
  OTHER = 'other',
}

export enum PostStatus {
  DRAFT = "draft",        // Borrador, no publicado
  PUBLISHED = "published",// Publicado y visible
  ARCHIVED = "archived"   // Archivado o deshabilitado
}
