import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('crm_banco.clientes')
export class Cliente {
  @Column({ type: "integer" })
  id_cliente: number | null;

  @Column({ type: "varchar", nullable: false })
  nombre: string;

  @Column({ type: "varchar", nullable: false })
  apellido: string;

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
}
