import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm';

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

/* -------------------- ROLES -------------------- */


/* -------------------- PERMISSIONS -------------------- */


/* -------------------- USER STATUSES -------------------- */


/* -------------------- USERS -------------------- */


/* -------------------- USER CREDENTIALS -------------------- */


/* -------------------- AUTH PROVIDERS -------------------- */

/* -------------------- USER IDENTITIES -------------------- */


/* -------------------- POST CATEGORIES -------------------- */


/* -------------------- POSTS -------------------- */


/* -------------------- POST TAGS -------------------- */


/* -------------------- COMMENTS -------------------- */


/* -------------------- USER SESSIONS -------------------- */
