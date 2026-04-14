'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteSnippet, getSnippet } from '@/lib/api';
import { Snippet } from '@/lib/types';
import { formatDate } from '@/lib/utils';

type Props = {
	params: Promise<{ id: string }>;
};

export default function SnippetDetailsPage({ params }: Props) {
	const router = useRouter();
	const [id, setId] = useState('');
	const [snippet, setSnippet] = useState<Snippet | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

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

	async function handleDelete() {
		if (!id) return;

		const confirmed = window.confirm('Are you sure you want to delete this snippet?');
		if (!confirmed) return;

		try {
			await deleteSnippet(id);
			router.push('/');
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to delete snippet',
			);
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
			<Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-black">
				← Back to snippets
			</Link>

			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<div className="mb-4 flex items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold">{snippet.title}</h1>
						<p className="mt-1 text-sm text-gray-500">{snippet.type}</p>
					</div>

					<div className="flex gap-2">
						<Link
							href={`/snippets/${snippet._id}/edit`}
							className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
						>
							Edit
						</Link>

						<button
							onClick={handleDelete}
							className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
						>
							Delete
						</button>
					</div>
				</div>

				<p className="mb-5 whitespace-pre-wrap text-gray-700">{snippet.content}</p>

				<div className="mb-5 flex flex-wrap gap-2">
					{snippet.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
						>
							#{tag}
						</span>
					))}
				</div>

				<div className="space-y-1 text-sm text-gray-500">
					<p>Created: {formatDate(snippet.createdAt)}</p>
					<p>Updated: {formatDate(snippet.updatedAt)}</p>
				</div>
			</div>
		</main>
	);
}
