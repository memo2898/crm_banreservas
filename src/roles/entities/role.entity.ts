import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('crm_banco.roles')
export class Role {
  @Column({ type: "integer" })
  id_rol: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre_rol: string;

  @Column({ type: "text" })
  descripcion: string | null;

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
}
