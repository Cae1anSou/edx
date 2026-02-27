type ApiEnvelope<T> = {
  code: string;
  message: string;
  data: T | null;
  error: {
    code: string;
    message: string;
  } | null;
};

export function currentUserId(): string {
  const fromWindow = (window as Window & { STUDIO_USER_ID?: string; __USER_ID__?: string });
  return fromWindow.STUDIO_USER_ID ?? fromWindow.__USER_ID__ ?? 'studio-react-user';
}

function withDefaultHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return {
    'X-User-Id': currentUserId(),
    ...headers
  };
}

function getCookie(name: string): string | null {
  const entries = document.cookie.split(';').map((part) => part.trim());
  for (const entry of entries) {
    if (entry.startsWith(`${name}=`)) {
      return decodeURIComponent(entry.substring(name.length + 1));
    }
  }
  return null;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  return JSON.parse(text);
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const maybe = value as Record<string, unknown>;
  return 'code' in maybe && 'message' in maybe && ('data' in maybe || 'error' in maybe);
}

function unwrapResponse<T>(json: unknown, responseOk: boolean): T {
  if (isApiEnvelope<T>(json)) {
    if (!responseOk || json.data === null) {
      throw new Error(json.error?.message ?? 'Request failed');
    }
    return json.data;
  }
  if (!responseOk) {
    if (json && typeof json === 'object' && 'detail' in (json as Record<string, unknown>)) {
      throw new Error(String((json as Record<string, unknown>).detail));
    }
    if (json && typeof json === 'object' && 'error' in (json as Record<string, unknown>)) {
      throw new Error(String((json as Record<string, unknown>).error));
    }
    throw new Error('Request failed');
  }
  return json as T;
}

export async function getApi<T>(url: string, options?: { headers?: Record<string, string> }): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: withDefaultHeaders(options?.headers)
  });
  const json = await parseJson(response);
  return unwrapResponse<T>(json, response.ok);
}

export async function postApi<TBody extends object, TResult>(url: string, body: TBody): Promise<TResult> {
  const csrfToken = getCookie('csrftoken') ?? getCookie('csrf_token') ?? '';
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...withDefaultHeaders({
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      })
    },
    body: JSON.stringify(body)
  });
  const json = await parseJson(response);
  return unwrapResponse<TResult>(json, response.ok);
}

export async function putApi<TBody extends object, TResult>(url: string, body: TBody): Promise<TResult> {
  const csrfToken = getCookie('csrftoken') ?? getCookie('csrf_token') ?? '';
  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      ...withDefaultHeaders({
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      })
    },
    body: JSON.stringify(body)
  });
  const json = await parseJson(response);
  return unwrapResponse<TResult>(json, response.ok);
}

export async function deleteApi(url: string): Promise<void> {
  const csrfToken = getCookie('csrftoken') ?? getCookie('csrf_token') ?? '';
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...withDefaultHeaders({
        'X-CSRFToken': csrfToken
      })
    }
  });
  if (!response.ok) {
    const json = await parseJson(response);
    unwrapResponse<null>(json, response.ok);
  }
}

export async function patchApi<TBody extends object, TResult>(url: string, body: TBody): Promise<TResult> {
  const csrfToken = getCookie('csrftoken') ?? getCookie('csrf_token') ?? '';
  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...withDefaultHeaders({
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      })
    },
    body: JSON.stringify(body)
  });
  const json = await parseJson(response);
  return unwrapResponse<TResult>(json, response.ok);
}
