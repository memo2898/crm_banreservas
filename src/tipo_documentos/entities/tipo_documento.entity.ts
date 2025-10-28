import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('crm_banco.tipo_documentos')
export class TipoDocumento {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: 'varchar', nullable: false })
  nombre_documento: string;

  @Column({ type: 'text' })
  descripcion: string | null;

  @Column({ type: 'varchar' })
  agregado_por: string | null;

  @Column({ type: 'timestamp' })
  agregado_en: Date | null;

  @Column({ type: 'varchar' })
  actualizado_por: string | null;

  @Column({ type: 'timestamp' })
  actualizado_en: Date | null;

  @Column({ type: 'varchar' })
  estado: string | null;
}
