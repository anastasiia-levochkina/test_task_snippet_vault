import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { GetSnippetsQueryDto } from './dto/get-snippets-query.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetsService } from './snippets.service';

@Controller('snippets')
export class SnippetsController {
	constructor(private readonly snippetsService: SnippetsService) {}

	@Post()
	create(@Body() createSnippetDto: CreateSnippetDto) {
		return this.snippetsService.create(createSnippetDto);
	}

	@Get()
	findAll(@Query() queryDto: GetSnippetsQueryDto) {
		return this.snippetsService.findAll(queryDto);
	}

	@Get(':id')
	findOne(@Param('id', ParseObjectIdPipe) id: string) {
		return this.snippetsService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseObjectIdPipe) id: string,
		@Body() updateSnippetDto: UpdateSnippetDto,
	) {
		return this.snippetsService.update(id, updateSnippetDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseObjectIdPipe) id: string) {
		return this.snippetsService.remove(id);
	}
}
