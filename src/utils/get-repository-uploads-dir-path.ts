export function getRepositoryUploadsDirPath(repositoryId: string) {
  const path = `${process.cwd()}/uploads/repositories/${repositoryId}`

  return path
}
