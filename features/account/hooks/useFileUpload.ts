import { supabaseClient } from '@/core/api/supabaseClient';
import * as ImageManipulator from 'expo-image-manipulator';
import { File } from 'expo-file-system';

export type UploadItem = {
  uri: string;
  field: 'id_url' | 'business_document_url';
};

export const useFileUpload = () => {
  // =========================
  // COMPRESS IMAGE
  // =========================
  const compressImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1280 } }],
      {
        compress: 0.6,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    return result.uri;
  };

  // =========================
  // GENERIC UPLOAD
  // =========================
  const uploadFile = async (
    uri: string,
    bucket: 'documents' | 'signatures',
    path: string,
  ) => {
    const compressedUri = await compressImage(uri);

    const file = new File(compressedUri);
    const buffer = await file.arrayBuffer();

    const { error } = await supabaseClient.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw new Error(error.message);

    // ✅ ALWAYS return PATH only
    return path;
  };

  // =========================
  // DOCUMENT UPLOAD
  // =========================
  const uploadDocumentImage = async (
    uri: string,
    userId: string,
    folder: 'id' | 'business',
  ) => {
    const path = `${folder}/${userId}.jpg`;
    return uploadFile(uri, 'documents', path);
  };

  // =========================
  // GET SIGNED URL (UNIFIED)
  // =========================
  const getSignedUrl = async (bucket: string, path: string) => {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 10); // 10 mins

    if (error) throw new Error(error.message);

    return data.signedUrl;
  };

  // =========================
  // BATCH DOCUMENT UPLOAD
  // =========================
  const uploadBatchDocuments = async (
    items: UploadItem[],
    userId: string,
    onProgress?: (p: number) => void,
  ) => {
    const results: Record<string, string> = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const path = await uploadDocumentImage(
        item.uri,
        userId,
        item.field === 'id_url' ? 'id' : 'business',
      );

      results[item.field] = path;

      if (onProgress) {
        onProgress(Math.round(((i + 1) / items.length) * 100));
      }
    }

    return results;
  };

  return {
    uploadBatchDocuments,
    getSignedUrl,
  };
};
