import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('crm_banco.usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ type: 'integer', nullable: false })
  id_rol: number;

  @Column()
  telefono: string;

  @Column({ type: 'text' })
  avatar_url: string;

  @Column({ type: 'timestamp' })
  ultimo_acceso: Date;

  @Column({ type: 'integer' })
  intentos_fallidos: number;

  @Column({ type: 'timestamp' })
  bloqueado_hasta: Date;

  @Column()
  token_reset_password: string;

  @Column({ type: 'timestamp' })
  token_reset_expira: Date;

  @Column()
  debe_cambiar_password: boolean;

  @Column({ type: 'timestamp' })
  fecha_ultimo_cambio_password: Date;

  @Column({ nullable: false })
  agregado_por: string;

  @Column({ type: 'timestamp' })
  agregado_en: Date;

  @Column()
  actualizado_por: string;

  @Column({ type: 'timestamp' })
  actualizado_en: Date;

  @Column()
  estado: string;
  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'id_rol' })
  role: Role;
}
