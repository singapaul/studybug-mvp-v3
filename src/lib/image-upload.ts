/**
 * Image upload utilities
 * For development, converts images to base64 data URLs
 * In production, would upload to server/cloud storage
 */

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validate image file
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be less than 5MB';
  }

  return null;
}

/**
 * Convert file to base64 data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image file
 * In development: converts to base64
 * In production: would upload to server
 */
export async function uploadImage(file: File): Promise<UploadedImage> {
  // Validate file
  const error = validateImageFile(file);
  if (error) {
    throw new Error(error);
  }

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Convert to base64 for mock storage
  const dataURL = await fileToDataURL(file);

  return {
    url: dataURL,
    name: file.name,
    size: file.size,
  };
}

/**
 * Delete image
 * In production: would delete from server
 */
export async function deleteImage(url: string): Promise<void> {
  // For base64, nothing to delete
  // In production, would make DELETE request to server
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Resize image if too large (optional enhancement)
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        file.type,
        0.9
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
