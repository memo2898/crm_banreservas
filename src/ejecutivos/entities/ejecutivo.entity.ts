import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('crm_banco.ejecutivos')
export class Ejecutivo {
  @PrimaryGeneratedColumn()
  id: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar", nullable: false })
  apellido: string;

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
