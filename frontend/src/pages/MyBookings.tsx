import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { format, addMinutes, isBefore, isAfter, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const API_BASE_URL = import.meta.env.VITE_API_URL ? 
  `${import.meta.env.VITE_API_URL}/api/user/trainer` : 
  'http://localhost:5000/api/user/trainer';

interface TrainingSession {
  _id: string;
  trainer: {
    _id: string;
    name: string;
    specialization: string;
  };
  scheduledTime: string;
  duration: number;
  status: string;
  meetingLink: string;
  roomId?: string;
}

const MyBookings = () => {
  const { user, forceInitUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [manualUserId, setManualUserId] = useState<string>("");
  const [showManualIdInput, setShowManualIdInput] = useState<boolean>(false);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    // Try to get user from localStorage for debugging
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setLocalUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  }, []);

  // Function to get current user ID with improved fallback
  const getCurrentUserId = (): string | null => {
    console.log("Attempting to get current user ID");
    
    // Check context user
    if (user) {
      if (user._id) {
        console.log("Found _id in context user:", user._id);
        return user._id;
      } else if (user.id) {
        return user.id;
      } else {
        console.log("Context user exists but has no _id or id field:", user);
      }
    }
    
    // Check local user state
    if (localUser) {
      if (localUser._id) {
        return localUser._id;
      } else if (localUser.id) {
        return localUser.id;
      } else {
        console.log("Local user exists but has no _id or id field:", localUser);
      }
    }
    
    if (manualUserId) {
      return manualUserId;
    }
    
    try {
      const storedUserStr = localStorage.getItem('user');
      if (storedUserStr) {
        console.log("Found user string in localStorage");
        const storedUser = JSON.parse(storedUserStr);
        console.log("Parsed user from localStorage:", storedUser);
        
        if (storedUser) {
          if (storedUser._id) {
            console.log("Found _id in localStorage user:", storedUser._id);
            return storedUser._id;
          } else if (storedUser.id) {
            console.log("Found id in localStorage user:", storedUser.id);
            return storedUser.id;
          } else {
            console.log("localStorage user exists but has no _id or id field:", storedUser);
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
    
    console.log("Failed to find user ID from any source");
    return null;
  };

  useEffect(() => {
    const userId = getCurrentUserId();
    
    if (userId) {
      fetchUserSessions(userId);
    } else {
      const result = forceInitUser();
      if (result.success && result.user) {
        console.log("Successfully force loaded user:", result.user);
        const userId = result.user._id || result.user.id;
        if (userId) {
          fetchUserSessions(userId);
        } else {
          setError("User ID not found even after force loading. Please log in again or use the debug options.");
          setLoading(false);
          setShowManualIdInput(true);
        }
      } else {
        console.error("Failed to force load user");
        setError("User ID not found. Please log in again or use the debug options.");
        setLoading(false);
        setShowManualIdInput(true);
      }
    }
  }, [user, manualUserId]);

  const fetchUserSessions = async (userId?: string) => {
    setLoading(true);
    setError(null);

    let userIdToFetch = userId || getCurrentUserId();
    
    if (!userIdToFetch) {
      console.log("No user ID available for fetching sessions, trying force load");
      const result = forceInitUser();
      console.log("Force load result:", { 
        success: result.success, 
        user: result.user ? {
          _id: result.user._id,
          id: result.user.id,
          name: result.user.name,
          role: result.user.role
        } : null 
      });
      
      if (result.success && result.user) {
        userIdToFetch = result.user._id || result.user.id || null;
        
        // Also update localUser if not set
        if (!localUser) {
          setLocalUser(result.user);
        }
      }
    }
    
    if (!userIdToFetch) {
      setError("User ID not found. Please log in again or use manual ID option.");
      setLoading(false);
      setShowManualIdInput(true);
      return;
    }

    try {
      const apiEndpoint = `${API_BASE_URL}/sessions/${userIdToFetch}`;
      console.log("Final API endpoint:", apiEndpoint);
      
      const response = await axios.get(apiEndpoint);
      
      if (response.data && response.data.sessions) {
        console.log("Sessions found:", response.data.sessions.length);
        setSessions(response.data.sessions);
        
        if (response.data.sessions.length === 0) {
          setError("No training sessions found for your account");
        }
      } else {
        console.log("No sessions in response or incorrect response format:", response.data);
        setError("No sessions found");
      }
    } catch (error: any) {
      console.error("Error fetching training sessions:", error);
      console.error("Response details:", error.response?.status, error.response?.data);
      setError(error.response?.data?.message || "Failed to load training sessions");
      toast.error("Failed to load your training sessions");
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      if (!sessionId) {
        toast.error("Invalid session ID");
        return;
      }
      if (!window.confirm("Are you sure you want to cancel this session?")) {
        return;
      }
      
      const response = await axios.post(`${API_BASE_URL}/cancelSession`, {
        sessionId
      });
      
      if (response.data && response.data.session) {
        toast.success("Training session cancelled successfully");
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session._id === sessionId 
              ? { ...session, status: 'REJECTED' } 
              : session
          )
        );
      }
    } catch (error: any) {
      console.error("Error cancelling session:", error);
      toast.error(error.response?.data?.message || "Failed to cancel session");
    }
  };

  const handleJoinSession = (meetingLink: string, session: TrainingSession) => {
    console.log("Joining meeting with link:", meetingLink);
    
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
        // Try to handle old format
        try {
          const url = new URL(meetingLink);
          const params = new URLSearchParams(url.search);
          const paramRoomId = params.get('roomID');
          if (paramRoomId) {
            extractedRoomId = paramRoomId;
          }
        } catch (error) {
          console.error("Error parsing meeting link:", error);
        }
      }
    }
    if (!extractedRoomId) {
      extractedRoomId = `meeting_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      console.log("Generated new room ID:", extractedRoomId);
    }

    const meetingUrl = `${window.location.origin}/video-meeting/${extractedRoomId}`;
    
    const toastId = toast.custom(
      <div className="bg-white dark:bg-black text-black dark:text-white p-4 sm:p-6 rounded-lg shadow-lg max-w-[90vw] sm:max-w-md">
        <h3 className="text-base sm:text-lg font-semibold mb-3">How would you like to join?</h3>
        <div className="space-y-3">
          <button 
            className="w-full bg-primary  dark:bg-blue-500 text-black dark:text-white py-2 px-4 rounded-md flex items-center justify-center"
            onClick={() => {
              toast.dismiss(toastId);
              // Navigate directly to the video meeting page
              navigate(`/video-meeting/${extractedRoomId}`);
            }}
          >
            <Video className=" bg-white  dark:bg-black text-black dark:text-white w-4 h-4 mr-2 flex-shrink-0" />
            <span>Join in this app</span>
          </button>
          
          <button 
            className="w-full bg-white dark:bg-black dark:text-white border border-primary text-primary py-2 px-4 rounded-md flex items-center justify-center"
            onClick={() => {
              toast.dismiss(toastId);
              window.open(meetingUrl, '_blank');
            }}
          >
            <ExternalLink className="bg-white dark:bg-black text-black dark:text-white w-4 h-4 mr-2 flex-shrink-0" />
            <span>Open in new tab</span>
          </button>
        </div>
      </div>,
      { duration: 10000 }
    );
  };

  // Map database status to UI status for filtering
  const mapStatusForUI = (dbStatus: string): string => {
    const normalizedStatus = dbStatus.toUpperCase();
    
    switch (normalizedStatus) {
      case 'PENDING':
        return 'upcoming';
      case 'ACCEPTED':
        return 'upcoming'; 
      case 'COMPLETED':
        return 'completed'; 
      case 'REJECTED':
      case 'CANCELLED':
        return 'cancelled';
      default:
        console.warn(`Unknown session status: ${normalizedStatus}, defaulting to '${dbStatus.toLowerCase()}'`);
        return dbStatus.toLowerCase();
    }
  };

  const filteredSessions = sessions.filter(session => {
    const uiStatus = mapStatusForUI(session.status);
    return uiStatus === activeTab;
  });

  const isSessionJoinable = (scheduledTime: string) => {
    const sessionDate = parseISO(scheduledTime);
    const now = new Date();
    const fifteenMinutesBefore = addMinutes(sessionDate, -15);
    const oneHourAfter = addMinutes(sessionDate, 60);
    
    return isAfter(now, fifteenMinutesBefore) && isBefore(now, oneHourAfter);
  };

  const getStatusColor = (status: string) => {
    const uiStatus = mapStatusForUI(status);
    
    switch (uiStatus) {
      case "upcoming":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (uiStatus: string) => {
    switch (uiStatus) {
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleForceRefresh = () => {
    const userId = getCurrentUserId();
    if (userId) {
      fetchUserSessions(userId);
    } else {
      toast.error("No user ID available");
    }
  };
  
  const handleManualIdLoad = () => {
    if (manualUserId) {
      toast.success("Using manual user ID: " + manualUserId);
      fetchUserSessions(manualUserId);
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
      console.log("User loaded:", result.user);

      if (!localUser) {
        setLocalUser(result.user);
      }
      fetchUserSessions(userId as string);
    } else {
      toast.error("Failed to load user from localStorage");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Training Sessions</h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className="capitalize flex-1 sm:flex-none"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading your sessions...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleForceRefresh}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Bookings Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSessions.map((session) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{session.trainer.name}</span>
                    </CardTitle>
                    <Badge className={`${getStatusColor(session.status)} w-fit`}>
                      {getStatusIcon(mapStatusForUI(session.status))}
                      <span className="ml-1 capitalize">{mapStatusForUI(session.status)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{format(parseISO(session.scheduledTime), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">
                        {format(parseISO(session.scheduledTime), "h:mm a")} - {session.duration || 60} minutes
                      </span>
                    </div>
                    {mapStatusForUI(session.status) === "upcoming" && isSessionJoinable(session.scheduledTime) && (
                      <>
                        <Button
                          className="w-full"
                          onClick={() => handleJoinSession(session.meetingLink, session)}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Session
                        </Button>
                      </>
                    )}
                    
                    {/* Joinable Soon Message */}
                    {mapStatusForUI(session.status) === "upcoming" && !isSessionJoinable(session.scheduledTime) && (
                      <div className="text-sm text-center p-2 bg-slate-50 rounded-md text-slate-500">
                        <p>Join button will appear 15 minutes before session</p>
                      </div>
                    )}
                    
                    {/* Cancel Button - only show for upcoming sessions */}
                    {mapStatusForUI(session.status) === "upcoming" && (
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => cancelSession(session._id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Session
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No {activeTab} training sessions found.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 