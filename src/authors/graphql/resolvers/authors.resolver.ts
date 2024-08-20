import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Author } from '../models/author'
import { Inject } from '@nestjs/common'
import { ListAuthorsUsecase } from '@/authors/usecases/list-authors.usecase'
import { SearchParamsArgs } from '../args/search-params.args'
import { SearchAuthorsResult } from '../models/search-authors-result'
import { CreateAuthorUsecase } from '@/authors/usecases/create-author.usecase'
import { CreateAuthorInput } from '../inputs/create-author.input'
import { GetAuthorUsecase } from '@/authors/usecases/get-author.usecase'
import { AuthorIdArgs } from '../args/author-id.args'
import { UpdateAuthorUsecase } from '@/authors/usecases/update-author.usecase'
import { UpdateAuthorInput } from '../inputs/update-author.input'

@Resolver(() => Author)
export class AuthorsResolver {
  @Inject(ListAuthorsUsecase.Usecase)
  private listAuthorUseCase: ListAuthorsUsecase.Usecase

  @Inject(CreateAuthorUsecase.Usecase)
  private createAuthorUseCase: CreateAuthorUsecase.Usecase

  @Inject(GetAuthorUsecase.Usecase)
  private getAuthorUseCase: GetAuthorUsecase.Usecase

  @Inject(UpdateAuthorUsecase.Usecase)
  private updateAuthorUsecase: UpdateAuthorUsecase.Usecase

  @Query(() => SearchAuthorsResult)
  async authors(
    @Args() { page, perPage, sort, sortDir, filter }: SearchParamsArgs,
  ) {
    const list = await this.listAuthorUseCase.execute({
      page,
      perPage,
      sort,
      sortDir,
      filter,
    })

    return list
  }

  @Query(() => Author)
  async getAuthorById(@Args() { id }: AuthorIdArgs) {
    return this.getAuthorUseCase.execute({ id })
  }

  @Mutation(() => Author)
  async createAuthor(@Args('data') data: CreateAuthorInput) {
    return this.createAuthorUseCase.execute(data)
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Args() { id }: AuthorIdArgs,
    @Args('data') data: UpdateAuthorInput,
  ) {
    return this.updateAuthorUsecase.execute({ id, ...data })
  }
}
