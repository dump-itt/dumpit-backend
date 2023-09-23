import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { AuthenticateError } from "@/errors/AppError";
import { InvalidPassword } from "@/errors/AppError";

type authenticateRepoRequest = {
  id: string;
  password: string;
};

type authenticateRepoResponse = {
  isAuthenticate: boolean;
};

export class AuthenticateEditRepositoryUseCase {
  async execute({
    id,
    password,
  }: authenticateRepoRequest): Promise<authenticateRepoResponse> {
    const repo = await prisma.repository.findUnique({ where: { id } });

    if (!repo) {
      throw AuthenticateError;
    }

    const storedHashedPassword = repo.editPassword;

    if (storedHashedPassword === null) {
      throw InvalidPassword;
    }

    const isAuthenticate = await bcrypt.compare(password, storedHashedPassword);

    return {
      isAuthenticate,
    };
  }
}
