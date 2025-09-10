import type {
  CursorPageMetaDto,
  PageMetaDto,
} from '@/shared/dto/page-meta.dto';

export class PaginationDto<T> {
  readonly data: T[];

  readonly meta: PageMetaDto | CursorPageMetaDto;

  constructor(data: T[], meta: PageMetaDto | CursorPageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
