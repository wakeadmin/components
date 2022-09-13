export type UploadListType = 'text' | 'picture' | 'picture-card';
export type FileUploadStatus = 'ready' | 'uploading' | 'success' | 'fail';

export interface FileListItem {
  name: string;
  url: string;
  status?: FileUploadStatus;
}

export interface UploadInternalRawFile extends File {
  uid: number;
}

export interface UploadInternalFileDetail {
  status: FileUploadStatus;
  name: string;
  size: number;
  percentage: number;
  uid: number;
  raw: UploadInternalRawFile;
  url?: string;
}

export interface UploadProgressEvent extends ProgressEvent {
  percent: number;
}

export interface HttpRequestOptions {
  headers: object;
  withCredentials: boolean;
  file: File;
  data: object;
  filename: string;
  action: string;
  onProgress: (e: UploadProgressEvent) => void;
  onSuccess: (response: any) => void;
  onError: (err: ErrorEvent) => void;
}

/**
 * on* 开头的 props 在 jsx 中有特殊意义，为了避免歧义，adapter 会使用 emit 抛出这些事件
 */
export interface UploadEvents {
  /** Hook function when clicking the uploaded files */
  onPreview?: (file: UploadInternalFileDetail) => void;

  /** Hook function when files are removed */
  onRemove?: (file: UploadInternalFileDetail, fileList: UploadInternalFileDetail[]) => void;

  /** Hook function when uploaded successfully */
  onSuccess?: (response: any, file: UploadInternalFileDetail, fileList: UploadInternalFileDetail[]) => void;

  /** Hook function when some errors occurs */
  onError?: (err: ErrorEvent, file: UploadInternalFileDetail, fileList: UploadInternalFileDetail[]) => void;

  /** Hook function when some progress occurs */
  onProgress?: (
    event: UploadProgressEvent,
    file: UploadInternalFileDetail,
    fileList: UploadInternalFileDetail[]
  ) => void;

  /** Hook function when file status change */
  onChange?: (file: UploadInternalFileDetail, fileList: UploadInternalFileDetail[]) => void;

  /** Hook function when limit is exceeded */
  onExceed?: (file: UploadInternalFileDetail, fileList: UploadInternalFileDetail[]) => void;
}

export interface UploadMethods {
  /** Clear the upload file list */
  clearFiles(): void;

  /** Abort specified file */
  abort(file: UploadInternalFileDetail): void;

  /** Upload the file list manually */
  submit(): void;
}

/** Upload Component */
export interface UploadProps extends UploadEvents {
  /**
   * Request URL (required)
   */
  action: string;

  /** Request headers */
  headers?: Record<string, string>;

  /** Whether uploading multiple files is permitted */
  multiple?: boolean;

  /**
   * 仅 element-plus 支持
   */
  method?: string;

  /** Additions options of request */
  data?: Record<string, any>;

  /** Key name for uploaded file */
  name?: string;

  /** Whether cookies are sent */
  withCredentials?: boolean;

  /** Whether to show the uploaded file list */
  showFileList?: boolean;

  /** Whether to activate drag and drop mode */
  drag?: boolean;

  /** Accepted file types, will not work when thumbnail-mode is true */
  accept?: string;

  /** Whether thumbnail is displayed */
  thumbnailMode?: boolean;

  /** Default uploaded files */
  fileList?: FileListItem[];

  /** Type of fileList */
  listType?: UploadListType;

  /** Whether to auto upload file */
  autoUpload?: boolean;

  /** Override default xhr behavior, allowing you to implement your own upload-file's request */
  httpRequest?: (options: HttpRequestOptions) => void;

  /** Whether to disable upload */
  disabled?: boolean;

  /** Maximum number of uploads allowed */
  limit?: number;

  /** Hook function before uploading with the file to be uploaded as its parameter. If false or a Promise is returned, uploading will be aborted */
  beforeUpload?: (file: UploadInternalRawFile) => boolean | Promise<File | Blob | boolean>;

  beforeRemove?: (
    file: UploadInternalFileDetail,
    fileList: UploadInternalFileDetail[]
  ) => boolean | Promise<File | Blob | boolean>;
}
