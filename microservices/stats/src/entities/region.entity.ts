import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Application } from './application.entity';

@Entity()
export class Region {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  shortName: string;
}
