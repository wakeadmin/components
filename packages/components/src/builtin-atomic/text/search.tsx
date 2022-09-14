import { Search } from '@wakeadmin/icons';

import { globalRegistry, defineAtomic, defineAtomicComponent } from '../../atomic';
import { FatIcon } from '../../fat-icon';

import { ATextProps, ATextComponent } from './text';

export interface ASearchProps extends ATextProps {
  /**
   * 搜索图标的位置，默认为 left
   */
  searchPlacement?: 'left' | 'right';
}

declare global {
  interface AtomicProps {
    search: ASearchProps;
  }
}

export const ASearchComponent = defineAtomicComponent(
  (props: ASearchProps) => {
    return () => {
      const { searchPlacement = 'left', ...other } = props;

      return ATextComponent({
        clearable: true,
        ...other,
        'v-slots': {
          ...other['v-slots'],
          [searchPlacement === 'left' ? 'prefix' : 'suffix']: (
            <FatIcon align="middle" style="margin-left: 5px" size="1.15em">
              <Search />
            </FatIcon>
          ),
        },
      });
    };
  },
  { name: 'ASearch', globalConfigKey: 'aSearchProps' }
);

export const ASearch = defineAtomic({
  name: 'search',
  component: ASearchComponent,
  description: '带搜索icon 的搜索框',
  author: 'ivan-lee',
});

globalRegistry.register('search', ASearch);
