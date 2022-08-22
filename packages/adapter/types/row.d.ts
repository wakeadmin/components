/** Horizontal alignment of flex layout */
export type HorizontalAlignment = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

/** vertical alignment of flex layout */
export type VertialAlignment = 'top' | 'middle' | 'bottom';

export interface RowProps {
  /** Grid spacing */
  gutter?: number;

  /** Horizontal alignment of flex layout */
  justify?: HorizontalAlignment;

  /** Vertical alignment of flex layout */
  align?: VertialAlignment;

  /** Custom element tag */
  tag?: string;
}

export const Row: (props: RowProps) => any;
