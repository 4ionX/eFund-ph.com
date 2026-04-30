import { supabaseClient } from '@/core/api/supabaseClient';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy'; // ✅ FIX
import { decode } from 'base64-arraybuffer';

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

  const uploadSignatureFile = async (
    uri: string,
    userId: string,
    loanContractId: string,
  ) => {
    const compressedUri = await compressImage(uri);

    const filePath = `${userId}/${loanContractId}.jpg`;

    const base64 = await FileSystem.readAsStringAsync(compressedUri, {
      encoding: 'base64',
    });

    const fileBuffer = decode(base64);

    const { error } = await supabaseClient.storage
      .from('signatures')
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw new Error(error.message);

    return filePath;
  };

  const getSignedUrl = async (filePath: string) => {
    const { data, error } = await supabaseClient.storage
      .from('documents')
      .createSignedUrl(filePath, 60 * 10);

    if (error) throw new Error(error.message);

    return data.signedUrl;
  };

  return {
    uploadSignatureFile,
    getSignedUrl,
  };
};
