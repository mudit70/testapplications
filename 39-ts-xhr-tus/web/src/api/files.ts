import * as tus from "tus-js-client";

/** Creates a file through the resources API, with upload progress (XMLHttpRequest). */
export function postResources(url: string, content: Blob, onProgress: (loaded: number) => void) {
  return new Promise<string>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `/api/resources${url}?override=false`, true);
    request.upload.onprogress = (e) => onProgress(e.loaded);
    request.onload = () => (request.status === 200 ? resolve(request.responseText) : reject(request.status));
    request.onerror = () => reject(new Error("no connection"));
    request.send(content);
  });
}

/** Sends a large file in chunks over tus: creates the upload, then patches its bytes. */
export function uploadTus(path: string, file: Blob) {
  return new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `/api/tus${path}`,
      chunkSize: 10 * 1024 * 1024,
      onError: reject,
      onSuccess: () => resolve(),
    });
    upload.start();
  });
}

/** Shares a file; the URL is rebuilt from the file's path before the request. */
export async function createShare(url: string, expires = "") {
  url = url.replace(/^\/files/, "");
  url = `/api/share${url}`;
  if (expires !== "") url += `?expires=${expires}&unit=hours`;
  const res = await fetch(url, { method: "POST", body: "{}" });
  return res.json();
}
