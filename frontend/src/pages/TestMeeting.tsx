import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Video, ArrowRight, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

// Define API_BASE_URL the same way as in other components
const API_BASE_URL = import.meta.env.VITE_API_URL ?
  `${import.meta.env.VITE_API_URL}/api/user/trainer` :
  'http://localhost:5000/api/user/trainer';

const TestMeeting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [manualLink, setManualLink] = useState('');

  const generateTestMeeting = async () => {
    if (!user?._id) {
      toast.error('You must be logged in to create a test meeting');
      return;
    }

    setIsGenerating(true);
    try {
      // Create a unique room ID for the meeting
      const roomID = `test_meeting_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      
      // Create a direct meeting link that includes the room ID
      const link = `${window.location.origin}/meeting/join/${roomID}`;
      
      console.log("Generated test meeting link:", link);
      setMeetingLink(link);
      toast.success('Test meeting link generated successfully');
    } catch (error) {
      console.error("Error generating test meeting link:", error);
      toast.error("Failed to generate test meeting link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJoinInternal = () => {
    const linkToUse = meetingLink || manualLink;
    if (!linkToUse) {
      toast.error('No meeting link available');
      return;
    }

    navigate(`/meeting-session?link=${encodeURIComponent(linkToUse)}&sessionId=test&trainerName=Test`);
  };

  const handleJoinExternal = () => {
    const linkToUse = meetingLink || manualLink;
    if (!linkToUse) {
      toast.error('No meeting link available');
      return;
    }

    window.open(linkToUse, '_blank');
  };

  const handleJoinVideoMeeting = () => {
    const linkToUse = meetingLink || manualLink;
    if (!linkToUse) {
      toast.error('No meeting link available');
      return;
    }

    // Extract room ID from the URL
    try {
      // Check if it's our new direct format or old format
      if (linkToUse.includes('/meeting/join/')) {
        // New format: /meeting/join/:roomId
        const parts = linkToUse.split('/meeting/join/');
        const roomId = parts[1];
        navigate(`/meeting/join/${roomId}`);
      } else {
        // Try to handle old format
        const url = new URL(linkToUse);
        const params = new URLSearchParams(url.search);
        const roomId = params.get('roomID');
        
        if (!roomId) {
          throw new Error('Missing required parameters in meeting link');
        }

        // Navigate to VideoMeeting component
        navigate(`/meeting/join/${roomId}`);
      }
    } catch (error) {
      console.error('Error parsing meeting link:', error);
      toast.error('Invalid meeting link format');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Meeting Test</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Test Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the button below to generate a test meeting link using your user ID.
            </p>
            
            <Button 
              onClick={generateTestMeeting} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Test Meeting Link'}
            </Button>
            
            {meetingLink && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <Label className="text-xs mb-1 block">Generated Meeting Link:</Label>
                <p className="text-xs break-all font-mono">{meetingLink}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Manual Testing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manualLink">Enter a Meeting Link:</Label>
              <Input 
                id="manualLink" 
                value={manualLink} 
                onChange={(e) => setManualLink(e.target.value)}
                placeholder="https://yourapp.com/meeting/join/..."
                className="font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Button 
          onClick={handleJoinInternal} 
          disabled={!meetingLink && !manualLink}
          className="flex items-center justify-center space-x-2"
        >
          <Video className="w-4 h-4" />
          <span>Join via MeetingSession</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <Button 
          onClick={handleJoinVideoMeeting}
          disabled={!meetingLink && !manualLink}
          variant="secondary"
          className="flex items-center justify-center space-x-2"
        >
          <Video className="w-4 h-4" />
          <span>Join via VideoMeeting</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <Button 
          onClick={handleJoinExternal}
          disabled={!meetingLink && !manualLink}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open in New Tab</span>
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Debugging Information</h2>
        <pre className="text-xs overflow-auto p-2 bg-black text-white rounded">
          {`User ID: ${user?._id || 'Not logged in'}\n`}
          {`API Base URL: ${API_BASE_URL}\n`}
          {`Has meetingLink: ${Boolean(meetingLink)}\n`}
          {`Has manualLink: ${Boolean(manualLink)}\n`}
        </pre>
      </div>
    </div>
  );
};

export default TestMeeting; 