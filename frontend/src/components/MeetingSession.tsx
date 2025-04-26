import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// This component handles a ZegoCloud meeting session
const MeetingSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse URL parameters to get meeting details
  const params = new URLSearchParams(location.search);
  const meetingLink = params.get('link');
  const sessionId = params.get('sessionId');
  const trainerName = params.get('trainerName');

  useEffect(() => {
    // Exit if no meeting link
    if (!meetingLink) {
      setError('No meeting link provided');
      return;
    }

    // Listen for messages from the iframe (if needed)
    const handleMessage = (event: MessageEvent) => {
      // Handle any messages from the ZegoCloud iframe
      if (event.data.type === 'zego_event') {
        console.log('ZegoCloud event:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [meetingLink]);

  // Handle page unload to confirm exit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave the meeting?';
      return 'Are you sure you want to leave the meeting?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBack = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      navigate('/my-bookings');
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Send message to iframe to toggle video
    const iframe = document.getElementById('meeting-frame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'toggle_video',
        enabled: !isVideoEnabled
      }, '*');
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // Send message to iframe to toggle audio
    const iframe = document.getElementById('meeting-frame') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'toggle_audio',
        enabled: !isAudioEnabled
      }, '*');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => navigate('/my-bookings')} className="mt-4">
              Back to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack} 
            className="mr-2 hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">
            {trainerName ? `Session with ${trainerName}` : 'Training Session'}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleVideo}
            className="hover:bg-primary-foreground/10"
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAudio}
            className="hover:bg-primary-foreground/10"
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Meeting Area */}
      <div className="flex-1 relative">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading meeting...</p>
            </div>
          </div>
        )}

        {meetingLink && (
          <iframe
            id="meeting-frame"
            src={meetingLink}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            onLoad={() => setIframeLoaded(true)}
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default MeetingSession; 