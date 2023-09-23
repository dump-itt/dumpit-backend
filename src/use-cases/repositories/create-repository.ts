import { prisma } from "@/lib/prisma";
import { generateRandomString } from "@/utils/generate-random-string";
import { hashPassword } from "@/utils/hash";

type CreateRepositoryRequest = {
  accessPassword: string;
  editPassword: string;
};

type CreateRepositoryResponse = {
  repository: {
    id: string;
  };
};

export class CreateRepositoryUseCase {
  async execute(
    data: CreateRepositoryRequest
  ): Promise<CreateRepositoryResponse> {
    const id = generateRandomString(5);

    const hashedAccessPassword = await hashPassword(data.accessPassword);
    const hashedEditPassword = await hashPassword(data.editPassword);

    const repository = await prisma.repository.create({
      data: {
        id,
        accessPassword: hashedAccessPassword,
        editPassword: hashedEditPassword,
      },
    });

    return {
      repository,
    };
  }
}
