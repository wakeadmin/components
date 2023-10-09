/* eslint-disable vue/require-default-prop */
import {
  Component,
  set,
  computed,
  defineComponent,
  inject,
  isVue2,
  reactive,
  ref,
  unref,
  watch,
} from '@wakeadmin/demi';
import { Loading, Translate, CrossCircleFill } from '@wakeadmin/icons';
import { Dropdown, DropdownMenu, DropdownItem } from '@wakeadmin/element-adapter';
import { NoopArray } from '@wakeadmin/utils';

import { UsePromiseCacheState, usePromise } from '../hooks';
import { FatIcon } from '../fat-icon';
import { normalizeClassName, inheritProps, normalizeStyle } from '../utils';

import { FatI18nContentProps } from './types';
import { FatI18nContentDefaultOptions, FatI18nContentKey } from './constants';
import { parse, serialize, toPromiseFunction } from './utils';

/**
 * 高阶函数，用于创建内容多语言控件
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function createFatI18nContentControl<T extends Component>(Tag: T, options?: FatI18nContentProps): T {
  return defineComponent({
    name: `FatI18nContent<${Tag.name ?? 'unknown'}>`,
    props: {
      // vue 2
      value: String,
      // vue 3
      modelValue: String,

      // 参数
      i18nContentOptions: null,
    },
    setup(props, { emit }) {
      const localPromiseCache = new Map<string, UsePromiseCacheState>();
      const injected = inject(FatI18nContentKey, {});
      const finalOptions = {
        ...FatI18nContentDefaultOptions,
        ...injected,
        ...options,
        ...(props.i18nContentOptions as FatI18nContentProps | undefined),
      };

      const sourceLanguage = usePromise('fat-i18n-source-language', toPromiseFunction(finalOptions.sourceLanguage));
      const languageList = usePromise('fat-i18n-languages', toPromiseFunction(finalOptions.list));

      /**
       * 当前选择的语言
       */
      const currentLanguage = ref();

      const originValue = computed(() => {
        const val = isVue2 ? props.value : props.modelValue;
        return parse(val ?? '', finalOptions.format, finalOptions.parse);
      });

      /**
       * 语言包
       */
      const remotePack = usePromise(
        computed(() => {
          return originValue.value.uuid;
        }),
        uuid => {
          return finalOptions.get(uuid);
        },
        // 本地缓存
        localPromiseCache
      );

      /**
       * 本地语言包
       */
      const localPack = reactive({} as Record<string, string>);
      let uuidLoading = false;
      let focusing = false;

      const loading = computed(() => {
        return sourceLanguage.loading.value || languageList.loading.value || remotePack.loading.value;
      });

      const error = computed(() => {
        return sourceLanguage.error.value || languageList.error.value || remotePack.error.value;
      });

      const computedValue = computed(() => {
        const { default: defaultValue } = unref(originValue);
        const lang = currentLanguage.value;

        // 原始值
        if (lang == null || lang === sourceLanguage.result.value) {
          return defaultValue;
        }

        // 动态值
        if (localPack[lang] != null) {
          return localPack[lang];
        }

        const found = remotePack.result.value?.find(i => i.code === lang);

        return found?.content ?? '';
      });

      const emitChange = (value: string) => {
        if (isVue2) {
          emit('input', value);
        } else {
          emit('update:modelValue', value);
        }
      };

      const loadUUID = async () => {
        try {
          uuidLoading = true;
          const id = await finalOptions.genUUID();

          // 初始化语言包
          localPromiseCache.set(id, { result: [] });

          const targetValue = serialize(
            {
              default: originValue.value.default,
              uuid: id,
            },
            finalOptions.format,
            finalOptions.serialize
          );

          emitChange(targetValue);
        } catch (err) {
          console.error(`生成 UUID 失败`, err);
        } finally {
          uuidLoading = false;
        }
      };

      const handleLanguageChange = (tag: string) => {
        if (!tag) {
          return;
        }

        currentLanguage.value = tag;
      };

      const handleChange = (value: string) => {
        if (!finalOptions.enable) {
          // 不需要经过任何转换
          emitChange(value);
          return;
        }

        value = value ?? '';
        const lang = currentLanguage.value;

        if (lang == null || lang === sourceLanguage.result.value) {
          // 默认语言变更
          const targetValue = serialize(
            {
              default: value,
              uuid: originValue.value.uuid,
            },
            finalOptions.format,
            finalOptions.serialize
          );

          emitChange(targetValue);
        } else {
          set(localPack, lang, value);

          // 生成 UUID
          if (originValue.value.uuid == null && value && !uuidLoading) {
            loadUUID();
          }
        }
      };

      /**
       * 保存语言包
       */
      const handleSavePack = async () => {
        // 判断数据是否变更，如果变更需要写入语言包
        const remote = remotePack.result.value ?? NoopArray;
        const local = Object.keys(localPack).map(i => ({
          code: i,
          content: localPack[i],
        }));

        const toSave = local.filter(i => {
          const r = remote.find(j => j.code === i.code);

          if (r == null) {
            return true;
          }

          return i.content !== r.content;
        });

        if (!toSave.length) {
          return;
        }

        console.assert(originValue.value.uuid != null);

        try {
          const merged = remote.slice();

          for (const changed of toSave) {
            const idx = merged.findIndex(i => i.code === changed.code);
            if (idx !== -1) {
              merged[idx] = changed;
            } else {
              merged.push(changed);
            }
          }

          await finalOptions.save(originValue.value.uuid!, toSave, merged);

          remotePack.result.value = merged;
        } catch (err) {
          console.error(`语言包保存失败:`, err);
        }
      };

      const handleFocus = (...args: any[]) => {
        emit('focus', ...args);
        focusing = true;
      };

      const handleBlur = (...args: any[]) => {
        // 向上透传
        emit('blur', ...args);
        focusing = false;

        if (uuidLoading || remotePack.loading.value) {
          return;
        }

        // 触发语言包保存
        handleSavePack();
      };

      watch(
        sourceLanguage.result,
        source => {
          // 同步
          if (source && currentLanguage.value == null) {
            currentLanguage.value = source;
          }
        },
        { immediate: true }
      );

      // 远程模块加载完毕后触发保存
      watch(remotePack.result, () => {
        if (!focusing) {
          handleSavePack();
        }
      });

      watch(error, err => {
        console.error(err);
      });

      return () => {
        if (!finalOptions.enable) {
          return (
            // @ts-expect-error
            <Tag
              {...inheritProps(false)}
              {...{
                [isVue2 ? 'value' : 'modelValue']: computedValue.value,
                [isVue2 ? 'onInput' : 'onUpdate:modelValue']: handleChange,
              }}
            ></Tag>
          );
        }

        const outerProps = inheritProps(false);

        return finalOptions.inject(
          outerProps,
          _props => {
            const active = currentLanguage.value && currentLanguage.value !== sourceLanguage.result.value;

            return (
              <Dropdown
                {..._props}
                onCommand={handleLanguageChange}
                class={normalizeClassName(
                  'fat-i18n-content__dropdown',
                  finalOptions.position,
                  finalOptions.badgeClass,
                  _props?.class
                )}
                style={normalizeStyle(finalOptions.badgeStyle, _props?.style)}
                v-slots={{
                  ..._props?.['v-slots'],
                  dropdown: error.value ? (
                    <DropdownMenu>
                      <DropdownItem command="">
                        <div class="fat-i18n-content__error">{error.value.message}</div>
                      </DropdownItem>
                    </DropdownMenu>
                  ) : (
                    <DropdownMenu>
                      {languageList.result.value?.map(i => {
                        const act = currentLanguage.value === i.tag;
                        return (
                          <DropdownItem
                            command={i.tag}
                            class={normalizeClassName('fat-i18n-content__menu-item', { active: act })}
                          >
                            {!!i.icon && <span style={{ marginRight: '5px' }}>{i.icon}</span>}
                            {i.name}
                            {act}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  ),
                }}
              >
                <div
                  class={normalizeClassName('fat-i18n-content__badge', {
                    loading: loading.value,
                    error: error.value,
                    active,
                  })}
                >
                  <FatIcon loading={loading.value}>
                    {loading.value ? <Loading></Loading> : error.value ? <CrossCircleFill /> : <Translate></Translate>}
                  </FatIcon>
                  {active && <div class="fat-i18n-content__lang">{currentLanguage.value}</div>}
                </div>
              </Dropdown>
            );
          },
          _props => {
            const factoryProps =
              typeof finalOptions.targetProps === 'function'
                ? finalOptions.targetProps(outerProps)
                : finalOptions.targetProps;

            const targetProps = {
              ...outerProps,
              ...factoryProps,
              ..._props,
              // class 合并,
              class: normalizeClassName(outerProps.class, factoryProps?.class, _props?.class),
              style: normalizeStyle(outerProps.style, factoryProps?.style, _props?.style),
              // 插槽合并
              'v-slots': {
                ...outerProps['v-slots'],
                ...factoryProps?.['v-slots'],
                ..._props?.['v-slots'],
              },
              [isVue2 ? 'value' : 'modelValue']: computedValue.value,
              [isVue2 ? 'onInput' : 'onUpdate:modelValue']: handleChange,
              onFocus: handleFocus,
              onBlur: handleBlur,
            };

            // @ts-expect-error
            return <Tag disabled={loading.value} {...targetProps}></Tag>;
          }
        );
      };
    },
  }) as T;
}
