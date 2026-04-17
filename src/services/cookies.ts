export function remove(name: string) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secureSuffix = secure ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/; SameSite=Strict${secureSuffix}`;
}

export function set(name: string, value: string, days: number) {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.trunc(days) : 0;
  let expires = "";
  if (safeDays) {
    const date = new Date();
    date.setTime(date.getTime() + safeDays * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secureSuffix = secure ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value ?? "")}${expires}; Path=/; SameSite=Strict${secureSuffix}`;
}

export function get(name: string) {
  const key = encodeURIComponent(name);
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) {
      const rawValue = part.split(";").shift();
      if (!rawValue) {
        return undefined;
      }

      try {
        return decodeURIComponent(rawValue);
      } catch {
        return rawValue;
      }
    }
  }

  return undefined;
}
