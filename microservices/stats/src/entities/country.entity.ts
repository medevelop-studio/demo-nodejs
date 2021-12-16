import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Application } from './application.entity';

@Entity()
export class Country {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ nullable: true })
  fullName: string;

  @Index()
  @Column({ nullable: true })
  shortName: string;
}
