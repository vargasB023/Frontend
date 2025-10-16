import React, { useState, useEffect, useRef } from "react";
import "../../Components/Public/css/Vision.css"; // CSS actualizado sin :root

const EXERCISES = [
  {
    id: "sentadilla",
    name: "Sentadilla",
    keyPointsGuide: [
      "Rodillas alineadas",
      "Espalda recta",
      "Cadera hacia atrás",
    ],
    validate: (lm) => {
      const lHip = lm[23],
        rHip = lm[24],
        lKnee = lm[25],
        rKnee = lm[26];
      const depth = (lHip.y + rHip.y) / 2 - (lKnee.y + rKnee.y) / 2;
      return depth > 0.1;
    },
  },
  {
    id: "flexion",
    name: "Flexión",
    keyPointsGuide: ["Cuerpo recto", "Pecho al suelo", "Codos cerca"],
    validate: (lm) => {
      const lShoulder = lm[11],
        rShoulder = lm[12],
        lElbow = lm[13],
        rElbow = lm[14],
        lHip = lm[23],
        rHip = lm[24];
      const straight =
        Math.abs((lShoulder.y + rShoulder.y) / 2 - (lHip.y + rHip.y) / 2) <
        0.05;
      const low = (lShoulder.y + rShoulder.y) / 2 > (lElbow.y + rElbow.y) / 2;
      return straight && low;
    },
  },
  {
    id: "estocada",
    name: "Estocada",
    keyPointsGuide: ["Rodilla a 90°", "Espalda recta", "Peso en el talón"],
    validate: (lm) => {
      const lHip = lm[23],
        rHip = lm[24],
        lKnee = lm[25],
        rKnee = lm[26];
      const hipKnee =
        Math.abs(lHip.y - lKnee.y) < 0.1 || Math.abs(rHip.y - rKnee.y) < 0.1;
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
  const [feedback, setFeedback] = useState(
    "Selecciona un ejercicio para comenzar"
  );
  const [repsGoal, setRepsGoal] = useState(10);
  const [repsCount, setRepsCount] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function loadVision() {
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) return resolve();
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js"
      );

      const vision = await window.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      poseRef.current = await window.PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
    }

    loadVision();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const drawResults = (ctx, landmarks, width, height) => {
    ctx.fillStyle = "cyan";
    landmarks.forEach((lm) => {
      ctx.beginPath();
      ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const processFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !poseRef.current) return;

    const ctx = canvas.getContext("2d");
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
          setFeedback("✅ ¡Buena forma!");
        } else {
          setFeedback("❗ Mejora tu postura");
        }
      }
    }

    if (isTraining) requestAnimationFrame(processFrame);
  };

  const startTraining = async () => {
    if (!exercise) {
      setFeedback("⚠️ Selecciona un ejercicio primero");
      return;
    }

    setRepsCount(0);
    setSecondsElapsed(0);
    setFeedback("🏋️‍♂️ Entrenando...");
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

  const stopTraining = () => {
    setIsTraining(false);
    setFeedback("⏹ Entrenamiento detenido");
    clearInterval(intervalRef.current);
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="vision_contenido">
      <div className="vision_video_contenedor">
        <div className="vision_video_box">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="vision_video"
          />
          <canvas ref={canvasRef} className="vision_canvas" />
        </div>
      </div>

      <div className="vision_panel">
        <div className="vision_card">
          <h3>Configuración</h3>
          <label>Ejercicio:</label>
          <select
            value={exercise?.id || ""}
            disabled={isTraining}
            onChange={(e) =>
              setExercise(
                EXERCISES.find((ex) => ex.id === e.target.value) || null
              )
            }
          >
            <option value="">-- Selecciona --</option>
            {EXERCISES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <label>Repeticiones objetivo:</label>
          <input
            type="number"
            min="1"
            disabled={isTraining}
            value={repsGoal}
            onChange={(e) =>
              setRepsGoal(Math.max(1, parseInt(e.target.value) || 1))
            }
          />
        </div>

        {exercise && (
          <div className="vision_card guia">
            <h3>Guía para {exercise.name}</h3>
            <ul>
              {exercise.keyPointsGuide.map((kp, i) => (
                <li key={i}>✅ {kp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ⬇️ MOVIDO AQUÍ */}
        <div className="vision_info">
          <p className="vision_feedback">{feedback}</p>
          <p>
            <strong>Tiempo:</strong>{" "}
            {`${String(Math.floor(secondsElapsed / 60)).padStart(
              2,
              "0"
            )}:${String(secondsElapsed % 60).padStart(2, "0")}`}
          </p>
          <p>
            <strong>Repeticiones:</strong> {repsCount} / {repsGoal}
          </p>

          <div className="vision_botones">
            <button
              className="vision_boton iniciar"
              onClick={startTraining}
              disabled={isTraining}
            >
              Iniciar
            </button>
            <button
              className="vision_boton detener"
              onClick={stopTraining}
              disabled={!isTraining}
            >
              Detener
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseChecker;
