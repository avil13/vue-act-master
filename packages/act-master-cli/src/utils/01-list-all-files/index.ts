import path from 'path';
import { Project, SourceFile } from 'ts-morph';

export const getSourcesByPath = (
  paths: string | string[],
  prefixPath: string
): SourceFile[] => {
  const pathList = Array.isArray(paths) ? paths : [paths];

  const fullPaths: string[] = pathList.map((item) =>
    path.join(prefixPath, item)
  );

  const project = new Project();

  project.addSourceFilesAtPaths(fullPaths);

  const sourceFiles = project.getSourceFiles();

  return sourceFiles;
};
