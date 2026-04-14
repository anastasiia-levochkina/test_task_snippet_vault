import { Snippet, SnippetPayload, SnippetsResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Something went wrong';

    try {
      const errorData = await response.json();
      message =
        errorData.message?.join?.(', ') ||
        errorData.message ||
        errorData.error ||
        message;
    } catch {
      // noop
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getSnippets(params?: {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
}): Promise<SnippetsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.q) searchParams.set('q', params.q);
  if (params?.tag) searchParams.set('tag', params.tag);

  const response = await fetch(`${API_URL}/snippets?${searchParams.toString()}`, {
    cache: 'no-store',
  });

  return handleResponse<SnippetsResponse>(response);
}

export async function getSnippet(id: string): Promise<Snippet> {
  const response = await fetch(`${API_URL}/snippets/${id}`, {
    cache: 'no-store',
  });

  return handleResponse<Snippet>(response);
}

export async function createSnippet(payload: SnippetPayload): Promise<Snippet> {
  const response = await fetch(`${API_URL}/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<Snippet>(response);
}

export async function updateSnippet(
  id: string,
  payload: SnippetPayload,
): Promise<Snippet> {
  const response = await fetch(`${API_URL}/snippets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<Snippet>(response);
}

export async function deleteSnippet(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/snippets/${id}`, {
    method: 'DELETE',
  });

  return handleResponse<{ message: string }>(response);
}
