import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum CatStatus {
  IN_CAFE = 'in_cafe',
  ADOPTED = 'adopted',
  RESERVED = 'reserved',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ArrivalType {
  FOUND = 'found',
  FROM_OWNER = 'from_owner',
  FROM_SHELTER = 'from_shelter',
}

@Entity('cats')
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  color: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  breed: string;

  @Column({ nullable: true })
  personality: string;

  @Column({ type: 'enum', enum: CatStatus, default: CatStatus.IN_CAFE })
  status: CatStatus;

  @CreateDateColumn({ name: 'arrival_date' })
  arrival_date: Date;

  @Column({ name: 'arrival_type', type: 'enum', enum: ArrivalType, nullable: true })
  arrival_type: ArrivalType;

  @Column({ name: 'found_location', nullable: true })
  found_location: string;

  @Column({ name: 'finder_name', nullable: true })
  finder_name: string;

  @Column({ name: 'finder_phone', nullable: true })
  finder_phone: string;

  @Column({ name: 'adopted_date', nullable: true })
  adopted_date: Date;

  @Column({ name: 'new_home', nullable: true })
  new_home: string;

  @Column({ name: 'new_owner_name', nullable: true })
  new_owner_name: string;

  @Column({ name: 'new_owner_phone', nullable: true })
  new_owner_phone: string;

  @Column({ name: 'new_owner_email', nullable: true })
  new_owner_email: string;

  @Column({ name: 'medical_history', type: 'jsonb', default: [] })
  medical_history: any[];

  @Column({ name: 'image_url', nullable: true })
  image_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'created_by' })
  created_by: number;
}