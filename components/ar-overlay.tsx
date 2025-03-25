import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Compass, MapPin, Camera, AlertCircle } from 'lucide-react';

interface AROverlayProps {
  latitude?: number;
  longitude?: number;
  heading?: number;
  mode?: 'ar' | 'vr';
  onClose?: () => void;
}

export function AROverlay({ latitude, longitude, heading = 0, mode = 'ar', onClose }: AROverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<{
    alpha: number;
    beta: number;
    gamma: number;
  } | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationOffset, setCalibrationOffset] = useState(0);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        setError('Camera access denied. Please enable camera access to use AR mode.');
        console.error('Error accessing camera:', err);
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        setDeviceOrientation({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });
      }
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      if (event.acceleration && event.acceleration.x !== null) {
        // Handle motion data for better orientation tracking
      }
    };

    if (mode === 'ar') {
      requestCameraPermission();
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [mode]);

  const handleCalibrate = () => {
    setIsCalibrating(true);
    if (deviceOrientation?.alpha !== undefined) {
      setCalibrationOffset(deviceOrientation.alpha);
    }
    setTimeout(() => setIsCalibrating(false), 1000);
  };

  const getAdjustedHeading = () => {
    if (!deviceOrientation?.alpha) return heading || 0;
    return (deviceOrientation.alpha - calibrationOffset + 360) % 360;
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/30">
        <div className="flex items-center gap-2">
          {mode === 'ar' ? (
            <Camera className="w-5 h-5 text-white" />
          ) : (
            <MapPin className="w-5 h-5 text-white" />
          )}
          <h3 className="text-white font-semibold">{mode.toUpperCase()} Mode</h3>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Camera Feed or VR Content */}
      <div className="flex-1 relative">
        {mode === 'ar' ? (
          !hasPermission ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-white mb-4">{error || 'Requesting camera access...'}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-white mb-4">VR Mode Enabled</p>
              <p className="text-sm text-white/60">Use your VR headset to view the panorama</p>
            </div>
          </div>
        )}

        {/* AR/VR Overlay Controls */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Compass */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
            <div className="relative">
              <Compass 
                className="w-6 h-6 text-white" 
                style={{ transform: `rotate(${getAdjustedHeading()}deg)` }} 
              />
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full" />
            </div>
          </div>

          {/* Calibration Button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="sm"
              className={`${isCalibrating ? 'animate-pulse' : ''}`}
              onClick={handleCalibrate}
            >
              Calibrate
            </Button>
          </div>

          {/* Location Info */}
          {(latitude && longitude) && (
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-white text-sm">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            </div>
          )}

          {/* Device Orientation Info */}
          {deviceOrientation && (
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
              <div className="text-white text-xs">
                <div>Alpha: {deviceOrientation.alpha.toFixed(1)}°</div>
                <div>Beta: {deviceOrientation.beta.toFixed(1)}°</div>
                <div>Gamma: {deviceOrientation.gamma.toFixed(1)}°</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 