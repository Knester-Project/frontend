import { useState } from "react";
import axios from "axios";

// Services
import { requestPresignedUrls } from "@/services/api.services";

type UploadItem = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  publicUrl?: string;
  key?: string;
};

type BackendUploadItem = {
  fileName: string;
  uploadUrl: string;
  fields: Record<string, string>;
  publicUrl: string;
  key: string;
};

export function usePresignedUpload() {

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: File[], kind: "profile" | "chat" | "post") {
    try {
      setError(null);
      setUploading(true);

      // Initialize upload state
      const items: UploadItem[] = files.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));
      setUploads(items);

      const mediaFiles = files.map((f) => ({ fileName: f.name, contentType: f.type }));

      // Get Presigned Urls
      const res = await requestPresignedUrls(kind, mediaFiles);

      const presignedList: BackendUploadItem[] = res.data;

      // Upload each file
      await Promise.all(
        presignedList.map((item, index) =>
          uploadSingleFile(item, files[index], index)
        )
      );

      return presignedList;
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      throw err;
    } finally {
      setUploading(false);
    }
  }

  async function uploadSingleFile(presigned: BackendUploadItem, file: File, index: number) {

    const formData = new FormData();

    Object.entries(presigned.fields).forEach(([k, v]) =>
      formData.append(k, v)
    );

    formData.append("file", file);

    console.log("The file type", file.type)
    console.log("The presigned", presigned)

    setUploads((prev) =>
      prev.map((u, i) =>
        i === index ? { ...u, status: "uploading" } : u
      )
    );

    await axios.post(presigned.uploadUrl, formData, {
      onUploadProgress: (e) => {
        if (!e.total) return;
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploads((prev) =>
          prev.map((u, i) =>
            i === index ? { ...u, progress: percent } : u
          )
        );
      },
    });

    setUploads((prev) =>
      prev.map((u, i) =>
        i === index
          ? {
            ...u,
            status: "success",
            publicUrl: presigned.publicUrl,
            key: presigned.key,
          }
          : u
      )
    );
  }

  // Make sure all the uploads has a status of success
  const requiredKeys: (keyof UploadItem)[] = [
    'file',
    'progress',
    'status',
    'publicUrl',
    'key',
  ];

  const hasKeys = (obj: UploadItem, keys: (keyof UploadItem)[]) => keys.every((k) => obj[k] != null);
  const allSuccessful = uploads.every((u) => hasKeys(u, requiredKeys) && u.status === 'success');


  return { uploadFiles, uploads, allSuccessful, uploading, error };
}
