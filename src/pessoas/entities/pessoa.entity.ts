import { IsEmail } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Recado } from "../../recados/entities/recado.entity";
import { RoutePolicies } from "../../auth/enums/route-policies.enum";

@Entity()
export class Pessoa {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column({ length: 255 })
    passwordHash!: string;

    @Column({ length: 100 })
    nome!: string;

    @OneToMany(() => Recado, recado => recado.de)
    recadosEnviados!: Recado[];

    @OneToMany(() => Recado, recado => recado.para)
    recadosRecebidos!: Recado[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @Column({ default: true })
    active!: boolean;

    @Column({ type: "simple-array", default: [] })
    routePolicies!: RoutePolicies[];
}
