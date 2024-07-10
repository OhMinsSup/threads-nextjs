import { IntersectionType } from "@nestjs/swagger";

import { PaginationQuery } from "../../../dto/pagination.query";
import { SearchBaseQuery } from "../../../routes/search/dto/search-base.dto";

export class PostListQuery extends IntersectionType(
  PaginationQuery,
  SearchBaseQuery,
) {}
