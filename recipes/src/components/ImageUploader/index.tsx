import React, { useState, useRef, useEffect } from 'react';

import Button from 'components/Button';

import './styles.scss';
import sample_image from 'sample.png';

const API: string = process.env.REACT_APP_API || '';

type ImageUploaderProps = {
  initialValue?: string;
  onChange?: (file: string | ArrayBuffer | null) => void;
};

export const ImageUploader: React.FunctionComponent<ImageUploaderProps> = ({ initialValue, onChange = () => {} }) => {
  const [ file, setFile ] = useState({
    name: '',
    image: ''
  });

  const isBase64 = (file: string): boolean => file.indexOf('base64') !== -1;

  const fileInput: React.RefObject<HTMLInputElement> = useRef(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        onChange(result)
        setFile({
          image: JSON.stringify(result),
          name: file.name
        });
      }
    }
  }

  useEffect(() => {
    if(initialValue) {
      setFile({
        name: '',
        image: isBase64(initialValue) ? initialValue : `${API}/${initialValue}`
      })
    }
  }, [initialValue])

  return (
    <div className='cbk-img-uploader'>
      <input type='file' onChange={onChangeFile} ref={fileInput} accept="image/*"/>
      {
        file.image ? (
          <div className='cbk-img-uploader__preview'
            style={{
              backgroundImage: `url(${file.image})`
            }}
          >
            <Button
              type='button'
              icon='clear'
              onClick={() => setFile({
                name: '',
                image: ''
              }) }
            />
            <label>{file.name}</label>
          </div>
        ) : (
          <div className='cbk-img-uploader__upload'
            style={{
              backgroundImage: `url(${sample_image})`
            }}
          >
            <Button
              type='button'
              icon='add'
              onClick={() => { fileInput.current && fileInput.current.click() }}
            ></Button>
          </div>
        )
      }
    </div>
  )
};

export default ImageUploader;