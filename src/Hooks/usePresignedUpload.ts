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

  async function uploadFiles(files: File[], kind: "profile" | "chat" | "post"): Promise<BackendUploadItem[]> {

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

      const mediaFiles = files.map((f) => ({
        fileName: f.name,
        contentType: f.type,
      }));

      // Get presigned URLs
      const res = await requestPresignedUrls(kind, mediaFiles);
      const presignedList: BackendUploadItem[] = res.data;

      // Optional safety: match files by name (prevents wrong pairing)
      const fileMap = new Map(files.map((f) => [f.name, f]));

      const results = await Promise.allSettled(
        presignedList.map((item, index) => {
          const file = fileMap.get(item.fileName) || files[index];

          if (!file) {
            return Promise.reject(new Error("File mismatch"));
          }

          return uploadSingleFile(item, file, index);
        })
      );

      // Detect any failure
      const hasFailure = results.some((r) => r.status === "rejected");

      if (hasFailure) {
        throw new Error("One or more uploads failed");
      }

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
    try {
      const formData = new FormData();

      Object.entries(presigned.fields).forEach(([k, v]) =>
        formData.append(k, v)
      );

      formData.append("file", file);

      // Mark as uploading
      setUploads((prev) => prev.map((u, i) =>
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

      // Mark success
      setUploads((prev) => prev.map((u, i) => i === index ? {
        ...u,
        status: "success",
        publicUrl: presigned.publicUrl,
        key: presigned.key,
      }
        : u
      )
      );
    } catch (err) {
      setUploads((prev) => prev.map((u, i) =>
        i === index ? { ...u, status: "error" } : u
      ));
      throw err;
    }
  }

  // Simplified success check (ONLY for UI display, not logic decisions)
  const allSuccessful = uploads.length > 0 && uploads.every((u) => u.status === "success");

  return {
    uploadFiles,
    uploads,
    uploading,
    error,
    allSuccessful,
  };
} 