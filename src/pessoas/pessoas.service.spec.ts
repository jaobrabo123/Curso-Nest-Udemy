/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Repository } from "typeorm";
import { PessoasService } from "./pessoas.service";
import { Pessoa } from "./entities/pessoa.entity";
import { HashingService } from "../auth/hashing/hashing.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreatePessoaDTO } from "./dto/create-pessoa.dto";
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from "@nestjs/common";
import fs from "fs/promises";
import path from "path";

jest.mock("fs/promises");

describe("PessoasService", () => {
    let pessoasService: PessoasService;
    let pessoaRepository: Repository<Pessoa>;
    let hashingService: HashingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PessoasService,
                {
                    provide: getRepositoryToken(Pessoa),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                        find: jest.fn(),
                        preload: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: HashingService,
                    useValue: {
                        hash: jest.fn(),
                    },
                },
            ],
        }).compile();

        pessoasService = module.get(PessoasService);
        pessoaRepository = module.get(getRepositoryToken(Pessoa));
        hashingService = module.get(HashingService);
    });

    it("pessoasService should be defined", () => {
        expect(pessoasService).toBeDefined();
    });

    describe("create", () => {
        it("should create a new person", async () => {
            // Arrange
            const dto: CreatePessoaDTO = {
                email: "joao@email.com",
                nome: "Joao",
                password: "123456",
            };
            const passHash = "HASH";
            const dtoWithPassHash = { email: dto.email, nome: dto.nome, passwordHash: passHash };

            const novaPessoa = { id: 1, ...dtoWithPassHash };

            jest.spyOn(hashingService, "hash").mockResolvedValue(passHash);
            jest.spyOn(pessoaRepository, "create").mockReturnValue(dtoWithPassHash as any);
            jest.spyOn(pessoaRepository, "save").mockReturnValue(novaPessoa as any);

            // Act
            const result = await pessoasService.create(dto);

            // Assert
            expect(hashingService.hash).toHaveBeenCalledWith(dto.password);
            expect(pessoaRepository.create).toHaveBeenCalledWith(dtoWithPassHash);
            expect(pessoaRepository.save).toHaveBeenCalledWith(dtoWithPassHash);
            expect(result).toEqual(novaPessoa);
        });

        it("should throw ConflictException when an email already exists", async () => {
            jest.spyOn(pessoaRepository, "save").mockRejectedValue({ code: "23505" });

            await expect(pessoasService.create({} as any)).rejects.toThrow(ConflictException);
        });

        it("should throw a Generic Error if other error occurs", async () => {
            jest.spyOn(pessoaRepository, "save").mockRejectedValue(new Error("Generic Error"));

            await expect(pessoasService.create({} as any)).rejects.toThrow(
                new Error("Generic Error"),
            );
        });
    });

    describe("findOne", () => {
        it("should return a person if found", async () => {
            const id = 1;
            const foundPerson = {
                id,
                name: "joao",
                email: "joao@email.com",
                passwordHash: "asdtauwtqgdhads",
            };

            jest.spyOn(pessoaRepository, "findOneBy").mockResolvedValue(foundPerson as any);

            const result = await pessoasService.findOne(id);

            expect(result).toBe(foundPerson);
            expect(pessoaRepository.findOneBy).toHaveBeenCalledWith({ id });
        });

        it("should throw NotFoundException if the person doesn't exists", async () => {
            const id = 1;
            await expect(pessoasService.findOne(id)).rejects.toThrow(NotFoundException);
            expect(pessoaRepository.findOneBy).toHaveBeenCalledWith({ id });
        });
    });

    describe("findAll", () => {
        it("should return all people", async () => {
            const pessoasMock: Pessoa[] = [
                {
                    id: 2,
                    name: "joao",
                    email: "joao@email.com",
                    passwordHash: "asdtauwtqgdhads",
                } as unknown as Pessoa,
            ];

            jest.spyOn(pessoaRepository, "find").mockResolvedValue(pessoasMock);

            const result = await pessoasService.findAll();

            expect(result).toEqual(pessoasMock);
            expect(pessoaRepository.find).toHaveBeenCalledWith({ order: { id: "DESC" } });
        });
    });

    describe("update", () => {
        it("should update a person if authorized", async () => {
            const id = 1;
            const dto = { nome: "Pedro", password: "12534" };
            const tokenPayload = { sub: id };
            const passwordHash = "HASH";
            const updatedPerson = { id, nome: dto.nome, passwordHash };

            jest.spyOn(hashingService, "hash").mockResolvedValueOnce(passwordHash);
            jest.spyOn(pessoaRepository, "preload").mockResolvedValue(updatedPerson as any);
            jest.spyOn(pessoaRepository, "save").mockResolvedValue(updatedPerson as any);

            const result = await pessoasService.update(id, dto, tokenPayload as any);

            expect(hashingService.hash).toHaveBeenCalledWith(dto.password);
            expect(pessoaRepository.preload).toHaveBeenCalledWith({
                id,
                nome: dto.nome,
                passwordHash,
            });
            expect(pessoaRepository.save).toHaveBeenCalledWith(updatedPerson);
            expect(result).toEqual(updatedPerson);
        });

        it("should throw ForbiddenException if the person is not authorized", async () => {
            const id = 1;
            const dto = { nome: "Pedro" };
            const tokenPayload = { sub: 2 };
            const updatedPerson = { id, nome: dto.nome };

            jest.spyOn(pessoaRepository, "preload").mockResolvedValue(updatedPerson as any);

            await expect(pessoasService.update(id, dto, tokenPayload as any)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw NotFoundException if the person doesn't exists", async () => {
            const id = 1;
            const dto = { nome: "Pedro" };
            const tokenPayload = { sub: id };

            jest.spyOn(pessoaRepository, "preload").mockResolvedValue(undefined);

            await expect(pessoasService.update(id, dto, tokenPayload as any)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe("remove", () => {
        it("should remove a person if authorized", async () => {
            const id = 1;
            const tokenPayload = { sub: id };
            const found = { id, nome: "Joao" };

            jest.spyOn(pessoasService, "findOne").mockResolvedValue(found as any);

            const result = await pessoasService.remove(id, tokenPayload as any);

            expect(pessoasService.findOne).toHaveBeenCalledWith(id);
            expect(pessoaRepository.remove).toHaveBeenCalledWith(found);
            expect(result).toEqual(undefined);
        });

        it("should throw ForbiddenException if the person is not authorized", async () => {
            const id = 1;
            const tokenPayload = { sub: 2 };
            const found = { id, nome: "Joao" };

            jest.spyOn(pessoasService, "findOne").mockResolvedValue(found as any);

            await expect(pessoasService.remove(id, tokenPayload as any)).rejects.toThrow(
                ForbiddenException,
            );
        });

        it("should throw NotFoundException if the person doesn't exists", async () => {
            const id = 1;
            const tokenPayload = { sub: id };

            jest.spyOn(pessoaRepository, "findOneBy").mockResolvedValue(null);

            await expect(pessoasService.remove(id, tokenPayload as any)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe("uploadPicture", () => {
        it("should save the image and update the person", async () => {
            const mockFile = {
                originalname: "test.png",
                size: 2000,
                buffer: Buffer.from("file content"),
            } as Express.Multer.File;

            const mockPessoa = { id: 1, nome: "Joao", email: "joao@email.com" } as Pessoa;

            const tokenPayload = { sub: 1 } as any;

            jest.spyOn(pessoasService, "findOne").mockResolvedValue(mockPessoa);
            jest.spyOn(pessoaRepository, "save").mockResolvedValue({
                ...mockPessoa,
                picture: "1.png",
            });

            const filePath = path.resolve(process.cwd(), "pictures", "1.png");

            const result = await pessoasService.uploadPicture(mockFile, tokenPayload);

            expect(fs.writeFile).toHaveBeenCalledWith(filePath, mockFile.buffer);
            expect(pessoaRepository.save).toHaveBeenCalledWith({ ...mockPessoa, picture: "1.png" });
            expect(result).toEqual({ ...mockPessoa, picture: "1.png" });
        });

        it("should throw BadRequestException if the file is too small", async () => {
            const mockFile = {
                originalname: "test.png",
                size: 500,
                buffer: Buffer.from("file content"),
            } as Express.Multer.File;

            const tokenPayload = { sub: 1 } as any;

            await expect(pessoasService.uploadPicture(mockFile, tokenPayload)).rejects.toThrow(
                BadRequestException,
            );
        });

        it("should throw NotFoundException if the person doesn't exists", async () => {
            const id = 1;
            const tokenPayload = { sub: id };
            const mockFile = {
                originalname: "test.png",
                size: 2000,
                buffer: Buffer.from("file content"),
            } as Express.Multer.File;

            jest.spyOn(pessoasService, "findOne").mockRejectedValue(new NotFoundException());

            await expect(
                pessoasService.uploadPicture(mockFile, tokenPayload as any),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
