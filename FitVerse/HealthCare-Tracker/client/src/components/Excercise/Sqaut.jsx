import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Link } from 'react-router-dom';
import squat from "../../assets/squat.gif"

const Squats = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [loadingState, setLoadingState] = useState('initial');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showManualMode, setShowManualMode] = useState(false);
  const [detector, setDetector] = useState(null);

  // Heart rate tracking state
  const [heartRate, setHeartRate] = useState(72); // Initial resting heart rate
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const heartRateIntervalRef = useRef(null);
  const lastExerciseCountRef = useRef(0);

  const poseHistoryRef = useRef([]);
  const countingStateRef = useRef('standing');
  const confidenceThresholdRef = useRef(0.3);
  const frameCountRef = useRef(0);
  
  // Squat-specific tracking refs
  const lastValidHipPositionRef = useRef(null);
  const squatDepthRef = useRef(0);
  const repPhaseTimerRef = useRef(null);
  const isAtBottomRef = useRef(false);

  // Simulate heart rate based on exercise intensity
  useEffect(() => {
    if (isTracking) {
      // Clear any existing interval
      if (heartRateIntervalRef.current) {
        clearInterval(heartRateIntervalRef.current);
      }

      // Start new interval to update heart rate
      heartRateIntervalRef.current = setInterval(() => {
        // Base heart rate increase based on exercise count
        const exerciseIntensity = exerciseCount - lastExerciseCountRef.current;
        lastExerciseCountRef.current = exerciseCount;

        // Calculate new heart rate
        let newRate = heartRate;
        
        if (exerciseIntensity > 0) {
          // Increase heart rate based on recent exercise
          newRate = Math.min(180, heartRate + (exerciseIntensity * 2)); // Squats are less intense than pull-ups
        } else {
          // Gradually decrease heart rate when not exercising
          newRate = Math.max(72, heartRate - 0.5);
        }

        // Add some random variation to make it more realistic
        newRate += (Math.random() * 4 - 2);

        setHeartRate(Math.round(newRate));
        
        // Update heart rate history (keep last 20 readings)
        setHeartRateHistory(prev => {
          const newHistory = [...prev, { rate: Math.round(newRate), time: new Date() }];
          return newHistory.slice(-20);
        });
      }, 2000); // Update every 2 seconds

      return () => {
        if (heartRateIntervalRef.current) {
          clearInterval(heartRateIntervalRef.current);
        }
      };
    } else {
      // When not tracking, gradually return to resting heart rate
      if (heartRateIntervalRef.current) {
        clearInterval(heartRateIntervalRef.current);
      }

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
  }, [isTracking, exerciseCount]);

  // Calculate heart rate zone
  const getHeartRateZone = () => {
    if (heartRate < 100) return 'Resting';
    if (heartRate < 120) return 'Warm Up';
    if (heartRate < 140) return 'Fat Burning';
    if (heartRate < 160) return 'Aerobic';
    return 'Peak';
  };

  // Get heart rate zone color
  const getZoneColor = () => {
    if (heartRate < 100) return 'text-gray-400';
    if (heartRate < 120) return 'text-blue-400';
    if (heartRate < 140) return 'text-green-400';
    if (heartRate < 160) return 'text-yellow-400';
    return 'text-red-400';
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingState('models');
        setLoadingProgress(10);
        await tf.ready();
        setLoadingProgress(30);
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true
        };
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet, 
          detectorConfig
        );
        setDetector(detector);
        setLoadingProgress(40);
      } catch (error) {
        console.error('Error loading models:', error);
        setErrorMessage(`Failed to load pose detection: ${error.message}. Try using manual mode.`);
        setShowManualMode(true);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const setupCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Browser does not support camera access. Try using Chrome or Firefox.');
        return;
      }
      try {
        setLoadingState('camera');
        setLoadingProgress(50);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsWebcamReady(true);
            setLoadingProgress(80);
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          };
        }
      } catch (error) {
        console.error('Camera access error:', error);
        if (error.name === 'NotAllowedError') {
          setErrorMessage('Camera access denied. Please allow camera access and reload the page.');
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('No camera found. Please connect a camera and reload the page.');
        } else {
          setErrorMessage(`Camera error: ${error.message}. Try using manual mode instead.`);
          setShowManualMode(true);
        }
      }
    };
    setupCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isWebcamReady && detector && loadingState !== 'ready') {
      setLoadingState('ready');
      setLoadingProgress(100);
    }
  }, [isWebcamReady, detector, loadingState]);

  useEffect(() => {
    if (!isTracking || !detector || !isWebcamReady || !canvasRef.current) return;
    let animationFrameId;
    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      try {
        frameCountRef.current += 1;
        if (frameCountRef.current % 2 !== 0) {
          animationFrameId = requestAnimationFrame(detectPose);
          return;
        }
        const poses = await detector.estimatePoses(videoRef.current);
        if (poses && poses.length > 0) {
          const pose = poses[0];
          processExercise(pose);
          drawPose(pose);
        } else {
          setFeedback('No pose detected. Position camera to view at least your hips and knees.');
        }
      } catch (error) {
        console.error('Pose detection error:', error);
      }
      animationFrameId = requestAnimationFrame(detectPose);
    };
    detectPose();
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isTracking, detector, isWebcamReady]);

  const processExercise = (pose) => {
    if (!pose || !pose.keypoints) return;
    poseHistoryRef.current.push(pose);
    if (poseHistoryRef.current.length > 10) {
      poseHistoryRef.current.shift();
    }
    
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
    
    const keypoints = [leftHip, rightHip, leftKnee, rightKnee];
    
    const essentialPointsDetected = keypoints.every(kp => kp && kp.score > confidenceThresholdRef.current);
    
    if (!essentialPointsDetected) {
      setFeedback('Position camera to clearly see your hips and knees');
      return;
    }
    
    const hipY = (leftHip.y + rightHip.y) / 2;
    const hipX = (leftHip.x + rightHip.x) / 2;
    const kneeY = (leftKnee.y + rightKnee.y) / 2;
    
    lastValidHipPositionRef.current = { x: hipX, y: hipY };
    
    let ankleY;
    if (leftAnkle && rightAnkle && 
        leftAnkle.score > confidenceThresholdRef.current && 
        rightAnkle.score > confidenceThresholdRef.current) {
      ankleY = (leftAnkle.y + rightAnkle.y) / 2;
    } else {
      ankleY = canvasRef.current.height * 0.9;
    }
    
    const hipToKneeDistance = Math.abs(hipY - kneeY);
    const kneeToBottomDistance = Math.abs(kneeY - ankleY);
    
    const normalizedHipPosition = (ankleY - hipY) / (ankleY - kneeY);
    
    const standingThreshold = 2.0;
    const squatThreshold = 1.5;
    
    squatDepthRef.current = Math.max(0, Math.min(100, 
      100 * (1 - (normalizedHipPosition - squatThreshold) / (standingThreshold - squatThreshold))
    ));
    
    const standingPosition = normalizedHipPosition > standingThreshold;
    const squatPosition = normalizedHipPosition < squatThreshold;
    
    if (countingStateRef.current === 'standing' && squatPosition && !isAtBottomRef.current) {
      isAtBottomRef.current = true;
      countingStateRef.current = 'squatting';
      setFeedback('Good! Now stand back up');
    } else if (countingStateRef.current === 'squatting' && standingPosition && isAtBottomRef.current) {
      isAtBottomRef.current = false;
      countingStateRef.current = 'standing';
      setExerciseCount(prev => prev + 1);
      setFeedback('Squat completed! Great job!');
    }
  };

  const drawPose = (pose) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(videoRef.current, 0, 0);
    
    if (pose.keypoints) {
      drawLowerBodyConnections(ctx, pose.keypoints);
      
      pose.keypoints.forEach(keypoint => {
        if (keypoint.name && (
            keypoint.name.includes('hip') || 
            keypoint.name.includes('knee') || 
            keypoint.name.includes('ankle'))) {
          if (keypoint.score > confidenceThresholdRef.current) {
            const { x, y } = keypoint;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            if (keypoint.name && keypoint.name.includes('hip')) {
              ctx.fillStyle = '#ff0000';
            } else if (keypoint.name && keypoint.name.includes('knee')) {
              ctx.fillStyle = '#00ff00';
            } else if (keypoint.name && keypoint.name.includes('ankle')) {
              ctx.fillStyle = '#ffff00';
            }
            ctx.fill();
          }
        }
      });
    }
    
    const height = canvasRef.current.height;
    const width = canvasRef.current.width;
    
    ctx.strokeStyle = 'aqua';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(0, height * 0.45);
    ctx.lineTo(width, height * 0.45);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, height * 0.75);
    ctx.lineTo(width, height * 0.75);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(width - 40, height - (squatDepthRef.current / 100) * height, 30, (squatDepthRef.current / 100) * height);
    
    ctx.fillStyle = 'white';
    ctx.fillText(`${Math.round(squatDepthRef.current)}%`, width - 35, height - 10);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`State: ${countingStateRef.current.toUpperCase()}`, 10, 30);
    ctx.fillText(`Reps: ${exerciseCount}`, 10, 60);
  };

  const drawLowerBodyConnections = (ctx, keypoints) => {
    const connections = [
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];
    
    const keypointMap = {};
    keypoints.forEach(keypoint => {
      if (keypoint.name) {
        keypointMap[keypoint.name] = keypoint;
      }
    });
    
    ctx.lineWidth = 3;
    connections.forEach(([startName, endName]) => {
      const startPoint = keypointMap[startName];
      const endPoint = keypointMap[endName];
      
      if (startPoint && endPoint && 
          startPoint.score > confidenceThresholdRef.current && 
          endPoint.score > confidenceThresholdRef.current) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        
        if ((startName.includes('hip') && endName.includes('knee')) || 
            (startName.includes('knee') && endName.includes('ankle'))) {
          ctx.strokeStyle = '#ffcc00';
          ctx.lineWidth = 4;
        } else {
          ctx.strokeStyle = 'aqua';
          ctx.lineWidth = 3;
        }
        
        ctx.stroke();
      }
    });
  };

  const handleManualCount = () => {
    setExerciseCount(prev => prev + 1);
    setFeedback('Squat counted manually!');
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    setFeedback(isTracking ? 'Tracking paused' : 'Tracking started');
  };

  const resetStats = () => {
    setExerciseCount(0);
    setFeedback('Stats reset');
    countingStateRef.current = 'standing';
    isAtBottomRef.current = false;
    setHeartRate(72);
    setHeartRateHistory([]);
  };

  const renderLoadingState = () => {
    if (loadingState !== 'ready') {
      let loadingMessage = 'Initializing...';
      if (loadingState === 'models') loadingMessage = 'Loading pose detection models...';
      if (loadingState === 'camera') loadingMessage = 'Accessing camera...';
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg mb-4">{loadingMessage}</p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderErrorState = () => {
    if (errorMessage) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Error</h3>
            <p className="text-gray-300 mb-6">{errorMessage}</p>
            {showManualMode && (
              <button 
                onClick={() => {
                  setErrorMessage('');
                  setLoadingState('ready');
                  setShowManualMode(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Continue with Manual Mode
              </button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 p-3 bg-blue-900/60 border border-blue-400/30 rounded-xl text-blue-200 text-center">
          <strong>Tip:</strong> Make sure your full body is visible in the camera, with good lighting. For squats, position the camera to your side and keep your hips and knees in the frame.
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a148c4] to-[#4848c4] mb-0">
            Squats Trainer
          </h1>
          <Link to="/" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Back to Menu
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Your Workout</h2>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-indigo-400">{exerciseCount}</p>
              </div>
            </div>

            {/* Heart Rate Monitor Section */}
            <div className="mb-6 bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <h2 className="text-xl font-bold mb-3">Heart Rate Monitor</h2>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl font-bold" style={{ color: heartRate > 140 ? '#ef4444' : heartRate > 120 ? '#f59e0b' : '#3b82f6' }}>
                  {heartRate}
                  <span className="text-lg ml-1">BPM</span>
                </div>
                <div className={`text-lg font-medium ${getZoneColor()}`}>
                  {getHeartRateZone()}
                </div>
              </div>
              
              <div className="h-2 bg-gray-600 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500" 
                  style={{ width: `${Math.min(100, (heartRate - 60) / 1.2)}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-gray-400 flex justify-between">
                <span>Resting</span>
                <span>Peak</span>
              </div>
              
              {/* Heart rate history graph */}
              <div className="mt-4 h-20 relative">
                <div className="absolute inset-0 flex items-end">
                  {heartRateHistory.map((entry, index) => (
                    <div 
                      key={index}
                      className="flex-1 h-full flex items-end"
                    >
                      <div 
                        className="w-full bg-blue-500 rounded-t-sm"
                        style={{ 
                          height: `${((entry.rate - 60) / 120) * 100}%`,
                          backgroundColor: entry.rate > 140 ? '#ef4444' : entry.rate > 120 ? '#f59e0b' : '#3b82f6'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Controls</h2>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={toggleTracking}
                  className={`${isTracking 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'} 
                    px-4 py-2 rounded-lg font-bold transition-colors`}
                  disabled={loadingState !== 'ready'}
                >
                  {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                </button>
                
                <button 
                  onClick={resetStats}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  Reset Counter
                </button>
                
                {showManualMode && (
                  <button 
                    onClick={handleManualCount}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors mt-4"
                  >
                    Count Squat Manually
                  </button>
                )}
              </div>
              <div className='flex items-center justify-center'>
                <img src={squat} alt="" className='rounded-xl mt-4' />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-3">Tips for Squats</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Position camera to see your lower body</li>
                <li>Feet shoulder-width apart</li>
                <li>Keep chest up and back straight</li>
                <li>Knees should track over toes</li>
                <li>Lower until thighs are parallel to ground</li>
                <li>Keep weight in heels</li>
                <li>Keep knees behind toes</li>
              </ul>
            </div>
          </div>
          
          {/* Middle & Right Column - Camera/Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
                
                {/* Render loading state */}
                {renderLoadingState()}
                
                {/* Render error state */}
                {renderErrorState()}
                
                {/* Overlay Elements */}
                {loadingState === 'ready' && (
                  <>
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {isTracking ? 'Tracking Active' : 'Tracking Paused'}
                      </div>
                    </div>
                    
                    {/* Exercise Counter */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-black/60 text-white px-4 py-2 rounded-lg">
                        <span className="text-3xl font-bold">{exerciseCount}</span>
                        <span className="ml-2">Squats</span>
                      </div>
                    </div>
                    
                    {/* Squat Depth Meter */}
                    <div className="absolute top-20 right-4 z-20">
                      <div className="bg-black/60 text-white px-2 py-2 rounded-lg text-sm">
                        <div className="text-center mb-1">Depth</div>
                        <div className="w-6 h-32 bg-gray-700 rounded-full mx-auto relative overflow-hidden">
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-b-full transition-all duration-300"
                            style={{ height: `${squatDepthRef.current}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feedback */}
                    {feedback && (
                      <div className="absolute bottom-4 left-4 right-4 z-20 text-center">
                        <div className="bg-black/60 text-white px-4 py-2 rounded-lg inline-block mx-auto">
                          {feedback}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Manual Mode Overlay */}
                {showManualMode && loadingState === 'ready' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Manual Tracking Mode</h3>
                      <p className="text-white mb-4">Press the button to count your squats</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Progress */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Today's Goal</h3>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (exerciseCount / 15) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>0</span>
                  <span>Goal: 15 squats</span>
                </div>
              </div>
              
              {/* Quick Guide */}
              <div className="mt-6 bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Perfect Squat Form</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Stand with feet slightly wider than hip-width apart</p>
                  <p>• Toes slightly turned out, weight in heels</p>
                  <p>• Keep your chest up and shoulders back</p>
                  <p>• Engage your core throughout the movement</p>
                  <p>• Push hips back and down as if sitting in a chair</p>
                  <p>• Lower until thighs are at least parallel to floor</p>
                  <p>• Keep knees in line with toes (don't collapse inward)</p>
                  <p>• Push through heels to return to standing position</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squats;