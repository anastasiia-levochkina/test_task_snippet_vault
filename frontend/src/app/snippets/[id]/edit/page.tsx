'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSnippet, updateSnippet } from '@/lib/api';
import { Snippet } from '@/lib/types';

type Props = {
	params: Promise<{ id: string }>;
};

export default function EditSnippetPage({ params }: Props) {
	const router = useRouter();
	const [id, setId] = useState('');
	const [snippet, setSnippet] = useState<Snippet | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [formError, setFormError] = useState('');
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState('');
	const [type, setType] = useState<'note' | 'link' | 'command'>('note');

	const inputClass = 'h-12 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-black';
	const textareaClass = 'min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black';

	useEffect(() => {
		params.then((resolved) => setId(resolved.id));
	}, [params]);

	useEffect(() => {
		if (!id) return;

		async function loadSnippet() {
			setIsLoading(true);
			setError('');

			try {
				const data = await getSnippet(id);
				setSnippet(data);
				setTitle(data.title);
				setContent(data.content);
				setTags((data.tags ?? []).join(', '));
				setType(data.type ?? 'note');
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load snippet',
				);
			} finally {
				setIsLoading(false);
			}
		}

		loadSnippet();
	}, [id]);

	async function handleSubmit() {
		const normalizedTitle = title.trim();
		const normalizedContent = content.trim();

		if (!normalizedTitle || !normalizedContent) {
			setFormError('Title and content are required.');
			return;
		}

		setFormError('');

		try {
			await updateSnippet(id, {
				title: normalizedTitle,
				content: normalizedContent,
				tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
				type,
			});
			router.push(`/snippets/${id}`);
			router.refresh();
		} catch (err) {
			setFormError(err instanceof Error ? err.message : 'Failed to update snippet');
		}
	}

	if (isLoading) {
		return (
			<main className="mx-auto max-w-3xl px-4 py-10">
				<p>Loading snippet...</p>
			</main>
		);
	}

	if (error) {
		return (
			<main className="mx-auto max-w-3xl px-4 py-10">
				<p className="text-red-500">{error}</p>
			</main>
		);
	}

	if (!snippet) {
		return (
			<main className="mx-auto max-w-3xl px-4 py-10">
				<p>Snippet not found.</p>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-3xl px-4 py-10">
			<Link href={`/snippets/${id}`} className="mb-6 inline-block text-sm text-gray-500 hover:text-black">
				← Back to details
			</Link>

			<h1 className="mb-4 text-2xl font-bold">Edit snippet</h1>

			<div className="space-y-3">
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
					className={textareaClass}
					placeholder="Content"
					required
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
						if (formError) setFormError('');
					}}
				/>

				<input
					className={inputClass}
					placeholder="tags (comma separated)"
					value={tags}
					onChange={(e) => {
						setTags(e.target.value);
						if (formError) setFormError('');
					}}
				/>

				<select
					className={inputClass}
					value={type}
					onChange={(e) => setType(e.target.value as 'note' | 'link' | 'command')}
				>
					<option value="note">Note</option>
					<option value="link">Link</option>
					<option value="command">Command</option>
				</select>

				<button
					onClick={handleSubmit}
					className="h-12 rounded-lg bg-black px-6 text-white hover:bg-gray-800"
				>
					Save changes
				</button>

				{formError ? <p className="text-sm text-red-600">{formError}</p> : null}
			</div>
		</main>
	);
}
