import { supabaseClient } from '@/core/api/supabaseClient';
import * as ImageManipulator from 'expo-image-manipulator';

export type UploadItem = {
  uri: string;
  field: 'id_url' | 'business_document_url';
};

export const useFileUpload = () => {
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

  // 🔥 SAFE FOR WEB + MOBILE
  const uriToBlob = async (uri: string) => {
    const res = await fetch(uri);
    return await res.blob();
  };

  const uploadFile = async (uri: string, path: string) => {
    const compressedUri = await compressImage(uri);
    const blob = await uriToBlob(compressedUri);

    const { error } = await supabaseClient.storage
      .from('documents') // ✅ FIXED BUCKET
      .upload(path, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw new Error(error.message);

    return path;
  };

  // =========================
  // ID / BUSINESS UPLOAD
  // =========================
  const uploadDocumentImage = async (
    uri: string,
    userId: string,
    folder: 'id' | 'business',
  ) => {
    const path = `${folder}/${userId}.jpg`; // ✅ folder structure
    return uploadFile(uri, path);
  };

  const getSignedUrl = async (path: string) => {
    const { data, error } = await supabaseClient.storage
      .from('documents')
      .createSignedUrl(path, 60 * 10);

    if (error) throw new Error(error.message);

    return data.signedUrl;
  };

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

      onProgress?.(Math.round(((i + 1) / items.length) * 100));
    }

    return results;
  };

  return {
    uploadBatchDocuments,
    getSignedUrl,
  };
};
