import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const Meet = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const containerRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  useEffect(() => {
    const peer = new Peer({
      debug: 3
    });
    setPeer(peer);

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            setConnected(true);
            startCallTimer();
          });
          call.on("close", endCall);
          call.on("error", endCall);
        })
        .catch(err => {
          console.error("Failed to get local stream", err);
        });
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      setControlsTimeout(setTimeout(() => setShowControls(false), 3000));
    };

    document.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      if (callTimer) clearInterval(callTimer);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      peer.destroy();
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const startCallTimer = () => {
    if (callTimer) clearInterval(callTimer);
    setCallDuration(0);
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const formatCallDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins < 10 && hrs > 0 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const callPeer = () => {
    if (!remotePeerId || !peer) return;

    setIsCalling(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
        const call = peer.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsCalling(false);
          setConnected(true);
          startCallTimer();
        });
        call.on("close", endCall);
        call.on("error", endCall);
      })
      .catch(err => {
        console.error("Failed to get local stream", err);
        setIsCalling(false);
      });
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId).then(() => {
      setShowCopyNotification(true);
      setTimeout(() => {
        setShowCopyNotification(false);
      }, 2000);
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (callTimer) clearInterval(callTimer);
    setCallDuration(0);
    setConnected(false);
    setIsCalling(false);
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#111827',
        overflow: 'hidden'
      }}
    >
      {/* Main video container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Remote video (main) */}
        <div style={{
          position: 'relative',
          flex: 1,
          backgroundColor: connected ? 'black' : '#111827',
          transition: 'all 0.3s'
        }}>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {!connected && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#111827'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                maxWidth: '28rem'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto 1rem',
                  borderRadius: '9999px',
                  backgroundColor: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{
                    width: '2rem',
                    height: '2rem',
                    color: '#6b7280'
                  }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: '#d1d5db',
                  marginBottom: '0.5rem'
                }}>Waiting for connection</h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem'
                }}>
                  {isCalling ? 'Connecting to Expert...' : 'Enter a Expert ID and call or wait for an incoming call'}
                </p>
                
                {/* Connection form */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <input
                    type="text"
                    placeholder="Enter Remote SME ID"
                    value={remotePeerId}
                    onChange={(e) => setRemotePeerId(e.target.value)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#e5e7eb',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={callPeer}
                    disabled={isCalling || !remotePeerId}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: isCalling || !remotePeerId ? '#374151' : '#2563eb',
                      color: 'white',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isCalling || !remotePeerId ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isCalling ? (
                      <>
                        <svg style={{
                          animation: 'spin 1s linear infinite',
                          marginRight: '0.5rem',
                          width: '1rem',
                          height: '1rem',
                          color: 'white'
                        }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      "Start Call"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Local video (pip) */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            width: '12rem',
            height: '9rem',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s',
            opacity: showControls ? 1 : 0
          }}>
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: isVideoOff ? 'none' : 'block'
              }}
            />
            {isVideoOff && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '9999px',
                  backgroundColor: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    color: '#6b7280'
                  }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
        padding: '1rem',
        transition: 'all 0.3s',
        opacity: showControls || !connected ? 1 : 0,
        transform: showControls || !connected ? 'translateY(0)' : 'translateY(2.5rem)'
      }}>
        <div style={{
          maxWidth: '56rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Call duration */}
          {connected && (
            <div style={{
              color: 'white',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {formatCallDuration(callDuration)}
            </div>
          )}
          
          {/* Control buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            {/* Mute button */}
            <button 
              onClick={toggleMute} 
              style={{
                padding: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: isMuted ? '#dc2626' : 'rgba(55, 65, 81, 0.7)',
                transition: 'background-color 0.2s'
              }}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'white'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'white'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            
            {/* Video button */}
            <button 
              onClick={toggleVideo} 
              style={{
                padding: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: isVideoOff ? '#dc2626' : 'rgba(55, 65, 81, 0.7)',
                transition: 'background-color 0.2s'
              }}
              aria-label={isVideoOff ? "Turn on video" : "Turn off video"}
            >
              {isVideoOff ? (
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'white'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'white'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            
            {/* End call button */}
            {connected && (
              <button 
                onClick={endCall} 
                style={{
                  padding: '0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: '#dc2626',
                  transition: 'background-color 0.2s'
                }}
                aria-label="End call"
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'white'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
              </button>
            )}
            
            {/* Fullscreen button */}
            <button 
              onClick={toggleFullscreen} 
              style={{
                padding: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(55, 65, 81, 0.7)',
                transition: 'background-color 0.2s'
              }}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'white'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'white'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Peer ID panel (top left) */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        backdropFilter: 'blur(4px)',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        transition: 'all 0.3s',
        opacity: showControls || !connected ? 1 : 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            color: '#d1d5db',
            fontSize: '0.875rem'
          }}>Your ID:</div>
          <div style={{
            fontFamily: 'monospace',
            color: 'white',
            backgroundColor: '#374151',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem'
          }}>{peerId || "Generating..."}</div>
          <button
            onClick={copyPeerId}
            style={{
              color: '#d1d5db',
              padding: '0.25rem',
              transition: 'color 0.2s'
            }}
            title="Copy SME ID"
            disabled={!peerId}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{
              width: '1.25rem',
              height: '1.25rem'
            }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Copy Notification Popup */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s',
        transform: showCopyNotification ? "translateY(0)" : "translateY(2rem)",
        opacity: showCopyNotification ? 1 : 0,
        pointerEvents: showCopyNotification ? 'auto' : 'none',
        display: 'flex',
        alignItems: 'center'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{
          width: '1.25rem',
          height: '1.25rem',
          marginRight: '0.5rem',
          color: '#4ade80'
        }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Copied to clipboard
      </div>
    </div>
  );
};

export default Meet;