import { Size } from './size';
import { ExportFileFormat } from './exportFileFormat';
import { FloatPercent } from './floatPercent';

export interface ExportDialogState {
  dialogType: 'export';
  dimensions: Size;
  format: ExportFileFormat;
  quality: FloatPercent;
}
