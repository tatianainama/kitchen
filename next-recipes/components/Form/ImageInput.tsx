import { FC } from 'react';
import iconClear from '@/components/Icons/clear.svg';
import defaultImage from '@/components/Icons/chicken.svg';

const PreviewImage: FC<{ image: string | File | null }> = ({ image }) => {
  const getPreview = (data: string | File) =>
    typeof data === 'string' ? data : URL.createObjectURL(data);
  return image ? (
    <img src={getPreview(image)} className="w-full h-full object-cover" />
  ) : (
    <img
      src={defaultImage.src}
      className="w-1/2 h-full object-center opacity-30 mx-auto"
    />
  );
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
    <div className="relative w-full h-full bg-grey-50">
      <PreviewImage image={value} />
      {value ? (
        <button
          className="absolute bottom-2 right-2 p-2 bg-white bg-opacity-40 rounded-full hover:bg-opacity-70"
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
            className="w-px h-px opacity-0 overflow-hidden absolute -z-10 peer"
            onChange={update}
          />
          <label
            htmlFor="recipe-image"
            className="absolute bottom-2 right-2 p-2 bg-white bg-opacity-30 rounded-full hover:bg-opacity-70 cursor-pointer peer-focus:bg-opacity-50"
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
