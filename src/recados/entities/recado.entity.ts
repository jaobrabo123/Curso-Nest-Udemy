import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Pessoa } from "../../pessoas/entities/pessoa.entity";

@Entity()
export class Recado {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    texto!: string;

    @ManyToOne(() => Pessoa, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "de" })
    de!: Pessoa;

    @ManyToOne(() => Pessoa, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "para" })
    para!: Pessoa;

    @Column({ default: false })
    lido!: boolean;

    @Column()
    data!: Date;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
