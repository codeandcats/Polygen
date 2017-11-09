import { tuple } from '../utils/tuple';

export const DEFAULT_LAYER_THRESHOLD_SETTING_VALUE = .5;

export const LAYER_THRESHOLD_SETTING_FIELD_NAMES = tuple('transparency', 'opacity');

export type LayerThresholdSettingFieldName = typeof LAYER_THRESHOLD_SETTING_FIELD_NAMES[number];

export interface LayerThresholdSetting {
	enabled: boolean;
	value: number;
}

export interface LayerSettingsDialogState {
	dialogType: 'layerSettings';
	layerIndex: number;
	thresholds: {
		[key in LayerThresholdSettingFieldName]: LayerThresholdSetting;
	};
}
