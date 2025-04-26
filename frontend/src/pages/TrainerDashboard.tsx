import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import axios from 'axios';
import { RefreshCw, CheckCircle2, XCircle, Video, Clock, Calendar, AlertCircle, ExternalLink } from 'lucide-react';

// API URLs
const API_BASE_URL = import.meta.env.VITE_API_URL ? 
  `${import.meta.env.VITE_API_URL}/api/user/trainer` : 
  'http://localhost:5000/api/user/trainer';

interface TrainingSession {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  trainer: {
    _id: string;
    name: string;
  };
  scheduledTime?: string;
  duration: number;
  status: string;
  price?: number;
  meetingLink?: string;
  date?: string;
  time?: string;
  roomId?: string;
}

export default function TrainerDashboard() {
  const { user, isAuthenticated, logout, forceInitUser, token } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<TrainingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<any>(null);
  const [manualUserId, setManualUserId] = useState<string>("");
  const [showManualIdInput, setShowManualIdInput] = useState<boolean>(false);

  // Check for user in context and localStorage
  useEffect(() => {
    // Log auth state
    // console.log("Auth state:", { isAuthenticated, hasUser: !!user, token: !!token });
    
    if (!user) {
      console.log("No user in context, trying to force load");
      
      // Try to force load user from localStorage
      const result = forceInitUser();
      if (result.success) {
        console.log("Successfully force loaded user from localStorage:", result.user);
        // Log the user ID to verify it was loaded correctly
        const userId = result.user?._id || result.user?.id;
        // console.log("User ID from forced load:", userId);
      } else {
        try {
          const storedUserStr = localStorage.getItem('user');
          if (storedUserStr) {
            const storedUser = JSON.parse(storedUserStr);
            // console.log("Retrieved user from localStorage:", storedUser);
            setLocalUser(storedUser);
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
    } else {
      console.log("User from context found");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchSessions();
  }, [user, localUser, manualUserId]);

  const getCurrentUserId = (): string | null => {
    console.log("Attempting to get current user ID");
    
    // Check context user
    if (user) {
      if (user._id) {
        console.log("Found _id in context user:", user._id);
        return user._id;
      } else if (user.id) {
        console.log("Found id in context user:", user.id);
        return user.id;
      } else {
        console.log("Context user exists but has no _id or id field:", user);
      }
    }
    
    // Check local user state
    if (localUser) {
      if (localUser._id) {
        // console.log("Found _id in local user state:", localUser._id);
        return localUser._id;
      } else if (localUser.id) {
        // console.log("Found id in local user state:", localUser.id);
        return localUser.id;
      } else {
        // console.log("Local user exists but has no _id or id field:", localUser);
      }
    }
    if (manualUserId) {
      console.log("Using manually set user ID:", manualUserId);
      return manualUserId;
    }
    
    try {
      const storedUserStr = localStorage.getItem('user');
      if (storedUserStr) {

        const storedUser = JSON.parse(storedUserStr);
        
        if (storedUser) {
          if (storedUser._id) {
            // console.log("Found _id in localStorage user:", storedUser._id);
            return storedUser._id;
          } else if (storedUser.id) {
            // console.log("Found id in localStorage user:", storedUser.id);
            return storedUser.id;
          } else {
          }
        } else {
          console.log("Failed to parse valid user object from localStorage");
        }
      } else {
        console.log("No user found in localStorage");
      }
    } catch (e) {
      console.error("Error retrieving user from localStorage:", e);
    }
    
    return null;
  };

  const isAuthReady = (): boolean => {
    if (isAuthenticated && user && (user._id || user.id)) {
      return true;
    }

    if (token === null) {
      return true;
    }
    
    if (localUser && (localUser._id || localUser.id)) {
      return true;
    }
    
    if (manualUserId) {
      return true;
    }
    
    // Otherwise, auth context is not fully initialized
    return false;
  };

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    // Check if auth is ready before proceeding
    if (!isAuthReady()) {
      
      const result = forceInitUser();
      
      if (result.success) {
        
        await new Promise(resolve => setTimeout(resolve, 300));
        

      } else {
        console.error("Failed to load auth context");
        setError("Authentication is not ready. Please try logging in again or use the Debug options.");
        setIsLoading(false);
        setShowManualIdInput(true);
        return;
      }
    }
    
    
    try {
      let trainerId = getCurrentUserId();
      
      if (!trainerId) {
        console.log("No trainer ID found, trying to force load user");
        const result = forceInitUser();
        if (result.success && result.user) { 
          // Try using the directly returned user object first
          const directId = result.user._id || result.user.id;
          if (directId) {
            trainerId = directId;
          } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            trainerId = getCurrentUserId();
          }
        }
      }
      
      console.log("Current user ID from getCurrentUserId:", trainerId);
      
      if (!trainerId) {
        console.error("No user ID found in context or localStorage");
        setError("User ID not found. Please try logging in again or use the Debug options.");
        setIsLoading(false);
        setShowManualIdInput(true); // Show manual ID input to help user
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/trainer/${trainerId}/sessions`);
      
      if (response.data && response.data.sessions) {

        if (response.data.sessions.length > 0) {
          console.log("First session:", JSON.stringify(response.data.sessions[0], null, 2));
        }
        setSessions(response.data.sessions);
      } else if (Array.isArray(response.data)) {

        if (response.data.length > 0) {
          console.log("First session:", JSON.stringify(response.data[0], null, 2));
        }
        setSessions(response.data);
      } else {
        // console.log("No sessions found in response:", response.data);
        setSessions([]);
      }
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      console.error("Response details:", error.response?.status, error.response?.data);
      
      // Provide more specific error message based on the HTTP status
      let errorMsg = "Failed to load training sessions";
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMsg = "The trainer sessions endpoint was not found. Please check the API configuration.";
        } else if (error.response.status === 401 || error.response.status === 403) {
          errorMsg = "You're not authorized to access this resource. Please log in again.";
        } else if (error.response.status >= 500) {
          errorMsg = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMsg = "No response from server. Please check your connection.";
      }
      
      setError(error.response?.data?.message || errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter upcoming sessions whenever sessions change
  useEffect(() => {
    const now = new Date();
    const upcoming = sessions.filter(session => {
      // Only include accepted sessions with a scheduled time in the future
      const normalizedStatus = session.status.toUpperCase();
      if (normalizedStatus !== 'ACCEPTED' || !session.scheduledTime) return false;
      const scheduledTime = new Date(session.scheduledTime);
      return scheduledTime > now;
    });
    
    // Sort by scheduled time (closest first)
    upcoming.sort((a, b) => {
      const timeA = new Date(a.scheduledTime || 0).getTime();
      const timeB = new Date(b.scheduledTime || 0).getTime();
      return timeA - timeB;
    });
    
    setUpcomingSessions(upcoming);
  }, [sessions]);

  // Generate a meeting link using frontend-only approach
  const generateMeetingLink = async (userId: string) => {
    try {
      // Create a unique room ID for the meeting
      const roomID = `meeting_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      
      // Create a meeting link that only contains the room ID
      const meetingLink = `${window.location.origin}/meeting/join/${roomID}`;
      
      console.log("Generated meeting link:", meetingLink);
      
      return {
        roomId: roomID,
        meetingLink
      };
    } catch (error) {
      console.error("Error generating meeting link:", error);
      toast.error("Failed to generate meeting link");
      return null;
    }
  };

  const handleAcceptSession = async (session: any) => {
    setIsLoading(true);
    setSelectedSession(session);
    
    let scheduledTime;
    
    // Handle different date formats and possible undefined values
    try {
      if (session.scheduledTime) {
        // If we already have a scheduledTime field, use it directly
        const dateObj = new Date(session.scheduledTime);
        if (!isNaN(dateObj.getTime())) {
          scheduledTime = dateObj.toISOString();
        } else {
          scheduledTime = new Date().toISOString();
        }
      } else if (session.date) {
        // If we have a date field but no scheduledTime
        const dateObj = new Date(session.date);
        
        // Check if the date is valid before converting to ISO string
        if (!isNaN(dateObj.getTime())) {
          scheduledTime = dateObj.toISOString();
        } else {
          // Use current date/time as fallback
          console.warn("Invalid date format in session, using current date:", session.date);
          scheduledTime = new Date().toISOString();
        }
      } else {
        // No valid date field, use current date/time
        console.warn("No valid date found in session, using current date");
        scheduledTime = new Date().toISOString();
      }
      
      // console.log("Using scheduled time:", scheduledTime);
    } catch (error) {
      console.error("Error processing date:", error);
      scheduledTime = new Date().toISOString();
    }
    
    try {
      // Generate meeting link for the user
      const meetingLinkData = await generateMeetingLink(session.user._id);
      
      if (!meetingLinkData) {
        throw new Error("Failed to generate meeting link");
      }
      
      await axios.post(`${API_BASE_URL}/accept`, {
        sessionId: session._id,
        scheduledTime: scheduledTime,
        meetingLink: meetingLinkData.meetingLink,
        roomId: meetingLinkData.roomId
      });

      toast.success("Session accepted successfully");
      fetchSessions();
    } catch (error) {
      console.error("Error accepting session:", error);
      toast.error("Failed to accept session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSession = async (sessionId: string) => {
    try {
      // Update to use the correct API endpoint
      const response = await axios.post(`${API_BASE_URL}/reject`, {
        sessionId
      });

      if (response.data) {
        toast.success('Session rejected successfully');
        fetchSessions();
      }
    } catch (error: any) {
      console.error("Error rejecting session:", error);
      toast.error(error.response?.data?.message || "Failed to reject session");
    }
  };

  const handleJoinSession = (meetingLink: string, session: TrainingSession) => {
    if (!meetingLink) {
      toast.error("Meeting link is not available. Please contact support.");
      return;
    }
    
    let extractedRoomId: string | undefined = session.roomId;
    
    if (!extractedRoomId && meetingLink) {
      if (meetingLink.includes('/meeting/join/')) {
        const parts = meetingLink.split('/meeting/join/');
        extractedRoomId = parts[1];
      } else if (meetingLink.includes('roomID=')) {
        try {
          const url = new URL(meetingLink);
          const params = new URLSearchParams(url.search);
          const paramRoomId = params.get('roomID');
          if (paramRoomId) {
            extractedRoomId = paramRoomId;
          }
        } catch (error) {
          toast.error("Invalid meeting link format");
          return;
        }
      }
    }

    if (!extractedRoomId) {
      toast.error("Could not determine meeting room ID");
      return;
    }

    // Navigate directly to the video meeting page
    navigate(`/video-meeting/${extractedRoomId}`);
  };

  // Function to mark a session as completed
  const handleCompleteSession = async (sessionId: string) => {
    try {
      // Confirm before completing
      if (!window.confirm("Are you sure you want to mark this session as completed? This action cannot be undone.")) {
        return;
      }
      
      // Call the API to mark the session as completed
      const response = await axios.post(`${API_BASE_URL}/completeSession`, {
        sessionId
      });
      
      if (response.data) {
        toast.success("Session marked as completed successfully");
        // Refresh the sessions list
      fetchSessions();
      }
    } catch (error: any) {
      console.error("Error completing session:", error);
      toast.error(error.response?.data?.message || "Failed to mark session as completed");
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if a session is joinable (within 15 minutes before start time until 1 hour after start)
  const isSessionJoinable = (scheduledTime: string) => {
    if (!scheduledTime) return false;
    
    const sessionDate = new Date(scheduledTime);
    const now = new Date();
    // 15 minutes before
    const fifteenMinutesBefore = new Date(sessionDate.getTime() - 15 * 60000);
    // 1 hour after
    const oneHourAfter = new Date(sessionDate.getTime() + 60 * 60000);
    
    return now >= fifteenMinutesBefore && now <= oneHourAfter;
  };

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    
    try {
    const date = new Date(dateString);
      
      // First check if it's a valid date
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return 'Invalid date';
      }

      
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Date format error';
    }
  };

  //calculate time remaining
  const getTimeRemaining = (dateString: string) => {
    if (!dateString) return '';
    
    const now = new Date();
    const meetingTime = new Date(dateString);
    const diffMs = meetingTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Starting now';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} remaining`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
  };

  const getDefaultScheduledTime = () => {
    const now = new Date();
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    now.setMinutes(minutes);
    now.setHours(now.getHours() + 1);
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    // Format for datetime-local input
    return now.toISOString().slice(0, 16);
  };

  // Helper functions for buttons
  const handleForceRefresh = () => {
    fetchSessions();
  };
  
  const handleManualIdLoad = () => {
    if (manualUserId) {
      toast.success("Using manual user ID: " + manualUserId);
      fetchSessions();
    } else {
      toast.error("Please enter a user ID");
    }
  };

  const toggleManualIdInput = () => {
    setShowManualIdInput(!showManualIdInput);
  };
  
  // Helper to force load user from localStorage
  const handleForceLoadUser = () => {
    const result = forceInitUser();
    if (result.success && result.user) {
      const userId = result.user._id || result.user.id;
      toast.success(`User loaded from localStorage with ID: ${userId}`);

      if (!localUser) {
        setLocalUser(result.user);
      }
      fetchSessions();
    } else {
      toast.error("Failed to load user from localStorage");
    }
  };


  const testEndpoints = async () => {
    if (!user || !user._id) {
      toast.error('No user ID available');
      return;
    }

    const userId = user._id;
    const endpoints = [
      `${API_BASE_URL}/trainer/${userId}/sessions`,
      `${API_BASE_URL}/trainer-sessions/${userId}`
    ];

    setIsLoading(true);
    toast.loading('Testing API endpoints...');

    try {
      let foundWorkingEndpoint = false;
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing endpoint: ${endpoint}`);
          const response = await axios.get(endpoint);
          console.log(`Endpoint ${endpoint} response:`, response.data);
          
          if (response.status === 200) {
            toast.success(`Endpoint working: ${endpoint}`);
            if (response.data) {
              if (response.data.sessions) {
                console.log(`Found ${response.data.sessions.length} sessions in 'sessions' field`);
                console.log("First session:", JSON.stringify(response.data.sessions[0], null, 2));
                setSessions(response.data.sessions);
                foundWorkingEndpoint = true;
                break;
              } else if (Array.isArray(response.data)) {
                console.log(`Found ${response.data.length} sessions in array format`);
                if (response.data.length > 0) {
                  console.log("First session:", JSON.stringify(response.data[0], null, 2));
                }
                setSessions(response.data);
                foundWorkingEndpoint = true;
                break;
              }
            }
          }
        } catch (error: any) {
          console.error(`Endpoint ${endpoint} failed:`, error.message);
          console.log('Error details:', error.response?.status, error.response?.data);
        }
      }
      
      if (!foundWorkingEndpoint) {
        toast.error('No working endpoints found. Please check the API configuration.');
      }
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Trainer Dashboard</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button onClick={fetchSessions} disabled={isLoading} className="w-full sm:w-auto">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
          
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Error Loading Sessions</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Upcoming Meetings Section */}
      {upcomingSessions.length > 0 && (
        <Card className="mb-8 border-2 border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSessions.map((session) => (
                <Card key={session._id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="p-3 sm:p-4 bg-muted/50">
                    <CardTitle className="text-sm sm:text-base flex justify-between items-center">
                      <span className="truncate mr-2">Session with {session.user.name}</span>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap">
                        {session.duration || 60} min
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {session.scheduledTime ? formatDateTime(session.scheduledTime) : 
                           (session.date && session.time) ? `${session.date} at ${session.time}` : 'No time scheduled'}
                        </p>
                        {session.scheduledTime && 
                        <p className="text-xs text-muted-foreground">
                            {getTimeRemaining(session.scheduledTime)}
                        </p>
                        }
                      </div>
                    </div>
                  
                    {session.meetingLink && session.scheduledTime && isSessionJoinable(session.scheduledTime) && (
                    <Button 
                      className="w-full" 
                        onClick={() => handleJoinSession(session.meetingLink || '', session)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                    )}
                    
                    {/* Show "upcoming" message if not yet joinable */}
                    {session.scheduledTime && !isSessionJoinable(session.scheduledTime) && (
                      <div className="text-sm text-center p-2 bg-slate-50 rounded-md text-slate-500">
                        <p>Join button will appear 15 minutes before session</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !error ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3">Loading sessions...</span>
            </div>
          ) : sessions.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg border-gray-300 text-gray-500">
              <AlertCircle className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Training Sessions</h3>
              <p className="text-center mb-6 text-sm">You don't have any training sessions yet. Sessions will appear here once users book with you.</p>
              <Button 
                variant="outline" 
                onClick={fetchSessions}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
            </div>
          ) : (
          <div className="overflow-x-auto pb-2">
            <Table responsiveMode="scroll">
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">User</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead className="hidden sm:table-cell">Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Meeting</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session._id}>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="font-medium">{session.user?.name || 'Unknown User'}</div>
                        <div className="text-sm text-muted-foreground">{session.user?.email || 'No email'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[140px]">
                        {/* Show user name on mobile */}
                        <div className="font-medium sm:hidden mb-1">{session.user?.name || 'Unknown User'}</div>
                        
                        {session.scheduledTime ? (
                          <>
                            <div className="font-medium">{formatDateTime(session.scheduledTime)}</div>
                            <div className="text-xs text-muted-foreground">{getTimeRemaining(session.scheduledTime)}</div>
                          </>
                        ) : session.date && session.time ? (
                          <div className="font-medium">{session.date} at {session.time}</div>
                        ) : (
                          <div className="text-gray-500">Not scheduled</div>
                        )}
                        {/* Show duration on mobile */}
                        <div className="text-xs text-muted-foreground sm:hidden mt-1">{session.duration || 60} min</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{session.duration || 60} min</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                        {session.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {session.meetingLink && session.status.toUpperCase() === 'ACCEPTED' && isSessionJoinable(session.scheduledTime || '') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJoinSession(session.meetingLink || '', session)}
                          className="flex items-center"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Show meeting button on mobile if it's joinable */}
                      {session.meetingLink && session.status.toUpperCase() === 'ACCEPTED' && isSessionJoinable(session.scheduledTime || '') && (
                        <div className="md:hidden mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleJoinSession(session.meetingLink || '', session)}
                            className="w-full flex items-center justify-center"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join
                          </Button>
                        </div>
                      )}
                      
                      {session.status.toUpperCase() === 'PENDING' && (
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <Dialog open={isAcceptDialogOpen && selectedSession?._id === session._id} onOpenChange={(open) => {
                            setIsAcceptDialogOpen(open);
                            if (open) {
                              setSelectedSession(session);
                            }
                          }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">Accept</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Accept Training Session</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-2">
                              <div className="space-y-2">
                                  <div className="flex flex-col gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-amber-800">Client's Requested Time:</p>
                                        <p className="text-sm break-words">
                                          {session.scheduledTime ? formatDateTime(session.scheduledTime) : 
                                           session.date && session.time ? `${session.date} at ${session.time}` :
                                           'No specific time requested'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                <div className="flex items-start gap-2 p-2 bg-primary/10 rounded text-sm">
                                  <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <p>A ZegoCloud video meeting will be automatically created when you accept this session.</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="scheduledTime">Scheduled Time (Cannot be changed)</Label>
                                  <div className="border rounded-md p-2.5 bg-gray-50 text-gray-800 text-sm">
                                    {session.scheduledTime ? formatDateTime(session.scheduledTime) : 
                                     session.date && session.time ? `${session.date} at ${session.time}` :
                                     'No specific time requested'}
                                  </div>
                                  <div className="text-xs">
                                    <p className="text-muted-foreground mt-2">You are accepting this session at the time requested by the client.</p>
                                  </div>
                              </div>
                              <Button onClick={() => handleAcceptSession(session)} className="w-full">Confirm Acceptance</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectSession(session._id)}
                          className="w-full sm:w-auto whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm"
                        >
                          <XCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">Reject</span>
                        </Button>
                      </div>
                    )}
                      
                      {session.status.toUpperCase() === 'ACCEPTED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompleteSession(session._id)}
                          className="flex items-center w-full sm:w-auto whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">Mark as Completed</span>
                        </Button>
                    )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 