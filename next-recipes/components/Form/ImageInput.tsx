import { FC } from 'react';
import iconClear from '@/components/Icons/clear.svg';

const PreviewImage: FC<{ image: string | File | null }> = ({ image }) => {
  const getPreview = (data: string | File) =>
    typeof data === 'string' ? data : URL.createObjectURL(data);
  return image ? (
    <img src={getPreview(image)} className="w-full h-full object-cover" />
  ) : null;
};

type ImageType = string | File | null;
type ImageInputProps = {
  value: ImageType;
  onChange: (image: ImageType) => void;
};

const ImageInput: FC<ImageInputProps> = ({ value, onChange }) => {
  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="relative w-full h-full">
      <PreviewImage image={value} />
      {value ? (
        <button
          className="absolute bottom-2 right-2 p-2 bg-primary bg-opacity-30 rounded-full hover:bg-opacity-80"
          type="button"
          onClick={() => onChange('')}
        >
          <img src={iconClear.src} width={20} height={20} className="" />
        </button>
      ) : (
        <>
          <input
            type="file"
            id="recipe-image"
            name="recipe-image"
            accept="image/*"
            className="w-px h-px opacity-0 overflow-hidden absolute -z-10"
            onChange={update}
          />
          <label
            htmlFor="recipe-image"
            className="absolute bottom-2 right-2 p-2 bg-primary bg-opacity-30 rounded-full hover:bg-opacity-80 cursor-pointer"
          >
            <img
              src={iconClear.src}
              width={20}
              height={20}
              className="rotate-45"
            />
          </label>
        </>
      )}
    </div>
  );
};

export default ImageInput;
