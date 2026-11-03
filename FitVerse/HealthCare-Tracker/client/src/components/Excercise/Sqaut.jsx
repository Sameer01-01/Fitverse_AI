import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Link } from 'react-router-dom';
import squat from "../../assets/squat.gif";

const Squats = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [loadingState, setLoadingState] = useState('initial');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedback, setFeedback] = useState('Stand in front of the camera to begin');
  const [showManualMode, setShowManualMode] = useState(false);
  const [detector, setDetector] = useState(null);

  // Heart rate tracking state
  const [heartRate, setHeartRate] = useState(72);
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const heartRateIntervalRef = useRef(null);
  const lastExerciseCountRef = useRef(0);

  const countingStateRef = useRef('standing');
  const confidenceThresholdRef = useRef(0.25);
  const frameCountRef = useRef(0);
  const squatDepthRef = useRef(0);
  const lastRepTimeRef = useRef(0);

  // Simulate heart rate based on exercise intensity
  useEffect(() => {
    if (isTracking) {
      if (heartRateIntervalRef.current) {
        clearInterval(heartRateIntervalRef.current);
      }

      heartRateIntervalRef.current = setInterval(() => {
        const exerciseIntensity = exerciseCount - lastExerciseCountRef.current;
        lastExerciseCountRef.current = exerciseCount;

        let newRate = heartRate;
        if (exerciseIntensity > 0) {
          newRate = Math.min(175, heartRate + (exerciseIntensity * 3));
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

  // Load MoveNet Model
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
        console.error('Error loading MoveNet model:', error);
        if (isMounted) {
          setErrorMessage(`Model loading error: ${error.message}. You can continue with manual counting.`);
          setShowManualMode(true);
        }
      }
    };
    loadModels();
    return () => { isMounted = false; };
  }, []);

  // Setup camera
  useEffect(() => {
    let stream = null;
    let isMounted = true;

    const setupCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Browser camera access is not supported. Please use Chrome, Edge, or Firefox.');
        setShowManualMode(true);
        return;
      }
      try {
        setLoadingState('camera');
        setLoadingProgress(60);

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
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
          if (videoRef.current.readyState >= 2) {
            handleReady();
          }
        }
      } catch (error) {
        console.error('Camera access error:', error);
        if (isMounted) {
          if (error.name === 'NotAllowedError') {
            setErrorMessage('Camera access was denied. Please allow camera permissions in your browser and reload.');
          } else {
            setErrorMessage(`Camera error: ${error.message}. You can use manual mode.`);
          }
          setShowManualMode(true);
        }
      }
    };

    setupCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Set ready and auto-start tracking
  useEffect(() => {
    if (isWebcamReady && detector && loadingState !== 'ready') {
      setLoadingState('ready');
      setLoadingProgress(100);
      setIsTracking(true);
    }
  }, [isWebcamReady, detector, loadingState]);

  // Main Detection Loop
  useEffect(() => {
    if (!detector || !isWebcamReady || !canvasRef.current) return;

    let animationFrameId;

    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        frameCountRef.current += 1;

        // Render video onto canvas continuously
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
              setFeedback('No body detected. Step back so your hips & legs are in view.');
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

  const calculateAngle = (p1, p2, p3) => {
    if (!p1 || !p2 || !p3) return 180;
    const radians = Math.atan2(p3[1] - p2[1], p3[0] - p2[0]) - Math.atan2(p1[1] - p2[1], p1[0] - p2[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    return angle;
  };

  const processExercise = (pose) => {
    if (!pose || !pose.keypoints) return;
    countSquats(pose);
  };

  const countSquats = (pose) => {
    const findKeypoint = (name) => pose.keypoints.find(kp => kp.name === name);

    const leftHip = findKeypoint('left_hip');
    const rightHip = findKeypoint('right_hip');
    const leftKnee = findKeypoint('left_knee');
    const rightKnee = findKeypoint('right_knee');
    const leftAnkle = findKeypoint('left_ankle');
    const rightAnkle = findKeypoint('right_ankle');

    let leftKneeAngle = 180;
    let rightKneeAngle = 180;

    if (leftHip && leftKnee && leftAnkle && leftHip.score > 0.25 && leftKnee.score > 0.25 && leftAnkle.score > 0.25) {
      leftKneeAngle = calculateAngle([leftHip.x, leftHip.y], [leftKnee.x, leftKnee.y], [leftAnkle.x, leftAnkle.y]);
    }

    if (rightHip && rightKnee && rightAnkle && rightHip.score > 0.25 && rightKnee.score > 0.25 && rightAnkle.score > 0.25) {
      rightKneeAngle = calculateAngle([rightHip.x, rightHip.y], [rightKnee.x, rightKnee.y], [rightAnkle.x, rightAnkle.y]);
    }

    let kneeAngle = null;
    if (leftKneeAngle < 179 && rightKneeAngle < 179) {
      kneeAngle = Math.min(leftKneeAngle, rightKneeAngle);
    } else if (leftKneeAngle < 179) {
      kneeAngle = leftKneeAngle;
    } else if (rightKneeAngle < 179) {
      kneeAngle = rightKneeAngle;
    } else if (leftHip && rightHip && leftKnee && rightKnee) {
      // Fallback if ankles are below frame
      const hipY = (leftHip.y + rightHip.y) / 2;
      const kneeY = (leftKnee.y + rightKnee.y) / 2;
      const verticalGap = kneeY - hipY;
      kneeAngle = verticalGap < 60 ? 100 : verticalGap > 110 ? 170 : 135;
    }

    if (!kneeAngle) {
      setFeedback('Position camera so your hips and knees are visible');
      return;
    }

    // Depth: 170° = 0%, 95° = 100%
    squatDepthRef.current = Math.max(0, Math.min(100, Math.round(((170 - kneeAngle) / 75) * 100)));

    const standingThreshold = 155;
    const squatThreshold = 115;
    const currentTime = Date.now();

    if (countingStateRef.current === 'standing' && kneeAngle < squatThreshold) {
      countingStateRef.current = 'squatting';
      setFeedback('Great depth! Now push up through your heels');
    } else if (countingStateRef.current === 'squatting' && kneeAngle > standingThreshold) {
      if (currentTime - lastRepTimeRef.current > 600) {
        countingStateRef.current = 'standing';
        setExerciseCount(prev => prev + 1);
        lastRepTimeRef.current = currentTime;
        setFeedback('Squat completed! Awesome rep!');
      }
    }
  };

  const drawPose = (ctx, pose, width, height) => {
    if (!pose.keypoints) return;

    drawLowerBodyConnections(ctx, pose.keypoints);

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

    // Draw HUD
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, 170, 70);
    ctx.strokeStyle = '#3b82f6';
    ctx.strokeRect(10, 10, 170, 70);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`State: ${countingStateRef.current.toUpperCase()}`, 20, 35);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`Squats: ${exerciseCount}`, 20, 62);
  };

  const drawLowerBodyConnections = (ctx, keypoints) => {
    const connections = [
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];

    const keypointMap = {};
    keypoints.forEach(kp => {
      if (kp.name) keypointMap[kp.name] = kp;
    });

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
    countingStateRef.current = 'standing';
    setHeartRate(72);
    setHeartRateHistory([]);
  };

  const handleManualCount = () => {
    setExerciseCount(prev => prev + 1);
    setFeedback('Squat counted manually!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
          <Link
            to="/exercisecard"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors text-sm font-semibold border border-gray-700"
          >
            ← Back to Live Exercises
          </Link>
          <span className="text-xs px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50">
            AI Pose Detection Enabled
          </span>
        </div>

        <div className="mb-4 p-3 bg-blue-950/70 border border-blue-500/30 rounded-xl text-blue-200 text-sm text-center">
          <strong>Tip:</strong> Position camera around waist or hip height, 6–8 feet away so your hips, knees, and ankles are in the frame.
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-6">
          AI Squats Tracker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700/60">
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-gray-200">Your Workout</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/70 rounded-lg p-3 text-center border border-gray-600/50">
                  <p className="text-xs text-gray-400 mb-1">Exercise</p>
                  <p className="text-lg font-bold text-blue-400">Squats</p>
                </div>
                <div className="bg-gray-700/70 rounded-lg p-3 text-center border border-gray-600/50">
                  <p className="text-xs text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-black text-teal-400">{exerciseCount}</p>
                </div>
              </div>
            </div>

            {/* Heart Rate Monitor Section */}
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
              {/* Heart rate history */}
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

            {/* Action Buttons */}
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
                    + Count Squat Manually
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-700">
              <img src={squat} alt="Squat Demo" className="w-full object-cover" />
            </div>
          </div>

          {/* Camera & Detection View */}
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

                {/* Loading State Overlay */}
                {loadingState !== 'ready' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30 p-6">
                    <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-white text-base font-semibold mb-3">
                      {loadingState === 'models' ? 'Loading MoveNet AI Pose Engine...' : 'Connecting to Camera...'}
                    </p>
                    <div className="w-64 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Error State Overlay */}
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

                {/* Live Overlays */}
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

                    {/* Depth Gauge */}
                    <div className="absolute top-20 right-4 z-20">
                      <div className="bg-black/70 backdrop-blur-md p-2 rounded-xl border border-gray-700 text-center text-xs">
                        <span className="text-gray-400 block mb-1">Depth</span>
                        <div className="w-4 h-24 bg-gray-800 rounded-full mx-auto relative overflow-hidden border border-gray-600">
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-blue-500 rounded-b-full transition-all duration-150"
                            style={{ height: `${squatDepthRef.current}%` }}
                          />
                        </div>
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

              {/* Goal Progress */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Workout Goal</span>
                  <span>{exerciseCount} / 15 Reps ({Math.round(Math.min(100, (exerciseCount / 15) * 100))}%)</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (exerciseCount / 15) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Form Tips */}
              <div className="mt-5 p-4 rounded-xl bg-gray-750 bg-gray-700/40 border border-gray-700 text-xs text-gray-300 space-y-1.5">
                <p className="font-bold text-gray-200 text-sm mb-1">Squat Form Guidance</p>
                <p>• Keep feet slightly wider than shoulder-width, toes slightly out.</p>
                <p>• Hinge at your hips and bend knees until thighs are roughly parallel to the ground.</p>
                <p>• Keep your chest lifted and push back up through your heels.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squats;
