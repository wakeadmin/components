import {
  ClassValue,
  StyleValue,
  Dialog,
  UploadInternalFileDetail,
  UploadInternalRawFile,
  UploadProps,
  Upload,
  Button,
  Message,
  Table,
  TableColumn,
} from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { computed, ref } from '@wakeadmin/demi';

import { ToHEmitDefinition, ToHSlotDefinition, hasSlots, inheritProps, normalizeClassName, renderSlot } from '../utils';
import { useLazyFalsy, useT } from '../hooks';
import { FatIcon } from '../fat-icon';
import { useUploadAccept } from '../hooks/useUploadAccept';
import { formatFileSize, isPromise } from '@wakeadmin/utils';
import { CheckCircleFill, WarningFill } from '@wakeadmin/icons';

export interface FatImportEvents {
  onImportSuccess?: (result: FatImportSuccessResult) => void;
  onImportError?: (result: FatImportErrorResult) => void;
  onImportComplete?: (result: FatImportResult) => void;
}

export interface FatImportSuccessResult {
  status: 'success';
  message?: string;

  /**
   * 额外数据，可以在 onSuccess 中获取到
   */
  extra?: any;
}

export interface FatImportErrorResult {
  status: 'error';
  message?: string;

  /**
   * 失败详情数据
   */
  details?: { row: string | number; reason: string }[];

  /**
   * 额外数据，可以在 onError 中获取到
   */
  extra?: any;
}

export type FatImportResult = FatImportSuccessResult | FatImportErrorResult;

export interface FatImportSlots {
  renderTitle?: () => any;
  renderMessage?: () => any;
  renderUploadMessage?: () => any;
}

export interface FatImportProps extends Omit<UploadProps, 'accept'>, FatImportEvents, FatImportSlots {
  /**
   * 标题，默认为 批量导入
   */
  title?: any;

  /**
   * 提示消息
   */
  message?: any;

  /**
   * 上传提示消息，默认为 只能上传xlsx、xls格式文件
   */
  uploadMessage?: any;

  /**
   * 遵循 input#file 规范 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   *
   * 你也可以传入扩展名数组, 例如 [.jpg, .jpeg, .png].
   *
   * NOTE: 传入扩展名数组，我们才会对文件类型进行校验，否则只是在系统文件选择器中进行筛选
   * 默认为 [.xls, .xlsx]
   */
  accept?: string | string[];

  /**
   * 文件上传前置检查
   */
  beforeUpload?: (file: UploadInternalRawFile) => boolean | Promise<File | Blob | boolean | void>;

  /**
   * 文件上传后处理
   * 可以在这里对 file.response 进行处理，
   * @param file
   * @returns
   */
  afterUpload?: (files: UploadInternalFileDetail[]) => Promise<FatImportResult>;

  /**
   * 自定义限额提示语, 在尺寸、大小不符合预期的情况下提示
   */
  limitMessage?: string;

  /**
   * 数量限制, 默认为 1
   */
  limit?: number;

  /**
   * 大小限制
   */
  sizeLimit?: number;

  modalClassName?: ClassValue;
  modalStyle?: StyleValue;
}

enum Status {
  Pending,
  Success,
  Failed,
}

class BreakError extends Error {}

