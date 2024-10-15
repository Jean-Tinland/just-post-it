export function remove(name: string) {
  document.cookie = `${name}= ; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function set(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires= + ${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value ?? ""}${expires}; path=/;`;
}

export function get(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (typeof parts === "object" && parts.length === 2) {
    const part = parts.pop();
    if (part) {
      return part.split(";").shift();
    }
  }
}
