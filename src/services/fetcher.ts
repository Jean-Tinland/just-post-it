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

    try {
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

      if ((response.ok && response.status === 204) || response.status === 500)
        return undefined;

      const resJSON = await response.json();
      if (response.ok === false) return Promise.reject(resJSON.error);
      return resJSON;
    } catch (err) {
      throw err;
    }
  };

export const GET = (url: string, params?: Params, headers?: Headers) =>
  fetcher("GET")(url, undefined, params, headers);
export const PUT = fetcher("PUT");
export const POST = fetcher("POST");
export const DELETE = (url: string, params?: Params, headers?: Headers) =>
  fetcher("DELETE")(url, undefined, params, headers);

function buildQueryStringForObject(key: string, object: Params): string {
  return Object.entries(object)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${key}[${k}]=${encodeURIComponent(v)}`)
    .join("&");
}

function buildQueryString(params: Params): string {
  return Object.keys(params)
    .filter((k) => !!params[k])
    .map((k) =>
      typeof params[k] === "object"
        ? buildQueryStringForObject(k, params[k])
        : `${k}=${encodeURIComponent(params[k])}`,
    )
    .join("&");
}
