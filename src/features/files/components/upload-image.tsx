
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { fileApi } from "../api/file.api";
import PreviewImage from "@/components/common/media/preview-image";

interface UploadImageProps {
  value?: string;
  errorMessage?: string;
  onUpload: (url: string) => void;
  onDelete: () => void;
}

export const UploadImage = ({
  value,
  errorMessage,
  onUpload,
  onDelete,
}: UploadImageProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(value || null);

  const { upload, isPending, error } = useFileUpload({
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  useEffect(() => {
    setPhoto(value || null);
  }, [value]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    upload(file, {
      onSuccess(data) {
        const uploadedUrl = data.data.url;
        setPhoto(uploadedUrl);
        onUpload(uploadedUrl);
      },
    });

    // Allow selecting the same file again.
    event.target.value = "";
  };

  const { mutate, isPending: isDeleting } = useApiMutation(
    fileApi.removeFile,
    {
      onSuccess() {
        toast.success("Category image removed");
        setPhoto(null);
        onDelete();
      },
    },
  );

  const removePhoto = () => {
    if (!photo || isPending || isDeleting) return;

    mutate(photo);
  };

  const busy = isPending || isDeleting;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted">
          {photo ? (
            <PreviewImage
              src={photo}
              alt="Category image preview"
              className="size-full object-cover"
            />
          ) : (
            <Camera className="size-7 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant={"ghost"}
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="w-full border flex items-center  gap-2 h-25 px-3 rounded-lg"
          >
            <Upload className="mr-2 size-4" />
            {isPending ? "Uploading..." : "Choose image"}
          </Button>

          {photo && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={removePhoto}
            >
              <Trash2 className="mr-2 size-4" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {(error || errorMessage) && (
        <p className="text-sm text-destructive">
          {errorMessage || error?.message}
        </p>
      )}
    </div>
  );
};
