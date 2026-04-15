'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/pagination';
import { createSnippet, deleteSnippet, getSnippets } from '@/lib/api';
import { Snippet } from '@/lib/types';

export default function HomePage() {
	const inputClass = 'h-12 rounded-lg border border-gray-300 px-4 outline-none focus:border-black';
	const textareaClass = 'h-12 resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black';

	const [snippets, setSnippets] = useState<Snippet[]>([]);
	const [searchValue, setSearchValue] = useState('');
	const [tagValue, setTagValue] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [activeFilter, setActiveFilter] = useState<{ q?: string; tag?: string }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [formError, setFormError] = useState('');
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState('');
	const [type, setType] = useState<'note' | 'link' | 'command'>('note');

	async function handleDelete(id: string) {
		try {
			await deleteSnippet(id);
			await loadSnippets(activeFilter, page);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete snippet');
		}
	}

	const handleSubmit = async () => {
		const normalizedTitle = title.trim();
		const normalizedContent = content.trim();

		if (!normalizedTitle || !normalizedContent) {
			setFormError('Title and content are required.');
			return;
		}

		setFormError('');

		try {
			await createSnippet({
				title: normalizedTitle,
				content: normalizedContent,
				tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
				type,
			});
			setTitle('');
			setContent('');
			setTags('');
			setType('note');
			setActiveFilter({});
			setPage(1);
		} catch (err) {
			setFormError(err instanceof Error ? err.message : 'Failed to create snippet');
		}
	};

	async function handleFilter() {
		const params: { q?: string; tag?: string } = {};

		if (searchValue.trim()) {
			params.q = searchValue.trim();
		}

		if (tagValue.trim()) {
			params.tag = tagValue.trim();
		}

		setActiveFilter(params);
		setPage(1);
	}

	async function loadSnippets(params: { q?: string; tag?: string } = {}, pageNum = 1) {
		try {
			setIsLoading(true);
			setError('');

			const data = await getSnippets({ ...params, page: pageNum });
			setSnippets(data.items);
			setTotalPages(data.totalPages ?? 1);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		loadSnippets(activeFilter, page);
	}, [page, activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<main className="mx-auto max-w-5xl px-6 py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Snippet Vault</h1>
				<p className="mt-2 text-gray-600">
					Save useful links, notes, and commands in one place.
				</p>
			</div>

			<section className="mb-12">
				<h2 className="mb-4 text-xl font-semibold">Create new snippet</h2>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-4">
					<input
						className={inputClass}
						placeholder="Title"
						required
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
							if (formError) setFormError('');
						}}
					/>

					<textarea
						className={`${textareaClass} md:col-span-2`}
						placeholder="Content"
						required
						value={content}
						onChange={(e) => {
							setContent(e.target.value);
							if (formError) setFormError('');
						}}
					/>

					<div className="flex flex-col gap-2">
						<input
							className={inputClass}
							placeholder="tags (comma separated)"
							value={tags}
							onChange={(e) => {
								setTags(e.target.value);
								if (formError) setFormError('');
							}}
						/>

						<div className="flex gap-2">
							<select
								className={`${inputClass} flex-1`}
								value={type}
								onChange={(e) => setType(e.target.value as 'note' | 'link' | 'command')}
							>
								<option value="note">Note</option>
								<option value="link">Link</option>
								<option value="command">Command</option>
							</select>

							<button
								onClick={handleSubmit}
								className="h-12 rounded-lg bg-black px-5 text-white hover:bg-gray-800"
							>
								Add
							</button>
						</div>
					</div>
				</div>
				{formError ? <p className="mt-3 text-sm text-red-600">{formError}</p> : null}
			</section>

			<section className="mb-12">
				<h2 className="mb-4 text-xl font-semibold">Search and filter</h2>

				<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
					<input
						className={inputClass}
						placeholder="Search..."
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>

					<input
						className={inputClass}
						placeholder="Filter by tag..."
						value={tagValue}
						onChange={(e) => setTagValue(e.target.value)}
					/>

					<button
						onClick={handleFilter}
						className="h-12 rounded-lg bg-blue-500 px-4 text-white hover:bg-blue-600"
					>
						Filter
					</button>
				</div>
			</section>

			<section className="mb-12">
				<h2 className="mb-4 text-xl font-semibold">Snippets</h2>

				{isLoading ? (
					<p className="rounded-xl border border-gray-200 bg-white p-6">
						Loading snippets...
					</p>
				) : error ? (
					<p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
						{error}
					</p>
				) : snippets.length === 0 ? (
					<p className="text-gray-500 text-center py-10">
						No snippets yet. Create your first one 👇
					</p>
				) : (
					<>
						<div className="space-y-4">
							{snippets.map((snippet) => (
							<div
								key={snippet._id}
								className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
							>
								<h3 className="text-2xl font-semibold">{snippet.title}</h3>
								<p className="mt-2 text-sm text-gray-500">{snippet.type}</p>
								<p className="mt-4 whitespace-pre-wrap text-gray-800">{snippet.content}</p>

								<div className="mt-4 flex flex-wrap gap-2">
									{(snippet.tags ?? []).map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
										>
											#{tag}
										</span>
									))}
								</div>

								<button
									onClick={() => handleDelete(snippet._id)}
									className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
								>
									Delete
								</button>
							</div>
							))}
						</div>

						<div className="mt-6">
							<Pagination
								page={page}
								totalPages={totalPages}
								onPageChange={setPage}
							/>
						</div>
					</>
				)}
			</section>
		</main>
	);
}
