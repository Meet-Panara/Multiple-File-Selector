import React, { useState } from 'react';
import './fileSelectorStyle.css';
import fileLogo from '../assets/fileLogo.svg';
import fileFormate from '../assets/fileFormate.svg';
import trace from '../assets/trace.svg';
import axios from 'axios';

const api = 'https://v2.convertapi.com/upload';

function CustomFileSelector() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e) => {
    [...e.target.files].map((file) => {
      if (['image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
        setFiles((prev) => [...prev, { file }]);
        // console.log([{ [file.name.split('.')[0]]: file }]);
      }
    });
  };

  const handleDeletion = (elem, index) => {
    let newVar = [...files];
    newVar.splice(index, 1);
    setFiles(newVar);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    [...e.dataTransfer.files].map((file) => {
      if (['image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
        setFiles((prev) => [...prev, { file }]);
      }
    });
  };

  const postFiles = async (fileData) => {
    // console.log(fileData[0].file.name.split('.')[0]);
    const formData = new FormData();
    // const keys = fileData.map((elem) => elem.file.name.split('.')[0]);

    fileData.map((elem) => {
      const key = elem.file.name.split('.')[0];
      formData.append(key, elem.file);
    });

    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    const config = {
      onUploadProgress: (progressEvent) => {
        const progressPersent = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setProgress(progressPersent);
      },
    };

    // posting data
    const res = await axios.post(api, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(res);
  };

  const handleSubmit = (e) => {
    postFiles(files);
  };

  return (
    <div className='p-5 flex flex-col justify-center h-screen items-center bg-slate-100'>
      <div className='px-6 py-4 flex bg-white flex-col gap-2 rounded-lg shadow-lg'>
        <div className='flex flex-wrap p-4 gap-10'>
          {/* this is file selection section */}
          <div className='flex flex-col'>
            <div className='mb-2 text-lg'>Drop Documents</div>
            <input
              multiple={true}
              type='file'
              id={'fileSelector'}
              className='hidden'
              onChange={handleFileUpload}
            />
            <label
              htmlFor={'fileSelector'}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className='custom-dashed-border flex flex-col justify-center items-center w-[30rem] h-[11rem] font-medium px-5 py-4 rounded'
            >
              <img src={fileLogo} alt='' className='w-12' />
              <div>
                Drag your file(s) or{' '}
                <span className='hover:border-b-2 border-blue-700 cursor-pointer text-blue-700'>
                  browse
                </span>
              </div>
            </label>
            <div className='text-gray-500'>
              Only support .jpg, .png, and PDF files
            </div>

            {/* this is submition button */}
            <div className='mt-14 self-center w-fit gap-0'>
              <div className='flex items-center'>
                <div className='w-full border-b-2 border-lime-800 bg-lime-200 h-3 rounded-t'>
                  <div
                    className='bg-lime-400 h-3 rounded-t border-b-2 border-lime-700'
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <button
                className='w-52  bg-lime-500 font-medium hover:bg-lime-600 p-3 rounded-b text-white'
                onClick={handleSubmit}
              >
                SUbmit
              </button>
            </div>
          </div>

          {/* after file selection this component will get appeared */}
          <div className='flex flex-col gap-5'>
            {files.length > 0 &&
              files.map((elem, index) => {
                return (
                  <div className='' key={elem.file.name + index}>
                    <div className='flex min-w-[20rem] justify-between border gap-3 border-gray-300 rounded px-3 py-1 font-medium'>
                      <div className='flex gap-3'>
                        <div className='flex items-center'>
                          <img src={fileFormate} alt='' />
                        </div>
                        <div className='flex flex-col'>
                          {elem.file.name}
                          <span className='text-gray-500 font-normal'>
                            {elem.file.size} KB
                          </span>
                        </div>
                      </div>
                      <div
                        className='self-center cursor-pointer'
                        onClick={() => {
                          handleDeletion(elem, index);
                        }}
                      >
                        <img src={trace} alt='' />
                      </div>
                    </div>

                    {/* this is sub component of file section */}
                    <div className='flex items-center gap-2'>
                      <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300'>
                        <div
                          className='bg-blue-800 h-2.5 rounded-full'
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span>{progress}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomFileSelector;
