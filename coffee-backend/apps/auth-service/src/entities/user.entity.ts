import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  BARISTA = 'barista',
  VOLUNTEER = 'volunteer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VOLUNTEER })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'last_login', nullable: true })
  last_login: Date;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;
}