import React, { useMemo, useState } from "react";

interface PreviewImageProp {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  text?: string;
}

const PreviewImage: React.FC<PreviewImageProp> = ({
  src,
  alt = "",

  className,
  text,
}) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const defaultImg = "/assets/img/no_img.jpg";
  const [hasError, setHasError] = useState(false);
  const finalSrc = useMemo(() => {
    if (hasError) return defaultImg;
    if (!src) return defaultImg;

    // local blob preview
    if (src.startsWith("blob:")) return src;

    // backend relative upload path
    if (src.startsWith("uploads")) {
      console.log("src", src);
      return `${BASE_URL}/${src}`;
    }

    return src;
  }, [src, hasError]);

  return (
    <div className="flex items-center w-full h-full gap-3 relative">
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        className={`object-cover size-10 rounded-sm ${className || ""}`}
        onError={() => setHasError(true)}
      />

      {text && <span className="font-medium text-sm truncate">{text}</span>}
    </div>
  );
};

export default PreviewImage;