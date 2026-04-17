interface Headers {
  [key: string]: string;
}

interface Params {
  [key: string]: any;
}

const defaultContentType: Headers = {
  "Content-Type": "application/json; charset=utf-8",
};

export const fetcher =
  (method: string) =>
  async (
    _url: string,
    body: any,
    params: Params = {},
    _headers: Headers = {},
    options: Record<string, any> = {},
  ): Promise<any> => {
    const headers: Headers = { ...defaultContentType, ..._headers };

    const qs = buildQueryString(params);
    const url = qs.length === 0 ? _url : `${_url}?${qs}`;

    const reqOpts = {
      method: method || "POST",
      headers,
      body:
        method !== "GET" && body !== undefined
          ? JSON.stringify(body)
          : undefined,
    };
    const response = await fetch(url, { ...reqOpts, ...options });

    if (response.status === 204) {
      return undefined;
    }

    const contentType = response.headers.get("content-type") || "";
    const hasJson = contentType.includes("application/json");
    const payload = hasJson
      ? await response.json().catch(() => null)
      : undefined;

    if (!response.ok) {
      const errorMessage =
        typeof (payload as { error?: unknown } | null)?.error === "string"
          ? (payload as { error: string }).error || "Request failed"
          : `Request failed (${response.status})`;

      throw new Error(errorMessage);
    }

    return payload;
  };

export const GET = (url: string, params?: Params, headers?: Headers) =>
  fetcher("GET")(url, undefined, params, headers);
export const PUT = fetcher("PUT");
export const PATCH = fetcher("PATCH");
export const POST = fetcher("POST");
export const DELETE = (url: string, params?: Params, headers?: Headers) =>
  fetcher("DELETE")(url, undefined, params, headers);

function buildQueryStringForObject(key: string, object: Params): string {
  return Object.entries(object)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) =>
        `${encodeURIComponent(key)}[${encodeURIComponent(k)}]=${encodeURIComponent(String(v))}`,
    )
    .join("&");
}

function buildQueryString(params: Params): string {
  return Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) =>
      typeof params[k] === "object"
        ? buildQueryStringForObject(k, params[k])
        : `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]))}`,
    )
    .join("&");
}
