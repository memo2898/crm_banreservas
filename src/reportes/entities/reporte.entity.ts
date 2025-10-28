import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reportes', { schema: 'crm_banco' })
export class Reporte {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
