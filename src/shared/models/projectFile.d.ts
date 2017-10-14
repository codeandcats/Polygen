import { ProjectFileContents } from './projectFileContents';

export interface ProjectFile {
	fileName: string | undefined;
	contents: ProjectFileContents;
}
