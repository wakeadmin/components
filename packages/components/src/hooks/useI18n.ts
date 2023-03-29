import { useFatConfigurable } from '../fat-configurable';
import { defaultI18nInstance } from '../i18n';

export function useI18n() {
  const configurable = useFatConfigurable();
  return configurable?.i18n ?? defaultI18nInstance;
}

export function useT() {
  const i18n = useI18n();
  return i18n.t;
}
