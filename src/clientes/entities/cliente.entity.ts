import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoDocumento } from '../../tipo_documentos/entities/tipo_documento.entity';

@Entity('crm_banco.clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar", nullable: false })
  apellido: string;

  @Column({ type: "integer" })
  id_tipo_documento: number | null;

  @Column({ type: "varchar" })
  documento: string | null;

  @Column({ type: "text" })
  direccion: string | null;

  @Column({ type: "varchar" })
  telefono: string | null;

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
  @ManyToOne(() => TipoDocumento, { eager: true })
  @JoinColumn({ name: 'id_tipo_documento' })
  tipo_documento: TipoDocumento;
}
