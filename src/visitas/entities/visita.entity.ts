import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Ejecutivo } from '../../ejecutivos/entities/ejecutivo.entity';

@Entity('crm_banco.visitas')
export class Visita {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  id_cliente: number;

  @Column({ type: "integer", nullable: false })
  id_ejecutivo: number;

  @Column({ type: "timestamp", nullable: false })
  fecha_visita: Date;

  @Column({ type: "varchar" })
  resultado: string | null;

  @Column({ type: "varchar" })
  agregado_por: string | null;

  @Column({ type: "timestamp" })
  agregado_en: Date | null;

  @Column({ type: "varchar" })
  actualizado_por: string | null;

  @Column({ type: "timestamp" })
  actualizado_en: Date | null;

  @Column({ type: "varchar" })
  estado: string | null;
  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ManyToOne(() => Ejecutivo, { eager: true })
  @JoinColumn({ name: 'id_ejecutivo' })
  ejecutivo: Ejecutivo;
}
