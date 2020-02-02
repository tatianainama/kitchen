import React, { useState, useRef } from 'react';

import Button from 'components/Button';

import './styles.scss';
import sample_image from 'sample.png';

type ImageUploaderProps = {
  onChange?: (file: File) => void;
};

export const ImageUploader: React.FunctionComponent<ImageUploaderProps> = ({ onChange = () => {} }) => {
  const [ file, setFile ] = useState({
    name: '',
    url: ''
  });
  const fileInput: React.RefObject<HTMLInputElement> = useRef(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile({
        url: URL.createObjectURL(e.target.files[0]),
        name: e.target.files[0].name
      });
      onChange(e.target.files[0])
    }
  }

  return (
    <div className='cbk-img-uploader'>
      <input type='file' onChange={onChangeFile} ref={fileInput} accept="image/*"/>
      {
        file.url ? (
          <div className='cbk-img-uploader__preview'
            style={{
              backgroundImage: `url(${file.url})`
            }}
          >
            <Button
            
              type='button'
              icon='clear'
              onClick={() => setFile({
                name: '',
                url: ''
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