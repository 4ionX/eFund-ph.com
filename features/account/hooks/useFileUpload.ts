import { supabaseClient } from '@/core/api/supabaseClient';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

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
  // const uriToBlob = async (uri: string) => {
  //   // ✅ WEB (Safari / Chrome)
  //   if (typeof window !== 'undefined') {
  //     const res = await fetch(uri);
  //     const blob = await res.blob();

  //     if (!blob || blob.size === 0) {
  //       throw new Error('Web upload failed: empty blob');
  //     }

  //     return blob;
  //   }

  //   // ✅ MOBILE (Expo)
  //   const res = await fetch(uri);
  //   return await res.blob();
  // };

  const uploadFile = async (uri: string, path: string) => {
    let finalUri = uri;

    // ✅ compress only on mobile
    if (Platform.OS !== 'web') {
      finalUri = await compressImage(uri);
    }

    const response = await fetch(finalUri);

    // =========================
    // WEB
    // =========================
    if (Platform.OS === 'web') {
      const blob = await response.blob();

      const { data, error } = await supabaseClient.storage
        .from('documents')
        .upload(path, blob, {
          contentType: blob.type || 'image/jpeg',
          upsert: true,
        });

      console.log('WEB UPLOAD:', data);

      if (error) {
        console.log('WEB ERROR:', error);
        throw new Error(error.message);
      }

      return path;
    }

    // =========================
    // MOBILE
    // =========================
    const arrayBuffer = await response.arrayBuffer();

    const { data, error } = await supabaseClient.storage
      .from('documents')
      .upload(path, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    console.log('MOBILE UPLOAD:', data);

    if (error) {
      console.log('MOBILE ERROR:', error);
      throw new Error(error.message);
    }

    return path;
  };

  const uploadDocumentImage = async (
    uri: string,
    userId: string,
    folder: 'id' | 'business',
  ) => {
    const path = `${folder}/${userId}.jpg`;
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
