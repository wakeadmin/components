/**
 * 多文件上传
 */
import { Button, FileListItem, Upload, UploadProps } from '@wakeadmin/element-adapter';
import { File, Upload as UploadIcon } from '@wakeadmin/icons';
import { computed } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { normalizeClassName } from '../../utils';
import { useFatConfigurable } from '../../fat-configurable';

import { CommonUploadProps, useUpload } from './useUpload';
import { FatIcon } from '../../fat-icon';
import { getOrCreatePlaceholder } from '../../utils/placeholder';

/**
 * 值由用户自定定义，默认为 string 类型
 */
export type AFilesValue = any[];

export type AFilesProps = DefineAtomicProps<
  AFilesValue,
  Omit<UploadProps, 'fileList' | 'onChange' | 'onRemove' | 'accept'> & CommonUploadProps,
  {
    /**
     * 自定义渲染
     */
    renderPreview?: (list: FileListItem[]) => any;

    /**
     * 自定义文件上传占位
     */
    renderPlaceholder?: () => any;

    /**
     * 文案提示
     */
    tip?: any;

    /**
     * 是否隐藏默认文案提示
     */
    hideTip?: boolean;
  }
>;

declare global {
  interface AtomicProps {
    files: AFilesProps;
  }
}

export const AFilesComponent = defineAtomicComponent(
  (props: AFilesProps) => {
    const configurable = useFatConfigurable();
    const { handleExceed, fileList, accept, beforeUpload, handleChange, exceeded } = useUpload(props, {
      name: 'files',
    });

    const tip = computed(() => {
      if (props.tip) {
        return props.tip;
      }
      if (props.hideTip) {
        return undefined;
      }
      return <div class="fat-form-item-placeholder">{getOrCreatePlaceholder('files', props)}</div>;
    });

    return () => {
      const {
        mode,
        scene,
        context,
        value,
        onChange,
        renderPreview,
        renderPlaceholder,
        drag,

        // ignore
        transformToFileListItem,
        transformToValue,
        sizeLimit,
        filter,
        accept: _accept, // ignore
        tip: _tip,

        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(fileList.value);
        } else {
          return (
            <div class={normalizeClassName('fat-a-files', 'fat-a-files--preview', other.class)} style={other.style}>
              {fileList.value.length === 0
                ? configurable.undefinedPlaceholder
                : fileList.value.map((i, idx) => {
                    return (
                      <div class="fat-a-files__p-item" key={`${i.name}_${idx}`}>
                        <FatIcon class="fat-a-files__p-icon">
                          <File />
                        </FatIcon>
                        <span>{i.name ?? i.url}</span>
                      </div>
                    );
                  })}
            </div>
          );
        }
      }

      return (
        <Upload
          onExceed={handleExceed}
          multiple={props.limit !== 1}
          accept={accept.value}
          drag={drag}
          {...other}
          class={normalizeClassName('fat-a-files', { 'fat-a-files--exceeded': exceeded.value }, other.class)}
          style={other.style}
          fileList={fileList.value}
          beforeUpload={beforeUpload}
          onRemove={handleChange}
          onChange={handleChange}
          v-slots={{
            tip: tip.value,
          }}
        >
          {renderPlaceholder ? (
            renderPlaceholder()
          ) : drag ? (
            <div class="fat-a-files__dragger">
              <FatIcon class="fat-a-files__dragger-icon">
                <UploadIcon />
              </FatIcon>
              <div class="fat-a-files__dragger-text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </div>
          ) : (
            <Button type="primary" disabled={exceeded.value}>
              点击上传
            </Button>
          )}
        </Upload>
      );
    };
  },
  { name: 'AFiles', globalConfigKey: 'aFilesProps' }
);

export const AFiles = defineAtomic({
  name: 'files',
  component: AFilesComponent,
  description: '多选文件选择器',
  author: 'ivan-lee',
});
