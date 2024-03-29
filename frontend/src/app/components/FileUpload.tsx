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

  setMrr: React.Dispatch<
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

  setYears: React.Dispatch<React.SetStateAction<never[]>>;

  setSelectedYears: React.Dispatch<React.SetStateAction<never[]>>;
};
function FileUpload({
  setChurnRate,
  setMrr,
  setYears,
  setSelectedYears,
}: props) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();

      formData.append('file', selectedFile);

      console.log('url');
      const url = process.env.NEXT_PUBLIC_API
        ? `${process.env.NEXT_PUBLIC_API}/api/upload`
        : 'http://localhost:3001/api/upload';
      console.log(url);
      try {
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('File uploaded:', selectedFile);
        console.log('Server response:', response.data);

        setChurnRate(response.data.churn_tax);
        setMrr(response.data.mrr);
        setYears(response.data.years);
        setSelectedYears(response.data.years);
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
