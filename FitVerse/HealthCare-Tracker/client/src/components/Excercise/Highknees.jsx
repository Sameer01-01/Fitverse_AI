import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Link } from 'react-router-dom';

const Highknees = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [loadingState, setLoadingState] = useState('initial');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedback, setFeedback] = useState('Stand in camera view to begin high knees');
  const [showManualMode, setShowManualMode] = useState(false);
  const [detector, setDetector] = useState(null);

  const [heartRate, setHeartRate] = useState(72);
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const heartRateIntervalRef = useRef(null);
  const lastExerciseCountRef = useRef(0);

  const countingStateRef = useRef('down'); // 'down' -> 'up' (knee lifted)
  const confidenceThresholdRef = useRef(0.25);
  const frameCountRef = useRef(0);
  const lastRepTimeRef = useRef(0);

  useEffect(() => {
    if (isTracking) {
      if (heartRateIntervalRef.current) clearInterval(heartRateIntervalRef.current);
      heartRateIntervalRef.current = setInterval(() => {
        const exerciseIntensity = exerciseCount - lastExerciseCountRef.current;
        lastExerciseCountRef.current = exerciseCount;

        let newRate = heartRate;
        if (exerciseIntensity > 0) {
          newRate = Math.min(185, heartRate + (exerciseIntensity * 3.5));
        } else {
          newRate = Math.max(72, heartRate - 0.5);
        }
        newRate += (Math.random() * 4 - 2);

        setHeartRate(Math.round(newRate));
        setHeartRateHistory(prev => {
          const newHistory = [...prev, { rate: Math.round(newRate), time: new Date() }];
          return newHistory.slice(-20);
        });
      }, 2000);

      return () => {
        if (heartRateIntervalRef.current) clearInterval(heartRateIntervalRef.current);
      };
    } else {
      if (heartRateIntervalRef.current) clearInterval(heartRateIntervalRef.current);
      const returnToResting = setInterval(() => {
        setHeartRate(prev => {
          if (prev <= 72) {
            clearInterval(returnToResting);
            return 72;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(returnToResting);
    }
  }, [isTracking, exerciseCount, heartRate]);

  const getHeartRateZone = () => {
    if (heartRate < 100) return 'Resting';
    if (heartRate < 120) return 'Warm Up';
    if (heartRate < 140) return 'Fat Burning';
    if (heartRate < 160) return 'Aerobic';
    return 'Peak';
  };

  const getZoneColor = () => {
    if (heartRate < 100) return 'text-gray-400';
    if (heartRate < 120) return 'text-blue-400';
    if (heartRate < 140) return 'text-green-400';
    if (heartRate < 160) return 'text-yellow-400';
    return 'text-red-400';
  };

  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      try {
        setLoadingState('models');
        setLoadingProgress(15);
        await tf.ready();
        if (!isMounted) return;
        setLoadingProgress(35);

        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true
        };
        const det = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );
        if (!isMounted) return;
        setDetector(det);
        setLoadingProgress(50);
      } catch (error) {
        console.error('Error loading MoveNet:', error);
        if (isMounted) {
          setErrorMessage(`Model loading error: ${error.message}`);
          setShowManualMode(true);
        }
      }
    };
    loadModels();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let stream = null;
    let isMounted = true;

    const setupCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Browser camera access not supported.');
        setShowManualMode(true);
        return;
      }
      try {
        setLoadingState('camera');
        setLoadingProgress(60);

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });

        if (!isMounted) return;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const handleReady = () => {
            if (!videoRef.current) return;
            videoRef.current.play().catch(e => console.log('Autoplay handled:', e));
            setIsWebcamReady(true);
            setLoadingProgress(90);
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth || 640;
              canvasRef.current.height = videoRef.current.videoHeight || 480;
            }
          };

          videoRef.current.onloadedmetadata = handleReady;
          videoRef.current.onloadeddata = handleReady;
          if (videoRef.current.readyState >= 2) handleReady();
        }
      } catch (error) {
        console.error('Camera error:', error);
        if (isMounted) {
          setErrorMessage(`Camera error: ${error.message}`);
          setShowManualMode(true);
        }
      }
    };

    setupCamera();

    return () => {
      isMounted = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  useEffect(() => {
    if (isWebcamReady && detector && loadingState !== 'ready') {
      setLoadingState('ready');
      setLoadingProgress(100);
      setIsTracking(true);
    }
  }, [isWebcamReady, detector, loadingState]);

  useEffect(() => {
    if (!detector || !isWebcamReady || !canvasRef.current) return;

    let animationFrameId;

    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        frameCountRef.current += 1;
        const ctx = canvasRef.current.getContext('2d');
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        if (videoRef.current.readyState >= 2) {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(videoRef.current, 0, 0, width, height);

          if (isTracking) {
            const poses = await detector.estimatePoses(videoRef.current);
            if (poses && poses.length > 0) {
              const pose = poses[0];
              processExercise(pose);
              drawPose(ctx, pose, width, height);
            } else {
              setFeedback('No pose detected. Position your legs in frame.');
            }
          }
        }
      } catch (error) {
        console.error('Pose estimation error:', error);
      }

      animationFrameId = requestAnimationFrame(detectPose);
    };

    detectPose();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isTracking, detector, isWebcamReady]);

  const processExercise = (pose) => {
    if (!pose || !pose.keypoints) return;
    countHighKnees(pose);
  };

  const countHighKnees = (pose) => {
    const findKeypoint = (name) => pose.keypoints.find(kp => kp.name === name);

    const leftHip = findKeypoint('left_hip');
    const rightHip = findKeypoint('right_hip');
    const leftKnee = findKeypoint('left_knee');
    const rightKnee = findKeypoint('right_knee');

    if (!leftHip || !rightHip || !leftKnee || !rightKnee) {
      setFeedback('Ensure hips and knees are in camera view');
      return;
    }

    const hipY = (leftHip.y + rightHip.y) / 2;
    const leftDist = leftKnee.y - hipY;
    const rightDist = rightKnee.y - hipY;

    // A high knee lifts towards hip level (small distance < 50px)
    const minKneeDist = Math.min(leftDist, rightDist);
    const liftedThreshold = 65;   // Knee high
    const standingThreshold = 110; // Knee lowered
    const currentTime = Date.now();

    if (countingStateRef.current === 'down' && minKneeDist < liftedThreshold) {
      countingStateRef.current = 'up';
      setFeedback('Knee high! Drive down and switch');
    } else if (countingStateRef.current === 'up' && minKneeDist > standingThreshold) {
      if (currentTime - lastRepTimeRef.current > 400) {
        countingStateRef.current = 'down';
        setExerciseCount(prev => prev + 1);
        lastRepTimeRef.current = currentTime;
        setFeedback('Great high knee! Keep the tempo!');
      }
    }
  };

  const drawPose = (ctx, pose, width, height) => {
    if (!pose.keypoints) return;

    drawLegConnections(ctx, pose.keypoints);

    pose.keypoints.forEach(keypoint => {
      if (keypoint.name && (keypoint.name.includes('hip') || keypoint.name.includes('knee') || keypoint.name.includes('ankle'))) {
        if (keypoint.score > confidenceThresholdRef.current) {
          const { x, y } = keypoint;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          if (keypoint.name.includes('hip')) ctx.fillStyle = '#ef4444';
          else if (keypoint.name.includes('knee')) ctx.fillStyle = '#22c55e';
          else ctx.fillStyle = '#eab308';
          ctx.fill();
        }
      }
    });

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, 190, 70);
    ctx.strokeStyle = '#3b82f6';
    ctx.strokeRect(10, 10, 190, 70);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`State: ${countingStateRef.current.toUpperCase()}`, 20, 35);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`High Knees: ${exerciseCount}`, 20, 62);
  };

  const drawLegConnections = (ctx, keypoints) => {
    const connections = [
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];

    const keypointMap = {};
    keypoints.forEach(kp => { if (kp.name) keypointMap[kp.name] = kp; });

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;

    connections.forEach(([start, end]) => {
      const p1 = keypointMap[start];
      const p2 = keypointMap[end];
      if (p1 && p2 && p1.score > confidenceThresholdRef.current && p2.score > confidenceThresholdRef.current) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    setFeedback(isTracking ? 'Tracking paused' : 'Tracking started');
  };

  const resetStats = () => {
    setExerciseCount(0);
    setFeedback('Counter reset');
    countingStateRef.current = 'down';
    setHeartRate(72);
    setHeartRateHistory([]);
  };

  const handleManualCount = () => {
    setExerciseCount(prev => prev + 1);
    setFeedback('High knee counted manually!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
          <Link
            to="/exercisecard"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors text-sm font-semibold border border-gray-700"
          >
            ← Back to Live Exercises
          </Link>
          <span className="text-xs px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50">
            High Knees Cardio AI
          </span>
        </div>

        <div className="mb-4 p-3 bg-blue-950/70 border border-blue-500/30 rounded-xl text-blue-200 text-sm text-center">
          <strong>Tip:</strong> Position camera showing hips and legs. Drive your knees up alternately toward your chest.
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-6">
          AI High Knees Tracker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700/60">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-gray-200">Your Workout</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/70 rounded-lg p-3 text-center border border-gray-600/50">
                  <p className="text-xs text-gray-400 mb-1">Exercise</p>
                  <p className="text-lg font-bold text-blue-400">High Knees</p>
                </div>
                <div className="bg-gray-700/70 rounded-lg p-3 text-center border border-gray-600/50">
                  <p className="text-xs text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-black text-teal-400">{exerciseCount}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 bg-gray-700/40 rounded-lg p-4 border border-gray-600/50">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-2">Heart Rate Monitor</h2>
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-bold" style={{ color: heartRate > 140 ? '#ef4444' : heartRate > 120 ? '#f59e0b' : '#3b82f6' }}>
                  {heartRate} <span className="text-xs text-gray-400">BPM</span>
                </div>
                <div className={`text-sm font-semibold ${getZoneColor()}`}>
                  {getHeartRateZone()}
                </div>
              </div>
              <div className="h-2 bg-gray-600 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500" 
                  style={{ width: `${Math.min(100, Math.max(10, (heartRate - 60) / 1.2))}%` }}
                />
              </div>
              <div className="h-12 flex items-end gap-1 mt-3">
                {heartRateHistory.map((entry, index) => (
                  <div key={index} className="flex-1 bg-gray-700 h-full flex items-end rounded-t-sm overflow-hidden">
                    <div 
                      className="w-full bg-blue-500"
                      style={{ 
                        height: `${Math.min(100, Math.max(15, ((entry.rate - 60) / 120) * 100))}%`,
                        backgroundColor: entry.rate > 140 ? '#ef4444' : entry.rate > 120 ? '#f59e0b' : '#3b82f6'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3">Controls</h2>
              <div className="flex flex-col gap-3">
                <button
                  onClick={toggleTracking}
                  className={`${
                    isTracking ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
                  } py-3 px-4 rounded-xl font-bold transition-all shadow-md`}
                  disabled={loadingState !== 'ready'}
                >
                  {isTracking ? 'Pause Tracking' : 'Start Tracking'}
                </button>
                <button
                  onClick={resetStats}
                  className="bg-gray-700 hover:bg-gray-600 py-2.5 px-4 rounded-xl font-semibold transition-colors border border-gray-600 text-sm"
                >
                  Reset Counter
                </button>
                {showManualMode && (
                  <button
                    onClick={handleManualCount}
                    className="bg-blue-600 hover:bg-blue-500 py-2.5 px-4 rounded-xl font-semibold transition-colors text-sm"
                  >
                    + Count High Knee Manually
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700/60">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-700">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover hidden"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />

                {loadingState !== 'ready' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30 p-6">
                    <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-white text-base font-semibold mb-3">Loading Pose Engine...</p>
                    <div className="w-64 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 p-6 text-center">
                    <p className="text-red-400 font-bold mb-3">{errorMessage}</p>
                    <button
                      onClick={() => { setErrorMessage(''); setShowManualMode(true); }}
                      className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      Use Manual Counter
                    </button>
                  </div>
                )}

                {loadingState === 'ready' && (
                  <>
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isTracking ? 'bg-green-600/90 text-white' : 'bg-yellow-600/90 text-white'}`}>
                        {isTracking ? '● Tracking Active' : '❚❚ Tracking Paused'}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gray-700 text-center">
                        <span className="text-2xl font-black text-teal-400">{exerciseCount}</span>
                        <span className="text-xs text-gray-300 ml-1.5">Reps</span>
                      </div>
                    </div>

                    {feedback && (
                      <div className="absolute bottom-4 left-4 right-4 z-20 text-center">
                        <div className="bg-black/80 backdrop-blur-md border border-gray-700 text-white text-sm px-4 py-2 rounded-xl inline-block max-w-md mx-auto shadow-lg">
                          {feedback}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Cardio Target</span>
                  <span>{exerciseCount} / 30 Reps ({Math.round(Math.min(100, (exerciseCount / 30) * 100))}%)</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (exerciseCount / 30) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-gray-700/40 border border-gray-700 text-xs text-gray-300 space-y-1.5">
                <p className="font-bold text-gray-200 text-sm mb-1">High Knee Technique</p>
                <p>• Land softly on the balls of your feet.</p>
                <p>• Lift knees up towards hip height, pumping opposite arms.</p>
                <p>• Keep core tight and avoid leaning backward.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Highknees;
