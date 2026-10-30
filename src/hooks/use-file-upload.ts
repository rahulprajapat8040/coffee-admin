import { fileApi } from "@/features/files/api/file.api";
import { useApiMutation } from "@/hooks/use-api-mutation";

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  endpoint?: string;
}

interface UploadFileVariables {
  file: File;
  endpoint: string;
}

export const useFileUpload = ({
  maxSize = DEFAULT_MAX_SIZE,
  allowedTypes = ["image/jpeg", "image/png"],
  endpoint = "/files/upload-media-file",
}: FileUploadOptions = {}) => {
  const mutation = useApiMutation(({ file, endpoint }: UploadFileVariables) => {
    return fileApi.uploadFile({ file, endpoint });
  });

  const upload = (
    file: File,
    options?: Parameters<typeof mutation.mutate>[1],
  ) => {
    // Type validation
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
    }

    // Size validation
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }

    mutation.mutate(
      {
        file,
        endpoint,
      },
      options,
    );
  };

  return {
    ...mutation,
    upload,
  };
};