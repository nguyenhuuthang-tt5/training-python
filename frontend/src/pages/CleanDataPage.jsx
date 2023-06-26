import { useState, useCallback, useEffect } from "react";
import { Button, ProgressBar } from 'react-bootstrap';
import axios from "axios";
import InputFile from '../components/InputFile';
import { API_ROOT } from "../config";


const APP_STATE = {
    IDLE: 0,
    READY: 1,
    UPLOADING: 2,
    PROCESSING: 3,
    DONE: 4,
    ERROR: 5,
};
  
function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

const CleanDataPage = () => {
    const [keywordFile, setKeywordFile] = useState('')
    const [dataFile, setDataFile] = useState('');
    const [progress, setProgress] = useState(0);
    const [resultFile, setResultFile] = useState(null);
    const [errorContent, setErrorContent] = useState('');
    const [appState, setAppState] = useState(APP_STATE.IDLE);
    const handleSubmit = useCallback(async () => {
      setAppState(APP_STATE.UPLOADING);
      try {
        const data = {
          dataFile: dataFile,
          keywordFile: keywordFile,
        };
  
        let formData = getFormData(data);
  
        const result = await axios.post(`${API_ROOT}/upload/`, formData,
          {
            onUploadProgress: (progressEvent) => {
              const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
              if (totalLength !== null) {
                const percent = Math.round(progressEvent.loaded / totalLength * 100)
                setProgress(percent);
                if (percent >= 100) {
                  setAppState(APP_STATE.PROCESSING);
                }
              }
            },
            onDownloadProgress: (progressEvent) => {
              const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
              if (totalLength !== null) {
                const percent = Math.round((progressEvent.loaded * 50) / totalLength) + 50
                setProgress(percent);
              }
            },
          }
        )
        if (result) {
          if(result.data.path) {
            setAppState(APP_STATE.DONE);
            setResultFile(result.data.path);
          }
          else {
            setAppState(APP_STATE.ERROR)
            if(result.data.code === 400) {
              setErrorContent("Wrong type files or data, please choose another files !")
            }
          }
        }
        setProgress(0);
      }
      catch (error) {
        setAppState(APP_STATE.ERROR)
        if(error.code === "ERR_BAD_RESPONSE") {
          setErrorContent("An error occurred during processing, please try again or choose another files")
        }
      }
  
    }, [dataFile, keywordFile]);
  
    const handleDownload = useCallback(() => {
      document.location.href = `${API_ROOT}/download/?path=${resultFile}`;
    }, [resultFile]);
  
    useEffect(() => {
      if (keywordFile && dataFile) {
        setAppState(APP_STATE.READY);
      } else {
        setAppState(APP_STATE.IDLE);
      }
    }, [dataFile, keywordFile]);
  
    return (
      <div className="app-wraper text-center">
   
        <div className="file-wraper m-auto position-relative">
          <div className="d-flex justify-content-between">
            <InputFile id="data_src" label="Data file" setFile={setDataFile} file={dataFile} />
            <InputFile id="keyword_src" label="Keyword file" setFile={setKeywordFile} file={keywordFile} />
          </div>
          {appState === APP_STATE.IDLE &&
            <>
              <p className="mt-5 fs-5 text-success">Select 2 files to start</p>
            </>
          }
          {appState === APP_STATE.READY &&
            <Button
              size="lg"
              className="mt-5"
              variant="success"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          }
  
          {appState === APP_STATE.UPLOADING &&
            <>
              <ProgressBar variant="success" className="position-absolute w-100" style={{ bottom: 0 }} now={progress} />
              <p className="mt-5 fs-5 text-success">Uploading</p>
            </>
          }
  
          {appState === APP_STATE.PROCESSING &&
            <>
              <ProgressBar animated striped variant="success" className="position-absolute w-100" style={{ bottom: 0 }} now={100} />
              <p className="mt-5 fs-5 text-success">Processing</p>
            </>
          }
  
          {appState === APP_STATE.DONE &&
            <Button
              size="lg"
              className="mt-5"
              variant="success"
              onClick={handleDownload}
            >
              Download
            </Button>
          }

          {appState === APP_STATE.ERROR &&
            <>
              <>
                <p className="mt-5 fs-5 text-danger">{errorContent}</p>
              </>
            </>
          }
        </div>
      </div>
    );
}

export default CleanDataPage