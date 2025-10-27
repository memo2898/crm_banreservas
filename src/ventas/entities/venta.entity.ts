import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('crm_banco.ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "integer", nullable: false })
  id_cliente: number;

  @Column({ type: "timestamp", nullable: false })
  fecha_venta: Date;

  @Column({ type: "decimal", nullable: false })
  monto: number;

  @Column({ type: "varchar", nullable: false })
  producto: string;

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
}
