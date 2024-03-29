/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import * as faceapi from 'face-api.js';

import ConfirmModal from './components/ConfirmModal';

import axios from '../../../../services/axios';
import Loading from '../../../../components/Loading';

function Index() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);
  const [workers, setWorkers] = React.useState([]);
  const [workerModal, setWorkerModal] = React.useState({});

  const infoDetection = React.useRef();

  const videoRef = React.useRef();
  const videoHeight = 360;
  const videoWidth = 480;
  const canvasRef = React.useRef();

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (worker) => {
    setWorkerModal(worker);
    setShowModal(true);
  };

  React.useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        const MODEL_URL = `${process.env.REACT_APP_BASE_PUBLIC}/models`;

        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]).then(setModelsLoaded(true));

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    loadModels();

    const getWorkersData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/workers/');
        setWorkers(response.data);
        setIsLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-unused-expressions
        err.response?.data?.errors
          ? err.response.data.errors.map((error) => toast.error(error)) // errors -> resposta de erro enviada do backend (precisa se conectar com o back)
          : toast.error(err.message); // e.message -> erro formulado no front (é criado pelo front, não precisa de conexão)
        setIsLoading(false);
      }
    };
    getWorkersData();
  }, []);

  const loadLabels = async () => {
    try {
      setIsLoading(true);

      // const response = await axios.get('/workers/');
      // setWorkers(response.data);

      // depois pode colocar um filtro aqui dos colaboradores ativos e dos que tem foto para melhorar o desempenho
      const labels = workers
        .filter((item) => item.filenamePhoto)
        .map((worker) => ({
          id: worker.id,
          name: worker.name,
          urlPhoto: worker.urlPhoto,
        }));

      setIsLoading(false);

      const arrayDetections = await Promise.all(
        labels.map(async (label) => {
          // se for trabalhar com varias fotos da mesma pessoa para melhorar reconhecimento, tem que fazer um loop e detections vira um array
          const img = await faceapi.fetchImage(label.urlPhoto);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          return {
            label: `${label.id} ${label.name.split(' ')[0]}`,
            detections,
          };
        })
      );

      console.log('arrayDetections', arrayDetections);

      const validArrayDetections = arrayDetections.filter(
        // se for trabalhar com varias fotos da mesma pessoa, tem q tirar as fotos que nao atendem (nao tem rostos), tanto do array da mesma pessoa como entre diferentes pessoas
        (item) => item.detections
      );

      console.log('validArrayDetections', validArrayDetections);

      const analysisArray = await Promise.all(
        validArrayDetections.map(async (item) => {
          // se for trabalhar com varios arrays tem que colocar os varios 'detections'
          const descriptions = [];

          descriptions.push(item.detections.descriptor);

          return new faceapi.LabeledFaceDescriptors(item.label, descriptions);
        })
      );

      return analysisArray;
    } catch (err) {}
    console.log(err);
    setIsLoading(false);
  };

  const startVideo = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      if (Array.isArray(devices)) {
        devices.every((device) => {
          if (
            device.kind === 'videoinput' &&
            !device.label.includes('Virtual')
          ) {
            const supports = navigator.mediaDevices.getSupportedConstraints();
            console.log(supports);
            console.log(device);
            setCaptureVideo(true);
            // ver uma melhor forma de calibrar isso aqui quando tiver 2 câmeras
            navigator.getUserMedia(
              {
                video: {
                  deviceId: device.deviceId,
                  facingMode: {
                    ideal: 'user',
                  },
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
            return false;
          }
          return true;
        });
      }
    });
  };

  const closeWebcam = async () => {
    try {
      setIsLoading(true);
      canvasRef.current = '';
      infoDetection.current = '';
      setCaptureVideo(false);
      await videoRef.current.pause();
      await videoRef.current.srcObject.getTracks().forEach(async (track) => {
        await track.stop();
        await videoRef.current.srcObject.removeTrack(track);
      });
      // window.location.reload(true);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleVideoOnPlay = async () => {
    try {
      setIsLoading(true);
      const labels = await loadLabels();
      setIsLoading(false);
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

          // console.log(detections);

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

          // REGISTRAR FUNCIONARIO fazer o esquema do registro do funcionário
          // console.log(
          //   infoDetection.current,
          //   infoDetection.current[0]?.label,
          //   infoDetection.current[0]?.distance
          // );

          if (
            infoDetection.current[0]?.label !== 'unknown' &&
            infoDetection.current[0]?.distance < 0.5
          ) {
            // alert(
            //   ` Confirma registro do colaborador ${infoDetection.current[0]?.label}?`
            // );
            // toast.success(
            //   ` Colaborador ${infoDetection.current[0]?.label} localizado com Sucesso! `
            // );
            console.log(workers);
            console.log('id', infoDetection.current[0]?.label.split(' ')[0]);
            console.log(
              'worker',
              workers.find(
                ({ id }) =>
                  id === Number(infoDetection.current[0]?.label.split(' ')[0])
              )
            );
            handleShowModal(
              workers.find(
                ({ id }) =>
                  id === Number(infoDetection.current[0]?.label.split(' ')[0])
              )
            );
            console.log('Rodar função para registrar frequência');
            closeWebcam();
          }

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
            faceapi.draw.drawFaceLandmarks(
              canvasRef.current,
              resizedDetections
            );

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
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
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

  const toggleCamera = async () => {
    console.log(videoRef.current.facingMode);
    if (videoRef.current.facingMode === 'environment') {
      videoRef.current.facingMode = 'user';
    } else {
      videoRef.current.facingMode = 'environment';
    }
    try {
      if (videoRef.current.srcObject) {
        /* On some android devices, it is necessary to stop the previous track */
        // closeWebcam();
      }
      // startVideo();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <Container>
        <ConfirmModal // modal p/ pesquisa de materiais
          handleClose={handleCloseModal}
          show={showModal}
          worker={workerModal}
        />
        <Row className="d-flex justify-content-center">
          <Col xs="auto">
            {captureVideo && modelsLoaded ? (
              <Button variant="warning" onClick={closeWebcam}>
                Finalizar Reconhecimento
              </Button>
            ) : (
              <Button variant="success" onClick={startVideo}>
                Iniciar Reconhecimento
              </Button>
            )}
          </Col>
        </Row>
        {captureVideo ? (
          modelsLoaded ? (
            <>
              <Row>
                <Col>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '10px',
                    }}
                  >
                    <video
                      className="border bg-light"
                      ref={videoRef}
                      height={videoHeight}
                      width={videoWidth}
                      onPlay={handleVideoOnPlay}
                      style={{ borderRadius: '10px' }}
                      muted
                    />
                    <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                  </div>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center">
                <Col xs="auto">
                  <Button onClick={capturePicture}>Capture Picture</Button>
                </Col>
                <Col xs="auto">
                  <Button onClick={toggleCamera}>Toggle Camera</Button>
                </Col>
              </Row>
            </>
          ) : (
            <div>loading...</div>
          )
        ) : null}
      </Container>
    </>
  );
}

export default Index;
