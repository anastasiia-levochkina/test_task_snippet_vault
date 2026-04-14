import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { GetSnippetsQueryDto } from './dto/get-snippets-query.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Snippet, SnippetDocument } from './schemas/snippet.schema';

@Injectable()
export class SnippetsService {
	constructor(
		@InjectModel(Snippet.name)
		private readonly snippetModel: Model<SnippetDocument>,
	) {}

	async create(createSnippetDto: CreateSnippetDto) {
		const snippet = new this.snippetModel({
			...createSnippetDto,
			tags: createSnippetDto.tags ?? [],
		});

		return await snippet.save();
	}

	async findAll(queryDto: GetSnippetsQueryDto) {
		const page = queryDto.page;
		const limit = queryDto.limit;
		const q = queryDto.q?.trim();
		const tag = queryDto.tag?.trim();

		const filter: FilterQuery<SnippetDocument> = {};

		if (q) {
			filter.$or = [
				{ title: { $regex: q, $options: 'i' } },
				{ content: { $regex: q, $options: 'i' } },
			];
		}

		if (tag) {
			filter.tags = tag;
		}

		const skip = (page - 1) * limit;

		const items = await this.snippetModel
			.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);
		const total = await this.snippetModel.countDocuments(filter);

		return {
			items,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async findOne(id: string) {
		const snippet = await this.snippetModel.findById(id);

		if (!snippet) {
			throw new NotFoundException('Snippet not found');
		}

		return snippet;
	}

	async update(id: string, updateSnippetDto: UpdateSnippetDto) {
		const snippet = await this.snippetModel.findByIdAndUpdate(
			id,
			updateSnippetDto,
			{ new: true, runValidators: true },
		);

		if (!snippet) {
			throw new NotFoundException('Snippet not found');
		}

		return snippet;
	}

	async remove(id: string) {
		const snippet = await this.snippetModel.findByIdAndDelete(id);

		if (!snippet) {
			throw new NotFoundException('Snippet not found');
		}

		return { message: 'Snippet deleted successfully' };
	}
}
