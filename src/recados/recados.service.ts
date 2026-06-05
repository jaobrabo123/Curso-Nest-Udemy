import { Injectable, NotFoundException } from "@nestjs/common";
import { Recado } from "./entities/recado.entity";

@Injectable()
export class RecadosService {
    private lastId = 1;
    private recados: Recado[] = [
        {
            id: 1,
            texto: "Este é um recado de teste",
            de: "Joana",
            para: "João",
            lido: false,
            data: new Date(),
        },
    ];

    findAll() {
        return this.recados;
    }

    findOne(id: string) {
        const idNumber = +id;
        const recado = this.recados.find(rec => rec.id === idNumber);
        if (!recado) throw new NotFoundException();
        return recado;
    }

    create(body: Omit<Recado, "id">) {
        this.lastId++;

        const novoRecado: Recado = {
            id: this.lastId,
            ...body,
        };
        this.recados.push(novoRecado);

        return novoRecado;
    }

    update(id: string, body: Partial<Omit<Recado, "id">>) {
        const idNumber = +id;
        const recado = this.recados.find(rec => rec.id === idNumber);
        if (recado) {
            Object.assign(recado, body);
        } else {
            throw new NotFoundException();
        }
    }

    remove(id: string) {
        const idNumber = +id;
        const index = this.recados.findIndex(rec => rec.id === idNumber);

        if (index >= 0) {
            this.recados[index] = this.recados[this.recados.length - 1];
            this.recados.pop();
        } else {
            throw new NotFoundException();
        }
    }
}
