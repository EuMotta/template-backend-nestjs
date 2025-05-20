import { ApiProperty } from '@nestjs/swagger';
import { PageOptions } from './page-options.dto';

export interface PageMetaParameters {
  pageOptions: PageOptions;
  itemCount: number;
}

export class PageMeta {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly item_count: number;

  @ApiProperty()
  readonly page_count: number;

  @ApiProperty()
  readonly has_previous_page: boolean;

  @ApiProperty()
  readonly has_next_page: boolean;

  constructor({ pageOptions, itemCount }: PageMetaParameters) {
    const page = Number(pageOptions.page) || 1;
    const limit = Number(pageOptions.limit) || 10;

    this.page = page;
    this.limit = limit;
    this.item_count = itemCount ?? 0;
    this.page_count = limit > 0 ? Math.ceil(this.item_count / limit) : 1;
    this.has_previous_page = page > 1;
    this.has_next_page = page < this.page_count;
  }
}
