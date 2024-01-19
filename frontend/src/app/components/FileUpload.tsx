import axios from 'axios';
import React, { useState } from 'react';

type props = {
  setChurnRate: React.Dispatch<
    React.SetStateAction<
      [
        {
          year: string;
          months: {
            [key: string]: number;
          };
        },
      ]
    >
  >;
};
function FileUpload({ setChurnRate }: props) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();

      formData.append('file', selectedFile);

      try {
        const response = await axios.post(
          'http://localhost:3001/api/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('File uploaded:', selectedFile);
        console.log('Server response:', response.data);

        setChurnRate(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div>
      <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
