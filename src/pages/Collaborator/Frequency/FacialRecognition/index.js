/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import * as faceapi from 'face-api.js';

import Loading from '../../../../components/Loading';

function Index() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const infoDetection = React.useRef();

  const videoRef = React.useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = React.useRef();

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${process.env.REACT_APP_BASE_PUBLIC}/models`;

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    };
    loadModels();
  }, []);

  const loadLabels = async () => {
    const labels = ['Mykael Mello', 'Maria Rafaela'];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 5; i++) {
          const img = await faceapi.fetchImage(
            `${process.env.REACT_APP_BASE_PUBLIC}/labels/${label}/${i}.jpg`
          );
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

  const startVideo = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      if (Array.isArray(devices)) {
        devices.forEach((device) => {
          if (device.kind === 'videoinput') {
            if (!device.label.includes('Virtual')) {
              setCaptureVideo(true);
              // ver uma melhor forma de calibrar isso aqui quando tiver 2 câmeras
              navigator.getUserMedia(
                {
                  video: {
                    deviceId: device.deviceId,
                  },
                },
                // eslint-disable-next-line no-return-assign
                (stream) => {
                  const video = videoRef.current;
                  video.srcObject = stream;
                  video.play();
                },
                (err) => {
                  console.error('error:', err);
                }
              );
            }
          }
        });
      }
    });
  };

  const handleVideoOnPlay = async () => {
    const labels = await loadLabels();
    const displaySize = {
      width: videoWidth,
      height: videoHeight,
    };

    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptors();

        console.log(detections);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        // match the face descriptors of the detected faces from our input image to our reference data
        // 0.6 is a good distance threshold value to judge
        // whether the descriptors match or not
        const maxDescriptorDistance = 0.6;

        const faceMatcher = new faceapi.FaceMatcher(
          labels,
          maxDescriptorDistance
        );
        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        );

        infoDetection.current = results;

        // fazer o esquema do registro do funcionário
        console.log(
          infoDetection.current,
          infoDetection.current[0]?.label,
          infoDetection.current[0]?.distance
        );

        if (
          infoDetection.current[0]?.label !== 'unknown' &&
          infoDetection.current[0]?.distance < 0.3
        )
          alert(`Detectou ${infoDetection.current[0]?.label}`);

        canvasRef &&
          canvasRef.current &&
          canvasRef.current
            .getContext('2d')
            .clearRect(0, 0, videoWidth, videoHeight);

        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections
          );

        canvasRef &&
          canvasRef.current &&
          resizedDetections.forEach((detection) => {
            const { age, gender, genderProbability } = detection;
            new faceapi.draw.DrawTextField(
              [
                `${parseInt(age, 10)} years`,
                `${gender} (${parseInt(genderProbability * 100, 10)})`,
              ],
              detection.detection.box.topRight
            ).draw(canvasRef.current);
          });

        // problema--->

        canvasRef &&
          canvasRef.current &&
          results.forEach((result, index) => {
            const { box } = resizedDetections[index].detection;
            const { label, distance } = result;
            new faceapi.draw.DrawTextField(
              [`${label} (${parseInt(distance * 100, 10)})`],
              box.bottomRight
            ).draw(canvasRef.current);
          });

        // problema
      }
    }, 100);
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    canvasRef.current = '';
    infoDetection.current = '';
    setCaptureVideo(false);
    window.location.reload(true);
  };

  function saveFile(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    }
  }

  const capturePicture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const contex = canvas.getContext('2d');
    contex.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    // videoRef.current.player.srcObject.getVideoTracks().forEach((track) => {
    //   track.stop();
    // });

    canvas.toBlob((blob) => {
      console.log(blob);
      // storage.push(blob);
      saveFile(blob, infoDetection.current[0]?.label || 'image.jpg');
    });

    console.log(canvas.toDataURL());
    // this.setState({ imageDataURL: canvas.toDataURL() });
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <div>Reconhecimento Facial</div>
        {/* <video autoPlay id="cam" width="720" height="560" muted /> */}

        <div style={{ textAlign: 'center', padding: '10px' }}>
          {captureVideo && modelsLoaded ? (
            <Button onClick={closeWebcam}>Close Webcam</Button>
          ) : (
            <Button onClick={startVideo}>Open Webcam</Button>
          )}
        </div>
        {captureVideo ? (
          modelsLoaded ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '10px',
                }}
              >
                <video
                  ref={videoRef}
                  height={videoHeight}
                  width={videoWidth}
                  onPlay={handleVideoOnPlay}
                  style={{ borderRadius: '10px' }}
                />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
            </div>
          ) : (
            <div>loading...</div>
          )
        ) : null}
        <Button onClick={capturePicture}>Capture Picture</Button>
      </Container>
    </>
  );
}

export default Index;