export const FatImport = declareComponent({
  name: 'FatImport',
  props: declareProps<FatImportProps>({
    title: {
      type: [String, Object],
    },
    message: {
      type: [String, Object],
      default: null,
    },
    uploadMessage: {
      type: [String, Object],
    },
    accept: {
      type: [String, Array],
      default: () => ['.xls', '.xlsx'],
    },
    beforeUpload: null,
    afterUpload: null,
    limitMessage: {
      type: String,
      default: null,
    },
    limit: {
      type: Number,
      default: 1,
    },
    sizeLimit: {
      type: Number,
      default: null,
    },
    modalClassName: null,
    modalStyle: null,

    // slots
    renderTitle: null,
    renderMessage: null,
    renderUploadMessage: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatImportEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatImportSlots>>(),
  setup(props, { emit, attrs, slots }) {
    const visible = ref(false);
    const submitting = ref(false);
    const status = ref(Status.Pending);
    const lazyVisible = useLazyFalsy(visible);
    const t = useT();
    const handleVisibleChange = (v: boolean) => {
      visible.value = v;
    };
    const uploadRef = ref<{ submit: () => void } | undefined>();
    const files = ref<UploadInternalFileDetail[]>([]);
    const importResult = ref<FatImportResult | undefined>();

    const open = () => {
      status.value = Status.Pending;
      files.value = [];
      importResult.value = undefined;
      submitting.value = false;
      visible.value = true;
    };

    const close = () => {
      visible.value = false;
    };

    const accept = useUploadAccept(
      'FatImport',
      computed(() => {
        return props.accept!;
      })
    );

    const handleSubmit = () => {
      if (files.value.length === 0) {
        Message.warning(t('wkc.import.selectFile'));
        return;
      }

      uploadRef.value?.submit();

      submitting.value = true;
    };

    const handleExceed = (file: UploadInternalFileDetail, list: UploadInternalFileDetail[]) => {
      Message.warning(t('wkc.selectMaxFiles', { limit: props.limit }));
    };

    const handleBeforeUpload = async (file: UploadInternalRawFile) => {
      try {
        if (props.sizeLimit && file.size > props.sizeLimit) {
          throw new Error(props.limitMessage ?? t('wkc.selectFileLessThan', { size: formatFileSize(props.sizeLimit) }));
        }

        if (Array.isArray(props.accept)) {
          const filename = file.name;
          if (!props.accept.some(ext => filename.endsWith(ext))) {
            throw new Error(
              props.limitMessage ?? t('wkc.selectFileFormat', { format: props.accept.map(i => i.slice(1)).join('/') })
            );
          }
        }

        if (props.beforeUpload) {
          const result = props.beforeUpload(file);
          if (isPromise(result)) {
            await result;
          } else if (!result) {
            throw new BreakError();
          }
        }
      } catch (err) {
        if (!(err instanceof BreakError)) {
          Message.warning((err as Error).message);
        }

        throw err;
      }
    };

    const isAllDone = (list: UploadInternalFileDetail[]) => {
      return list.every(i => i.status === 'success' || i.status === 'fail');
    };

    const handleChange = async (file: UploadInternalFileDetail, list: UploadInternalFileDetail[]) => {
      files.value = list;

      // 全部文件就绪
      if (list.length && isAllDone(list)) {
        submitting.value = false;

        const afterUpload =
          props.afterUpload ??
          (async results => {
            if (results.every(i => i.status === 'success')) {
              return {
                status: 'success',
              };
            } else {
              return {
                status: 'error',
                message: t('wkc.import.uploadFailed'),
              };
            }
          });

        let result: FatImportResult;
        try {
          result = (await afterUpload(list)) ?? {
            status: 'success',
          };
        } catch (err) {
          result = {
            status: 'error',
            message: (err as Error).message,
          };
        } finally {
          const res = (importResult.value = result!);

          if (res.status === 'success') {
            emit('importSuccess', res);
            status.value = Status.Success;
          } else {
            emit('importError', res);
            status.value = Status.Failed;
          }

          emit('importComplete', res);
        }
      }
    };

    const titleSlot = computed(() => {
      if (status.value === Status.Pending) {
        return hasSlots(props, slots, 'title')
          ? renderSlot(props, slots, 'title')
          : props.title ?? t('wkc.import.title');
      }

      return t('wkc.import.result');
    });

    const footerSlot = computed(() => {
      if (status.value === Status.Pending) {
        return (
          <div class="fat-import__footer">
            <Button onClick={close}>{t('wkc.cancel')}</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting.value}>
              {t('wkc.import.submit')}
            </Button>
          </div>
        );
      }

      return (
        <div class="fat-import__footer">
          <Button type="primary" onClick={close}>
            {t('wkc.confirm')}
          </Button>
        </div>
      );
    });

    return () => {
      const { modalClassName, modalStyle, limit } = props;

      return (
        <div class={normalizeClassName('fat-import', attrs.class)} style={attrs.style} onClick={open}>
          <Dialog
            appendToBody
            modalAppendToBody
            width="480px"
            closeOnClickModal={false}
            closeOnPressEscape={false}
            modelValue={visible.value}
            onUpdate:modelValue={handleVisibleChange}
            class={normalizeClassName('fat-import__modal', modalClassName)}
            style={modalStyle}
            v-slots={{
              title: titleSlot.value,
              footer: footerSlot.value,
            }}
          >
            {!!lazyVisible.value &&
              (status.value === Status.Pending ? (
                <div class="fat-import__body">
                  <div class="fat-import__message">
                    {hasSlots(props, slots, 'message') ? renderSlot(props, slots, 'message') : props.message}
                  </div>
                  <Upload
                    {...inheritProps()}
                    class="fat-import__upload"
                    autoUpload={false}
                    multiple={limit! > 1}
                    limit={limit}
                    accept={accept.value}
                    ref={uploadRef}
                    onExceed={handleExceed}
                    beforeUpload={handleBeforeUpload}
                    onChange={handleChange}
                    drag
                  >
                    <div class="fat-import__upload-body">
                      <FatIcon class="fat-import__upload-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 56 56"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                        >
                          <path
                            d="M44.198,14.3605 C41.5010517,7.79068847 35.1027025,3.5007701 28.000875,3.5007701 C20.8990475,3.5007701 14.5006983,7.79068847 11.80375,14.3605 C5.88893022,15.7549674 1.71988148,21.0480991 1.74983787,27.125 C1.74983787,34.363 7.637,40.25 14.875,40.25 L19.87825,40.25 C20.8447483,40.25 21.62825,39.4664983 21.62825,38.5 C21.62825,37.5335017 20.8447483,36.75 19.87825,36.75 L14.875,36.75 C9.56165814,36.7442131 5.25578691,32.4383419 5.25,27.125 C5.22629965,22.3809932 8.68085676,18.3352899 13.37,17.6155 L14.41125,17.45275 L14.7525,16.45525 C16.69325,10.79925 22.01675,7 28,7 C33.9818306,6.99831203 39.3038984,10.7973782 41.24575,16.45525 L41.58875,17.45275 L42.63,17.6155 C47.3191432,18.3352899 50.7737004,22.3809932 50.75,27.125 C50.75,32.431 46.431,36.75 41.125,36.75 L35.805,36.75 C34.8385017,36.75 34.055,37.5335017 34.055,38.5 C34.055,39.4664983 34.8385017,40.25 35.805,40.25 L41.125,40.25 C48.363,40.25 54.2501642,34.363 54.2501642,27.125 C54.2803079,21.0486175 50.1121241,15.7556626 44.198,14.3605 Z M35.5355,31.1745 C36.0194162,31.5705736 36.677876,31.6783944 37.2628439,31.4573475 C37.8478118,31.2363005 38.2704173,30.719968 38.371469,30.1028474 C38.4725206,29.4857269 38.2366663,28.8615736 37.75275,28.4655 L29.1095,21.3885 C28.4643773,20.8596104 27.5356227,20.8596104 26.8905,21.3885 L18.193,28.511 C17.6226392,28.9802543 17.4078779,29.7568343 17.6560929,30.4524637 C17.9043079,31.1480931 18.5621661,31.6133043 19.30075,31.6155 C19.704989,31.6160956 20.0967633,31.4756015 20.4085,31.21825 L26.25,26.439 L26.25,45.875 C26.25,46.8414983 27.0335017,47.625 28,47.625 C28.9664983,47.625 29.75,46.8414983 29.75,45.875 L29.75,26.439 L35.5355,31.1745 Z"
                            fill-rule="nonzero"
                          />
                        </svg>
                      </FatIcon>
                      <div>
                        {t('wkc.import.dragAndDropFileOr')}
                        <a class="is-link">{t('wkc.import.clickToUpload')}</a>
                      </div>
                    </div>
                  </Upload>
                  <div class="fat-import__upload-message">
                    {hasSlots(props, slots, 'uploadMessage')
                      ? renderSlot(props, slots, 'uploadMessage')
                      : props.uploadMessage ?? t('wkc.import.uploadMessage')}
                  </div>
                </div>
              ) : status.value === Status.Success ? (
                <div class="fat-import__body is-success">
                  <FatIcon class="fat-import__icon">
                    <CheckCircleFill />
                  </FatIcon>
                  <span>{importResult.value?.message ?? t('wkc.import.success')}</span>
                </div>
              ) : (
                <div class="fat-import__body is-error">
                  <FatIcon class="fat-import__icon">
                    <WarningFill />
                  </FatIcon>
                  <span>{importResult.value?.message ?? t('wkc.import.failed')}</span>
                  {!!(importResult.value?.status === 'error' && importResult.value.details?.length) && (
                    <div class="fat-import__detail">
                      <header class="fat-import__subtitle">{t('wkc.import.errorData')}</header>
                      <Table data={importResult.value.details} size="small" maxHeight={400}>
                        <TableColumn label={t('wkc.import.errorLine')} prop="row"></TableColumn>
                        <TableColumn label={t('wkc.import.errorReason')} prop="reason"></TableColumn>
                      </Table>
                    </div>
                  )}
                  <div></div>
                </div>
              ))}
          </Dialog>
          {slots.default?.()}
        </div>
      );
    };
  },
});
