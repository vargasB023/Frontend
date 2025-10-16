import React, { useState, useEffect, useRef } from 'react';
import "../../Components/Public/css/Vision.css";

const EXERCISES = [
  {
    id: 'sentadilla',
    name: 'Sentadilla',
    keyPointsGuide: ['Rodillas alineadas', 'Espalda recta', 'Cadera hacia atrás'],
    validate: (lm) => {
      const lHip = lm[23], rHip = lm[24], lKnee = lm[25], rKnee = lm[26];
      const depth = ((lHip.y + rHip.y) / 2) - ((lKnee.y + rKnee.y) / 2);
      return depth > 0.1;
    },
  },
  {
    id: 'flexion',
    name: 'Flexión',
    keyPointsGuide: ['Cuerpo recto', 'Pecho al suelo', 'Codos cerca'],
    validate: (lm) => {
      const lShoulder = lm[11], rShoulder = lm[12], lElbow = lm[13], rElbow = lm[14], lHip = lm[23], rHip = lm[24];
      const straight = Math.abs((lShoulder.y + rShoulder.y) / 2 - (lHip.y + rHip.y) / 2) < 0.05;
      const low = (lShoulder.y + rShoulder.y) / 2 > (lElbow.y + rElbow.y) / 2;
      return straight && low;
    },
  },
  {
    id: 'estocada',
    name: 'Estocada',
    keyPointsGuide: ['Rodilla a 90°', 'Espalda recta', 'Peso en el talón'],
    validate: (lm) => {
      const lHip = lm[23], rHip = lm[24], lKnee = lm[25], rKnee = lm[26];
      const hipKnee = Math.abs(lHip.y - lKnee.y) < 0.1 || Math.abs(rHip.y - rKnee.y) < 0.1;
      return hipKnee;
    },
  },
];

const ExerciseChecker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const [exercise, setExercise] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [feedback, setFeedback] = useState('Selecciona un ejercicio para comenzar');
  const [repsGoal, setRepsGoal] = useState(10);
  const [repsCount, setRepsCount] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef(null);

  /** Cargar Vision y modelo */
  useEffect(() => {
    async function loadVision() {
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) return resolve();
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

      // ✅ Cargar Vision Tasks
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js');

      // ✅ Resolver archivos del modelo
      const vision = await window.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      // ✅ Cargar el modelo PoseLandmarker
      poseRef.current = await window.PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });
    }

    loadVision();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /** Dibuja los landmarks */
  const drawResults = (ctx, landmarks, width, height) => {
    ctx.fillStyle = 'cyan';
    landmarks.forEach((lm) => {
      ctx.beginPath();
      ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  /** Procesar frame de video */
  const processFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !poseRef.current) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const now = performance.now();
    const result = await poseRef.current.detectForVideo(video, now);

    if (result.landmarks && result.landmarks.length > 0) {
      const lm = result.landmarks[0];
      drawResults(ctx, lm, canvas.width, canvas.height);

      if (isTraining && exercise) {
        const ok = exercise.validate(lm);
        if (ok) {
          setRepsCount((c) => {
            const next = c + 1;
            if (next >= repsGoal) stopTraining();
            return next;
          });
          setFeedback('✅ ¡Buena forma!');
        } else {
          setFeedback('❗ Mejora tu postura');
        }
      }
    }

    if (isTraining) requestAnimationFrame(processFrame);
  };

  /** Iniciar entrenamiento */
  const startTraining = async () => {
    if (!exercise) {
      setFeedback('⚠️ Selecciona un ejercicio primero');
      return;
    }

    setRepsCount(0);
    setSecondsElapsed(0);
    setFeedback('🏋️‍♂️ Entrenando...');
    setIsTraining(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    videoRef.current.onloadeddata = () => {
      processFrame();
    };

    intervalRef.current = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
  };

  /** Detener entrenamiento */
  const stopTraining = () => {
    setIsTraining(false);
    setFeedback('⏹ Entrenamiento detenido');
    clearInterval(intervalRef.current);
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">Verificador de Ejercicios</h2>
        <p className="text-muted">Usando MediaPipe Tasks (Vision)</p>
      </div>

      <div className="row g-4">
        {/* Cámara */}
        <div className="col-lg-8">
          <div className="border border-primary rounded overflow-hidden position-relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-100" />
            <canvas ref={canvasRef} className="position-absolute top-0 start-0 w-100 h-100" />
          </div>

          <div className="mt-3 text-center">
            <p className="fs-5 fw-semibold text-primary">{feedback}</p>
            <p className="mb-1">
              <strong>Tiempo:</strong>{' '}
              {`${String(Math.floor(secondsElapsed / 60)).padStart(2, '0')}:${String(
                secondsElapsed % 60
              ).padStart(2, '0')}`}
            </p>
            <p>
              <strong>Repeticiones:</strong> {repsCount} / {repsGoal}
            </p>

            <div className="d-flex justify-content-center gap-2 mt-2">
              <button className="btn btn-primary" onClick={startTraining} disabled={isTraining}>
                Iniciar
              </button>
              <button className="btn btn-outline-primary" onClick={stopTraining} disabled={!isTraining}>
                Detener
              </button>
            </div>
          </div>
        </div>

        {/* Configuración lateral */}
        <div className="col-lg-4">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white fw-semibold">Configuración</div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Ejercicio:</label>
                <select
                  className="form-select"
                  value={exercise?.id || ''}
                  disabled={isTraining}
                  onChange={(e) =>
                    setExercise(EXERCISES.find((ex) => ex.id === e.target.value) || null)
                  }
                >
                  <option value="">-- Selecciona --</option>
                  {EXERCISES.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Repeticiones objetivo:</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  disabled={isTraining}
                  value={repsGoal}
                  onChange={(e) =>
                    setRepsGoal(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>
            </div>
          </div>

          {exercise && (
            <div className="card mt-4 border-secondary">
              <div className="card-header bg-secondary text-white">
                Guía para {exercise.name}
              </div>
              <ul className="list-group list-group-flush">
                {exercise.keyPointsGuide.map((kp, i) => (
                  <li key={i} className="list-group-item">
                    ✅ {kp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseChecker;