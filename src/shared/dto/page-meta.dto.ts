import { OmitType } from '@nestjs/swagger';

interface IPageMeta {
  page: number;
  take: number;
  totalCount: number;
}
export class PageMetaDto {
  constructor({ page, take, totalCount }: IPageMeta) {
    this.page = page;
    this.take = take;
    this.totalCount = totalCount;
  }

  page!: number;

  take!: number;

  totalCount!: number;
}

export class CursorPageMetaDto extends OmitType(PageMetaDto, [
  'page',
  'totalCount',
]) {
  readonly cursor?: number;
}
