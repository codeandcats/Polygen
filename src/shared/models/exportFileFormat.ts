import { tuple } from '../utils/tuple';

export const ExportFileFormats = tuple('jpeg', 'png');

export type ExportFileFormat = typeof ExportFileFormats[number];
